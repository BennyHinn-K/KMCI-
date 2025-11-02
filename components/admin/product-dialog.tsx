"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface ProductDialogProps {
  product?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function ProductDialog({ product, open, onOpenChange, onSave }: ProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    full_content: "",
    category: "",
    price: "0",
    currency: "KES",
    sku: "",
    image_url: "",
    status: "active",
    stock: "0",
    is_featured: false,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        slug: product.slug || "",
        description: product.description || "",
        full_content: product.full_content || "",
        category: product.category || "",
        price: product.price?.toString() || "0",
        currency: product.currency || "KES",
        sku: product.sku || "",
        image_url: product.image_url || "",
        status: product.status || "active",
        stock: product.stock?.toString() || "0",
        is_featured: product.is_featured || false,
      })
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        full_content: "",
        category: "",
        price: "0",
        currency: "KES",
        sku: "",
        image_url: "",
        status: "active",
        stock: "0",
        is_featured: false,
      })
    }
  }, [product])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("🔵 [Product Save] Starting save process...")
      const supabase = getSupabaseBrowserClient()
      
      // Step 1: Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log("🔵 [Product Save] Auth check:", { 
        authenticated: !!user, 
        userId: user?.id,
        authError: authError?.message 
      })

      if (!user) {
        console.error("❌ [Product Save] Not authenticated")
        throw new Error("Not authenticated. Please log in again.")
      }

      // Step 2: Verify user role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single()

      console.log("🔵 [Product Save] Profile check:", { 
        hasProfile: !!profile,
        role: profile?.role,
        profileError: profileError?.message 
      })

      if (!profile) {
        console.error("❌ [Product Save] No profile found for user")
        throw new Error("User profile not found. Please contact administrator.")
      }

      if (!["super_admin", "editor"].includes(profile.role)) {
        console.error("❌ [Product Save] Insufficient permissions:", profile.role)
        throw new Error(`Insufficient permissions. Required: super_admin or editor. Current: ${profile.role}`)
      }

      // Step 3: Prepare payload
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        created_by: user.id,
      }

      console.log("🔵 [Product Save] Payload prepared:", { 
        title: payload.title,
        price: payload.price,
        status: payload.status,
        hasSlug: !!payload.slug 
      })

      // Step 4: Save product
      if (product) {
        console.log("🔵 [Product Save] Updating existing product:", product.id)
        const { data, error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id)
          .select()

        if (error) {
          console.error("❌ [Product Save] Update error:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          throw new Error(`Failed to update product: ${error.message} (Code: ${error.code})`)
        }
        console.log("✅ [Product Save] Product updated successfully:", data?.[0]?.id)
        toast.success("Product updated successfully")
      } else {
        console.log("🔵 [Product Save] Creating new product")
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select()

        if (error) {
          console.error("❌ [Product Save] Insert error:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            fullError: error
          })
          throw new Error(`Failed to create product: ${error.message} (Code: ${error.code}). Check RLS policies if code is 42501.`)
        }
        console.log("✅ [Product Save] Product created successfully:", data?.[0]?.id)
        toast.success("Product created successfully")
      }

      onSave()
    } catch (error: any) {
      console.error("❌ [Product Save] Fatal error:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      toast.error(error.message || "Failed to save product. Check browser console for details.")
    } finally {
      setIsLoading(false)
      console.log("🔵 [Product Save] Save process completed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Create New Product"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {product ? "update" : "create"} a product
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ 
                ...formData, 
                title: e.target.value,
                slug: generateSlug(e.target.value)
              })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Content</Label>
            <Textarea
              id="content"
              value={formData.full_content}
              onChange={(e) => setFormData({ ...formData, full_content: e.target.value })}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_featured: checked })
              }
            />
            <Label htmlFor="featured">Feature this product</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : product ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


