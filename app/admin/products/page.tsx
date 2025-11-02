import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProductsManager } from "@/components/admin/products-manager"

export default async function AdminProductsPage() {
  const supabase = await getSupabaseServerClient()

  // Get current user for logging
  const { data: { user } } = await supabase.auth.getUser()
  
  // Admins can see all products regardless of status (handled by RLS policy)
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("❌ [Products Page] Error fetching products:", {
      code: error.code,
      message: error.message,
      details: error.details,
      userId: user?.id
    })
  } else {
    console.log("✅ [Products Page] Loaded products:", {
      count: products?.length || 0,
      userId: user?.id
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage products: create, edit, and update inventory
        </p>
      </div>

      <ProductsManager products={products || []} />
    </div>
  )
}


