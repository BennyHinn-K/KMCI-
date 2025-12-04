import { db } from './connection'
import { logger, auditLogger } from '../logger'
import { z } from 'zod'

// Validation schemas
const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long').regex(
    /^[a-z0-9\-]+$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  ),
  description: z.string().optional(),
  content: z.string().optional(),
  sku: z.string().max(100, 'SKU too long').optional(),
  price: z.number().min(0, 'Price must be positive'),
  compare_price: z.number().min(0, 'Compare price must be positive').optional(),
  cost_price: z.number().min(0, 'Cost price must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
  category: z.string().max(100, 'Category too long').optional(),
  subcategory: z.string().max(100, 'Subcategory too long').optional(),
  tags: z.array(z.string()).optional(),
  weight: z.number().min(0, 'Weight must be positive').optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
    unit: z.enum(['cm', 'in', 'mm'])
  }).optional(),
  inventory_quantity: z.number().int().min(0, 'Inventory must be non-negative').default(0),
  track_inventory: z.boolean().default(true),
  allow_backorders: z.boolean().default(false),
  low_stock_threshold: z.number().int().min(0, 'Threshold must be non-negative').default(10),
  featured_image_url: z.string().url().optional(),
  status: z.enum(['draft', 'active', 'archived', 'out_of_stock']).default('draft'),
  visibility: z.enum(['visible', 'hidden']).default('visible'),
  seo_title: z.string().max(255, 'SEO title too long').optional(),
  seo_description: z.string().optional(),
  created_by: z.string().uuid('Invalid user ID')
})

const productUpdateSchema = productSchema.partial().omit({ created_by: true })

const productQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived', 'out_of_stock']).optional(),
  visibility: z.enum(['visible', 'hidden']).optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'title', 'price']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  low_stock_only: z.boolean().default(false)
})

export type Product = z.infer<typeof productSchema> & {
  id: string
  created_at: Date
  updated_at: Date
  published_at?: Date
}

export type ProductCreate = z.infer<typeof productSchema>
export type ProductUpdate = z.infer<typeof productUpdateSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>

export interface ProductWithImages extends Product {
  images: Array<{
    id: string
    image_url: string
    alt_text?: string
    display_order: number
    is_primary: boolean
  }>
}

export interface ProductsResult {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ProductsService {
  private readonly tableName = 'products'

  // Create new product
  async create(productData: ProductCreate, userId: string): Promise<Product> {
    try {
      // Validate input
      const validatedData = productSchema.parse(productData)

      // Check if slug already exists
      await this.validateUniqueSlug(validatedData.slug)

      // Check if SKU already exists (if provided)
      if (validatedData.sku) {
        await this.validateUniqueSku(validatedData.sku)
      }

      const query = `
        INSERT INTO products (
          title, slug, description, content, sku, price, compare_price, cost_price,
          currency, category, subcategory, tags, weight, dimensions, inventory_quantity,
          track_inventory, allow_backorders, low_stock_threshold, featured_image_url,
          status, visibility, seo_title, seo_description, created_by,
          created_at, updated_at, published_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW(), NOW(),
          CASE WHEN $20 = 'active' THEN NOW() ELSE NULL END
        )
        RETURNING *
      `

      const params = [
        validatedData.title,
        validatedData.slug,
        validatedData.description || null,
        validatedData.content || null,
        validatedData.sku || null,
        validatedData.price,
        validatedData.compare_price || null,
        validatedData.cost_price || null,
        validatedData.currency,
        validatedData.category || null,
        validatedData.subcategory || null,
        validatedData.tags || null,
        validatedData.weight || null,
        validatedData.dimensions ? JSON.stringify(validatedData.dimensions) : null,
        validatedData.inventory_quantity,
        validatedData.track_inventory,
        validatedData.allow_backorders,
        validatedData.low_stock_threshold,
        validatedData.featured_image_url || null,
        validatedData.status,
        validatedData.visibility,
        validatedData.seo_title || null,
        validatedData.seo_description || null,
        validatedData.created_by
      ]

      const result = await db.query(query, params)
      const product = result.rows[0]

      // Log audit trail
      auditLogger.create(
        `Product created: ${product.title}`,
        this.tableName,
        product.id,
        userId,
        { title: product.title, sku: product.sku, status: product.status }
      )

      logger.info('Product created successfully', {
        productId: product.id,
        title: product.title,
        userId
      })

      return product
    } catch (error) {
      logger.error('Failed to create product', error as Error, { productData, userId })
      throw error
    }
  }

