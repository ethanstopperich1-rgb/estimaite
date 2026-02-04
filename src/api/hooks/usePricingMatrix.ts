import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../context/AuthContext';

export interface PricingItem {
  id: string;
  organization_id: string;
  category: string;
  item_name: string;
  unit: string;
  base_cost: number;
  labor_cost_per_unit: number;
  markup_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingItemInput {
  category: string;
  item_name: string;
  unit: string;
  base_cost: number;
  labor_cost_per_unit: number;
  markup_percent: number;
  is_active?: boolean;
}

export function usePricingMatrix() {
  const { profile } = useAuth();
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!profile?.organizationId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('pricing_matrix')
        .select('*')
        .eq('organization_id', profile.organizationId)
        .order('category', { ascending: true })
        .order('item_name', { ascending: true });

      if (fetchError) throw fetchError;
      setItems((data as PricingItem[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing items');
    } finally {
      setLoading(false);
    }
  }, [profile?.organizationId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(
    async (input: PricingItemInput) => {
      if (!profile?.organizationId) throw new Error('No organization');

      const { data, error: createError } = await supabase
        .from('pricing_matrix')
        .insert({
          organization_id: profile.organizationId,
          category: input.category,
          item_name: input.item_name,
          unit: input.unit,
          base_cost: input.base_cost,
          labor_cost_per_unit: input.labor_cost_per_unit,
          markup_percent: input.markup_percent,
          is_active: input.is_active ?? true,
        })
        .select()
        .single();

      if (createError) throw createError;
      if (data) setItems((prev) => [...prev, data as PricingItem]);
      return data as PricingItem;
    },
    [profile?.organizationId]
  );

  const updateItem = useCallback(
    async (id: string, input: Partial<PricingItemInput>) => {
      const { data, error: updateError } = await supabase
        .from('pricing_matrix')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (data) setItems((prev) => prev.map((item) => (item.id === id ? (data as PricingItem) : item)));
      return data as PricingItem;
    },
    []
  );

  const deleteItem = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase
      .from('pricing_matrix')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      return updateItem(id, { is_active: isActive });
    },
    [updateItem]
  );

  // Group items by category
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, PricingItem[]>
  );

  return {
    items,
    groupedItems,
    loading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
    toggleActive,
  };
}

// Category labels for display
export const PRICING_CATEGORIES = {
  labor: 'Labor Rates',
  inspection: 'Inspection Items',
  gutters: 'Gutters',
  fixed: 'Fixed Costs',
} as const;
