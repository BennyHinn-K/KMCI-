"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Product type definition
export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  full_content?: string;
  price: number;
  currency: string;
  sku?: string;
  image_url?: string;
  category?: string;
  status: "active" | "draft" | "archived" | "out_of_stock";
  stock: number;
  is_featured: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Query keys for caching
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (term: string) => [...productKeys.all, "search", term] as const,
  stats: () => [...productKeys.all, "stats"] as const,
};

// Optimized products fetch function
async function fetchProducts({
  status = "active",
  category,
  limit = 20,
  offset = 0,
  featured,
}: {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
} = {}) {
  const supabase = getSupabaseBrowserClient();

  let query = supabase
    .from("products")
    .select(
      "id, title, slug, description, price, currency, image_url, category, status, stock, is_featured, created_at",
    );

  // Apply filters
  if (status) query = query.eq("status", status);
  if (category) query = query.eq("category", category);
  if (featured !== undefined) query = query.eq("is_featured", featured);

  // Optimize ordering for performance
  query = query
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

// Main products hook with caching and optimization
export function useProducts({
  status = "active",
  category,
  limit = 20,
  offset = 0,
  featured,
  enabled = true,
}: {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
  enabled?: boolean;
} = {}) {
  return useQuery({
    queryKey: productKeys.list({ status, category, limit, offset, featured }),
    queryFn: () => fetchProducts({ status, category, limit, offset, featured }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData, // Keep showing old data while fetching new
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Single product hook
export function useProduct(id: string, enabled = true) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;

      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Featured products hook
export function useFeaturedProducts() {
  return useProducts({
    status: "active",
    featured: true,
    limit: 6,
  });
}

// Product search hook
export function useProductSearch(searchTerm: string, enabled = true) {
  return useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("search_products", {
        search_term: searchTerm,
        limit_count: 20,
      });

      if (error) {
        // Fallback to basic search if function doesn't exist
        const fallbackResult = await supabase
          .from("products")
          .select("id, title, slug, price, image_url, category, is_featured")
          .eq("status", "active")
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .order("is_featured", { ascending: false })
          .limit(20);

        if (fallbackResult.error) throw fallbackResult.error;
        return fallbackResult.data || [];
      }

      return data || [];
    },
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Product categories hook
export function useProductCategories() {
  return useQuery({
    queryKey: [...productKeys.all, "categories"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("status", "active")
        .not("category", "is", null);

      if (error) throw error;

      // Get unique categories
      const categories = Array.from(
        new Set(data?.map((item) => item.category).filter(Boolean)),
      );

      return categories.sort();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// Product statistics hook
export function useProductStats() {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();

      // Try materialized view first
      let { data, error } = await supabase
        .from("products_stats")
        .select("*")
        .single();

      if (error) {
        // Fallback to regular query
        const statsQuery = await supabase
          .from("products")
          .select("status, is_featured, stock, price")
          .not("status", "eq", "archived");

        if (statsQuery.error) throw statsQuery.error;

        const products = statsQuery.data || [];
        return {
          total_products: products.length,
          active_products: products.filter((p) => p.status === "active").length,
          featured_products: products.filter((p) => p.is_featured).length,
          out_of_stock: products.filter((p) => p.stock === 0).length,
          avg_price:
            products.reduce((sum, p) => sum + (p.price || 0), 0) /
            products.length,
        };
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Product mutations for admin
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("products")
        .insert({ ...productData, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Product>;
    }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update specific product in cache
      queryClient.setQueryData(productKeys.detail(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Optimistic update hook for instant UI updates
export function useOptimisticProductUpdate() {
  const queryClient = useQueryClient();

  return (productId: string, updates: Partial<Product>) => {
    // Immediately update UI
    queryClient.setQueryData(
      productKeys.detail(productId),
      (old: Product | undefined) => {
        if (!old) return old;
        return { ...old, ...updates };
      },
    );

    // Update in lists too
    queryClient.setQueriesData(
      { queryKey: productKeys.lists() },
      (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((product: Product) =>
            product.id === productId ? { ...product, ...updates } : product,
          ),
        };
      },
    );
  };
}

// Preload products hook for performance
export function usePreloadProducts() {
  const queryClient = useQueryClient();

  return {
    preloadFeatured: () => {
      queryClient.prefetchQuery({
        queryKey: productKeys.list({ featured: true, limit: 6 }),
        queryFn: () => fetchProducts({ featured: true, limit: 6 }),
        staleTime: 5 * 60 * 1000,
      });
    },
    preloadCategory: (category: string) => {
      queryClient.prefetchQuery({
        queryKey: productKeys.list({ category, limit: 20 }),
        queryFn: () => fetchProducts({ category, limit: 20 }),
        staleTime: 5 * 60 * 1000,
      });
    },
    preloadProduct: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
          const supabase = getSupabaseBrowserClient();
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          return data;
        },
        staleTime: 10 * 60 * 1000,
      });
    },
  };
}