  // Get products with filtering and pagination
  async getAll(query: ProductQuery, userId?: string): Promise<ProductsResult> {
    try {
      const validatedQuery = productQuerySchema.parse(query)
      const offset = (validatedQuery.page - 1) * validatedQuery.limit

      // Build WHERE conditions
      const conditions: string[] = []
      const params: any[] = []
      let paramIndex = 1

      if (validatedQuery.category) {
        conditions.push(`category = $${paramIndex}`)
        params.push(validatedQuery.category)
        paramIndex++
      }

      if (validatedQuery.status) {
        conditions.push(`status = $${paramIndex}`)
        params.push(validatedQuery.status)
        paramIndex++
      }

      if (validatedQuery.visibility) {
        conditions.push(`visibility = $${paramIndex}`)
        params.push(validatedQuery.visibility)
        paramIndex++
      }

      if (validatedQuery.low_stock_only) {
        conditions.push(`track_inventory = true AND inventory_quantity <= low_stock_threshold`)
      }

      if (validatedQuery.search) {
        conditions.push(`(
          LOWER(title) LIKE $${paramIndex} OR
          LOWER(description) LIKE $${paramIndex} OR
          LOWER(category) LIKE $${paramIndex} OR
          LOWER(sku) LIKE $${paramIndex}
        )`)
        params.push(`%${validatedQuery.search.toLowerCase()}%`)
        paramIndex++
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

      // Build ORDER BY clause
      const orderBy = `ORDER BY ${validatedQuery.sort_by} ${validatedQuery.sort_order.toUpperCase()}`

      // Count query
      const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`
      const countResult = await db.query(countQuery, params)
      const total = parseInt(countResult.rows[0].total)

      // Data query with pagination
      const dataQuery = `
        SELECT
          p.*,
          pr.display_name as created_by_name
        FROM products p
        JOIN profiles pr ON p.created_by = pr.user_id
        ${whereClause}
        ${orderBy}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `
      params.push(validatedQuery.limit, offset)

      const dataResult = await db.query(dataQuery, params)

      // Log access if user provided
      if (userId) {
        auditLogger.read(
          'Products queried',
          this.tableName,
          userId,
          validatedQuery
        )
      }

      return {
        data: dataResult.rows,
        pagination: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          total,
          totalPages: Math.ceil(total / validatedQuery.limit)
        }
      }
    } catch (error) {
      logger.error('Failed to get products', error as Error, { query })
      throw error
    }
  }

  // Get single product by ID
  async getById(id: string, userId?: string): Promise<Product | null> {
    try {
      const query = `
        SELECT
          p.*,
          pr.display_name as created_by_name
        FROM products p
        JOIN profiles pr ON p.created_by = pr.user_id
        WHERE p.id = $1
      `

      const result = await db.query(query, [id])

      if (result.rows.length === 0) {
        return null
      }

      const product = result.rows[0]

      // Log access if user provided
      if (userId) {
        auditLogger.read(
          `Product viewed: ${product.title}`,
          this.tableName,
          userId,
          { productId: id }
        )
      }

      return product
    } catch (error) {
      logger.error('Failed to get product by ID', error as Error, { id })
      throw error
    }
  }

  // Get product with images
  async getByIdWithImages(id: string, userId?: string): Promise<ProductWithImages | null> {
    try {
      const product = await this.getById(id, userId)
      if (!product) {
        return null
      }

      // Get product images
      const imagesQuery = `
        SELECT id, image_url, alt_text, display_order, is_primary
        FROM product_images
        WHERE product_id = $1
        ORDER BY display_order ASC, created_at ASC
      `

      const imagesResult = await db.query(imagesQuery, [id])

      return {
        ...product,
        images: imagesResult.rows
      }
    } catch (error) {
      logger.error('Failed to get product with images', error as Error, { id })
      throw error
    }
  }

  // Get product by slug
  async getBySlug(slug: string, userId?: string): Promise<Product | null> {
    try {
      const query = `
        SELECT
          p.*,
          pr.display_name as created_by_name
        FROM products p
        JOIN profiles pr ON p.created_by = pr.user_id
        WHERE p.slug = $1
      `

      const result = await db.query(query, [slug])

      if (result.rows.length === 0) {
        return null
      }

      const product = result.rows[0]

      // Log access if user provided
      if (userId) {
        auditLogger.read(
          `Product viewed by slug: ${product.title}`,
          this.tableName,
          userId,
          { slug }
        )
      }

      return product
    } catch (error) {
      logger.error('Failed to get product by slug', error as Error, { slug })
      throw error
    }
  }

  // Update product
  async update(id: string, updateData: ProductUpdate, userId: string): Promise<Product | null> {
    try {
      // Get existing product for audit trail
      const existingProduct = await this.getById(id)
      if (!existingProduct) {
        throw new Error('Product not found')
      }

      // Validate update data
      const validatedData = productUpdateSchema.parse(updateData)

      // Check unique constraints if changing
      if (validatedData.slug && validatedData.slug !== existingProduct.slug) {
        await this.validateUniqueSlug(validatedData.slug, id)
      }

      if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
        await this.validateUniqueSku(validatedData.sku, id)
      }

      // Build dynamic update query
      const updates: string[] = []
      const params: any[] = []
      let paramIndex = 1

      Object.entries(validatedData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = $${paramIndex}`)
          if (key === 'dimensions' && value) {
            params.push(JSON.stringify(value))
          } else {
            params.push(value)
          }
          paramIndex++
        }
      })

