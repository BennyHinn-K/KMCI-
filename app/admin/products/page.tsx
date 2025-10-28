import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProductsManager } from "@/components/admin/products-manager"

export default async function AdminProductsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

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


