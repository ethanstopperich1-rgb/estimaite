import { useState } from 'react';
import { Plus, Pencil, Trash2, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { usePricingMatrix, PRICING_CATEGORIES, PricingItem, PricingItemInput } from '../api/hooks/usePricingMatrix';

export default function PricingMatrix() {
  const { groupedItems, loading, error, createItem, updateItem, deleteItem, toggleActive } = usePricingMatrix();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: PricingItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (input: PricingItemInput) => {
    setSaving(true);
    try {
      if (editingItem) {
        await updateItem(editingItem.id, input);
      } else {
        await createItem(input);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleToggleActive = async (item: PricingItem) => {
    try {
      await toggleActive(item.id, !item.is_active);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <AppShell>
      <Header
        title="Pricing Matrix"
        subtitle="Configure labor rates, inspection items, and fixed costs"
      >
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </Header>

      <div className="p-6 space-y-6">
        {loading && (
          <div className="text-center py-12 text-gray-400">Loading pricing data...</div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && Object.keys(groupedItems).length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No pricing items yet</h3>
              <p className="text-gray-500 mb-4">
                Add your first pricing item to start building estimates
              </p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        )}

        {Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                {PRICING_CATEGORIES[category as keyof typeof PRICING_CATEGORIES] || category}
                <Badge variant="secondary">{items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-700">
                      <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Item</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Unit</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Material Cost</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Labor Cost</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Markup</th>
                      <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Status</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-navy-800 hover:bg-navy-800/50">
                        <td className="px-4 py-3">
                          <span className="text-gray-200 font-medium">{formatItemName(item.item_name)}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{item.unit}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{formatCurrency(item.base_cost)}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{formatCurrency(item.labor_cost_per_unit)}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{item.markup_percent}%</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleActive(item)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            {item.is_active ? (
                              <ToggleRight className="w-6 h-6 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-6 h-6" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-accent hover:bg-navy-700 rounded"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-navy-700 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <PricingItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        item={editingItem}
        saving={saving}
      />

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Pricing Item"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this pricing item? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

// Helper to format item names (convert snake_case to Title Case)
function formatItemName(name: string): string {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Modal Form Component
interface PricingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: PricingItemInput) => Promise<void>;
  item: PricingItem | null;
  saving: boolean;
}

function PricingItemModal({ isOpen, onClose, onSave, item, saving }: PricingItemModalProps) {
  const [formData, setFormData] = useState<PricingItemInput>({
    category: item?.category || 'labor',
    item_name: item?.item_name || '',
    unit: item?.unit || '',
    base_cost: item?.base_cost || 0,
    labor_cost_per_unit: item?.labor_cost_per_unit || 0,
    markup_percent: item?.markup_percent || 0,
    is_active: item?.is_active ?? true,
  });

  // Reset form when item changes
  useState(() => {
    if (item) {
      setFormData({
        category: item.category,
        item_name: item.item_name,
        unit: item.unit,
        base_cost: item.base_cost,
        labor_cost_per_unit: item.labor_cost_per_unit,
        markup_percent: item.markup_percent,
        is_active: item.is_active,
      });
    } else {
      setFormData({
        category: 'labor',
        item_name: '',
        unit: '',
        base_cost: 0,
        labor_cost_per_unit: 0,
        markup_percent: 0,
        is_active: true,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoryOptions = Object.entries(PRICING_CATEGORIES).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Pricing Item' : 'Add Pricing Item'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={categoryOptions}
        />

        <Input
          label="Item Name"
          value={formData.item_name}
          onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
          placeholder="e.g., shingle_labor, pipeboot"
          required
        />

        <Input
          label="Unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          placeholder="e.g., square, ea, lf, job"
          required
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Material Cost"
            type="number"
            step="0.01"
            value={formData.base_cost}
            onChange={(e) => setFormData({ ...formData, base_cost: parseFloat(e.target.value) || 0 })}
          />

          <Input
            label="Labor Cost"
            type="number"
            step="0.01"
            value={formData.labor_cost_per_unit}
            onChange={(e) => setFormData({ ...formData, labor_cost_per_unit: parseFloat(e.target.value) || 0 })}
          />

          <Input
            label="Markup %"
            type="number"
            step="1"
            value={formData.markup_percent}
            onChange={(e) => setFormData({ ...formData, markup_percent: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {item ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