      // Always update the updated_at timestamp
      updates.push(`updated_at = NOW()`)

      // Set published_at if status changes to active
      if (validatedData.status === 'active' && existingProduct.status !== 'active') {
        updates.push(`published_at = NOW()`)
      }

      const query = `
        UPDATE products
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `
      params.push(id)

      const result = await db.query(query, params)
      const updatedProduct = result.rows[0]

      // Log audit trail
      auditLogger.update(
        `Product updated: ${updatedProduct.title}`,
        this.tableName,
        id,
        userId,
        existingProduct,
        updatedProduct
      )

      logger.info('Product updated successfully', {
        productId: id,
        title: updatedProduct.title,
        userId,
        changes: Object.keys(validatedData)
      })

      return updatedProduct
    } catch (error) {
      logger.error('Failed to update product', error as Error, { id, updateData, userId })
      throw error
    }
  }

  // Delete product
  async delete(id: string, userId: string): Promise<boolean> {
    try {
      // Get product for audit trail
      const product = await this.getById(id)
      if (!product) {
        return false
      }

      const query = 'DELETE FROM products WHERE id = $1'
      const result = await db.query(query, [id])

      if (result.rowCount === 0) {
        return false
      }

      // Log audit trail
      auditLogger.delete(
        `Product deleted: ${product.title}`,
        this.tableName,
        id,
        userId,
        product
      )

      logger.info('Product deleted successfully', {
        productId: id,
        title: product.title,
        userId
      })

      return true
    } catch (error) {
      logger.error('Failed to delete product', error as Error, { id, userId })
      throw error
    }
  }

  // Update inventory
  async updateInventory(id: string, quantity: number, userId: string): Promise<Product | null> {
    try {
      const query = `
        UPDATE products
        SET
          inventory_quantity = $1,
          updated_at = NOW(),
          status = CASE
            WHEN $1 = 0 AND track_inventory = true THEN 'out_of_stock'
            WHEN $1 > 0 AND status = 'out_of_stock' THEN 'active'
            ELSE status
          END
        WHERE id = $2
        RETURNING *
      `

      const result = await db.query(query, [quantity, id])

      if (result.rowCount === 0) {
        return null
      }

      const product = result.rows[0]

      // Log audit trail
      auditLogger.update(
        `Product inventory updated: ${product.title}`,
        this.tableName,
        id,
        userId,
        null,
        { inventory_quantity: quantity }
      )

      logger.info('Product inventory updated', {
        productId: id,
        title: product.title,
        newQuantity: quantity,
        userId
      })

      return product
    } catch (error) {
      logger.error('Failed to update inventory', error as Error, { id, quantity, userId })
      throw error
    }
  }

  // Get low stock products
  async getLowStock(userId?: string): Promise<Product[]> {
    try {
      const query = `
        SELECT
          p.*,
          pr.display_name as created_by_name
        FROM products p
        JOIN profiles pr ON p.created_by = pr.user_id
        WHERE p.track_inventory = true
          AND p.inventory_quantity <= p.low_stock_threshold
          AND p.status = 'active'
        ORDER BY p.inventory_quantity ASC
      `

      const result = await db.query(query)

      // Log access if user provided
      if (userId) {
        auditLogger.read(
          'Low stock products queried',
          this.tableName,
          userId
        )
      }

      return result.rows
    } catch (error) {
      logger.error('Failed to get low stock products', error as Error)
      throw error
    }
  }

  // Private helper methods
  private async validateUniqueSlug(slug: string, excludeId?: string): Promise<void> {
    const query = excludeId
      ? 'SELECT id FROM products WHERE slug = $1 AND id != $2'
      : 'SELECT id FROM products WHERE slug = $1'

    const params = excludeId ? [slug, excludeId] : [slug]
    const result = await db.query(query, params)

    if (result.rows.length > 0) {
      throw new Error('Slug already exists')
    }
  }

  private async validateUniqueSku(sku: string, excludeId?: string): Promise<void> {
    const query = excludeId
      ? 'SELECT id FROM products WHERE sku = $1 AND id != $2'
      : 'SELECT id FROM products WHERE sku = $1'

    const params = excludeId ? [sku, excludeId] : [sku]
    const result = await db.query(query, params)

    if (result.rows.length > 0) {
      throw new Error('SKU already exists')
    }
  }

  // Bulk operations
  async bulkUpdateStatus(ids: string[], status: Product['status'], userId: string): Promise<number> {
    try {
      const query = `
        UPDATE products
        SET
          status = $1,
          updated_at = NOW(),
          published_at = CASE
            WHEN $1 = 'active' AND published_at IS NULL THEN NOW()
            ELSE published_at
          END
        WHERE id = ANY($2)
      `

      const result = await db.query(query, [status, ids])

      // Log audit trail
      auditLogger.update(
        `Bulk status update: ${ids.length} products to ${status}`,
        this.tableName,
        'bulk_operation',
        userId,
        null,
        { ids, status }
      )

      logger.info('Bulk status update completed', {
        count: result.rowCount,
        status,
        userId
      })

      return result.rowCount || 0
    } catch (error) {
      logger.error('Failed to bulk update status', error as Error, { ids, status, userId })
      throw error
    }
  }

  async getCategories(): Promise<Array<{ category: string; count: number }>> {
    try {
      const query = `
        SELECT category, COUNT(*) as count
        FROM products
        WHERE category IS NOT NULL AND status != 'archived'
        GROUP BY category
        ORDER BY count DESC, category ASC
      `

      const result = await db.query(query)
      return result.rows
    } catch (error) {
      logger.error('Failed to get categories', error as Error)
      throw error
    }
  }
}

// Export singleton instance
export const productsService = new ProductsService()
export default productsService
