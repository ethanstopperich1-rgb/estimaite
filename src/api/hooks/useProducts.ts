import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../context/AuthContext';

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  manufacturer: string | null;
  price_per_unit: number;
  unit_type: string;
  coverage_per_unit: number | null;
  waste_factor: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  category: string;
  manufacturer?: string;
  price_per_unit: number;
  unit_type: string;
  coverage_per_unit: number;
  waste_factor: number;
  is_active?: boolean;
}

export function useProducts() {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!profile?.organizationId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', profile.organizationId)
        .order('category', { ascending: true })
        .order('manufacturer', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setProducts((data as Product[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [profile?.organizationId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(
    async (input: ProductInput) => {
      if (!profile?.organizationId) throw new Error('No organization');

      const { data, error: createError } = await supabase
        .from('products')
        .insert({
          organization_id: profile.organizationId,
          name: input.name,
          category: input.category,
          manufacturer: input.manufacturer,
          price_per_unit: input.price_per_unit,
          unit_type: input.unit_type,
          coverage_per_unit: input.coverage_per_unit,
          waste_factor: input.waste_factor,
          is_active: input.is_active ?? true,
        })
        .select()
        .single();

      if (createError) throw createError;
      if (data) setProducts((prev) => [...prev, data as Product]);
      return data as Product;
    },
    [profile?.organizationId]
  );

  const updateProduct = useCallback(
    async (id: string, input: Partial<ProductInput>) => {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (data) setProducts((prev) => prev.map((p) => (p.id === id ? (data as Product) : p)));
      return data as Product;
    },
    []
  );

  const deleteProduct = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      return updateProduct(id, { is_active: isActive });
    },
    [updateProduct]
  );

  // Group products by category
  const groupedProducts = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  // Get unique manufacturers
  const manufacturers = [...new Set(products.map((p) => p.manufacturer).filter(Boolean))] as string[];

  return {
    products,
    groupedProducts,
    manufacturers,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
  };
}

// Product categories
export const PRODUCT_CATEGORIES = {
  shingles_architectural: 'Architectural Shingles',
  shingles_designer: 'Designer/Impact Shingles',
  metal_corrugated: 'Metal - Corrugated/Rib Panel',
  metal_standing_seam: 'Metal - Standing Seam',
  underlayment: 'Underlayment',
  flashing: 'Flashing & Trim',
  ventilation: 'Ventilation',
  supplies: 'Supplies & Fasteners',
} as const;

export type ProductCategory = keyof typeof PRODUCT_CATEGORIES;
