import { NextRequest, NextResponse } from 'next/server'
import { productsService } from '@/lib/database/products'
import { authenticateUser, requireRole } from '@/lib/auth/middleware'
import { apiLogger } from '@/lib/logger'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string
  }
}

// UUID validation schema
const uuidSchema = z.string().uuid('Invalid product ID format')

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now()

  try {
    // Validate product ID
    const productId = uuidSchema.parse(params.id)

    // Get user info (optional for public products)
    const userInfo = await authenticateUser(request)

    // Log API request
    apiLogger.request(
      'GET',
      `/api/products/${productId}`,
      userInfo?.user.id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    )

    // Check if requesting with images
    const { searchParams } = new URL(request.url)
    const includeImages = searchParams.get('include_images') === 'true'

    // Fetch product
    const product = includeImages
      ? await productsService.getByIdWithImages(productId, userInfo?.user.id)
      : await productsService.getById(productId, userInfo?.user.id)

    if (!product) {
      const duration = Date.now() - startTime
      apiLogger.response('GET', `/api/products/${productId}`, 404, duration, userInfo?.user.id)

      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // If not authenticated and product is not public, deny access
    if (!userInfo && (product.status !== 'active' || product.visibility !== 'visible')) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    const duration = Date.now() - startTime
    apiLogger.response('GET', `/api/products/${productId}`, 200, duration, userInfo?.user.id)

    return NextResponse.json({
      success: true,
      data: product,
      meta: {
        duration: `${duration}ms`,
        includeImages
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    const userInfo = await authenticateUser(request).catch(() => null)
    apiLogger.error('GET', `/api/products/${params.id}`, error as Error, userInfo?.user.id, 500)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID format'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (requires authentication)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now()

  try {
    // Validate product ID
    const productId = uuidSchema.parse(params.id)

    // Authenticate user
    const userInfo = await authenticateUser(request)
    if (!userInfo) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Check permissions (editor or admin can update products)
    if (!requireRole(userInfo.profile, ['editor', 'super_admin'])) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 })
    }

    // Parse request body
    const updateData = await request.json()

    // Log API request
    apiLogger.request(
      'PUT',
      `/api/products/${productId}`,
      userInfo.user.id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    )

    // Update product
    const product = await productsService.update(productId, updateData, userInfo.user.id)

    if (!product) {
      const duration = Date.now() - startTime
      apiLogger.response('PUT', `/api/products/${productId}`, 404, duration, userInfo.user.id)

      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    const duration = Date.now() - startTime
    apiLogger.response('PUT', `/api/products/${productId}`, 200, duration, userInfo.user.id)

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
      meta: {
        duration: `${duration}ms`
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    const userInfo = await authenticateUser(request).catch(() => null)
    apiLogger.error('PUT', `/api/products/${params.id}`, error as Error, userInfo?.user.id, 500)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json({
        success: false,
        error: 'Duplicate value',
        message: error.message
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update product',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now()

  try {
    // Validate product ID
    const productId = uuidSchema.parse(params.id)

    // Authenticate user
    const userInfo = await authenticateUser(request)
    if (!userInfo) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Check permissions (admin only can delete products)
    if (!requireRole(userInfo.profile, ['super_admin'])) {
      return NextResponse.json({
        success: false,
        error: 'Admin access required for product deletion'
      }, { status: 403 })
    }

    // Log API request
    apiLogger.request(
      'DELETE',
      `/api/products/${productId}`,
      userInfo.user.id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    )

    // Delete product
    const deleted = await productsService.delete(productId, userInfo.user.id)

    if (!deleted) {
      const duration = Date.now() - startTime
      apiLogger.response('DELETE', `/api/products/${productId}`, 404, duration, userInfo.user.id)

      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    const duration = Date.now() - startTime
    apiLogger.response('DELETE', `/api/products/${productId}`, 200, duration, userInfo.user.id)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      meta: {
        duration: `${duration}ms`,
        productId
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    const userInfo = await authenticateUser(request).catch(() => null)
    apiLogger.error('DELETE', `/api/products/${params.id}`, error as Error, userInfo?.user.id, 500)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID format'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete product',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PATCH /api/products/[id] - Partial update operations
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now()

  try {
    // Validate product ID
    const productId = uuidSchema.parse(params.id)

    // Authenticate user
    const userInfo = await authenticateUser(request)
    if (!userInfo) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Check permissions
    if (!requireRole(userInfo.profile, ['editor', 'super_admin'])) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { operation, data } = body

    // Log API request
    apiLogger.request(
      'PATCH',
      `/api/products/${productId}`,
      userInfo.user.id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    )

    let result
    let message

    switch (operation) {
      case 'updateInventory':
        if (typeof data?.quantity !== 'number' || data.quantity < 0) {
          throw new Error('Invalid inventory quantity')
        }
        result = await productsService.updateInventory(productId, data.quantity, userInfo.user.id)
        message = `Inventory updated to ${data.quantity}`
        break

      case 'updateStatus':
        if (!['draft', 'active', 'archived', 'out_of_stock'].includes(data?.status)) {
          throw new Error('Invalid status value')
        }
        result = await productsService.update(productId, { status: data.status }, userInfo.user.id)
        message = `Status updated to ${data.status}`
        break

      case 'toggleVisibility':
        const currentProduct = await productsService.getById(productId)
        if (!currentProduct) {
          throw new Error('Product not found')
        }
        const newVisibility = currentProduct.visibility === 'visible' ? 'hidden' : 'visible'
        result = await productsService.update(productId, { visibility: newVisibility }, userInfo.user.id)
        message = `Visibility toggled to ${newVisibility}`
        break

      default:
        throw new Error('Unsupported patch operation')
    }

    if (!result) {
      const duration = Date.now() - startTime
      apiLogger.response('PATCH', `/api/products/${productId}`, 404, duration, userInfo.user.id)

      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    const duration = Date.now() - startTime
    apiLogger.response('PATCH', `/api/products/${productId}`, 200, duration, userInfo.user.id)

    return NextResponse.json({
      success: true,
      data: result,
      message,
      meta: {
        operation,
        duration: `${duration}ms`
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    const userInfo = await authenticateUser(request).catch(() => null)
    apiLogger.error('PATCH', `/api/products/${params.id}`, error as Error, userInfo?.user.id, 500)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID format'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Patch operation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
