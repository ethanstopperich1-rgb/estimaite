import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useProducts, PRODUCT_CATEGORIES, Product, ProductInput } from '../api/hooks/useProducts';

export default function Products() {
  const { groupedProducts, loading, error, createProduct, updateProduct, deleteProduct, toggleActive } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (input: ProductInput) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, input);
      } else {
        await createProduct(input);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await toggleActive(product.id, !product.is_active);
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

  // Filter products by search query
  const filteredGroups = Object.entries(groupedProducts).reduce(
    (acc, [category, products]) => {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, Product[]>
  );

  return (
    <AppShell>
      <Header
        title="Product Catalog"
        subtitle="Manage shingles, metal panels, underlayment, and supplies"
      >
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </Header>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-400">Loading products...</div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && Object.keys(groupedProducts).length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">
                Add your first product to start building estimates
              </p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4" />
                Add First Product
              </Button>
            </CardContent>
          </Card>
        )}

        {Object.entries(filteredGroups).map(([category, products]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                {PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES] || category}
                <Badge variant="secondary">{products.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-700">
                      <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Product</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Manufacturer</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Price</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Unit</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Coverage</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Waste %</th>
                      <th className="text-center text-sm font-medium text-gray-400 px-4 py-3">Status</th>
                      <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-navy-800 hover:bg-navy-800/50">
                        <td className="px-4 py-3">
                          <span className="text-gray-200 font-medium">{product.name}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{product.manufacturer || '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-300">
                          {formatCurrency(product.price_per_unit)}
                        </td>
                        <td className="px-4 py-3 text-gray-400">{product.unit_type}</td>
                        <td className="px-4 py-3 text-right text-gray-300">
                          {product.coverage_per_unit} {getCoverageUnit(product.category)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-300">
                          {(product.waste_factor * 100).toFixed(0)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            {product.is_active ? (
                              <ToggleRight className="w-6 h-6 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-6 h-6" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1.5 text-gray-400 hover:text-accent hover:bg-navy-700 rounded"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
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
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
        saving={saving}
      />

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this product? This action cannot be undone.
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

// Helper to get coverage unit label
function getCoverageUnit(category: string): string {
  if (category.startsWith('shingles')) return 'sq';
  if (category.startsWith('metal')) return 'sq';
  if (category === 'underlayment') return 'sq';
  if (category === 'flashing' || category === 'ventilation') return 'ft';
  return '';
}

// Modal Form Component
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: ProductInput) => Promise<void>;
  product: Product | null;
  saving: boolean;
}

function ProductModal({ isOpen, onClose, onSave, product, saving }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    category: 'shingles_architectural',
    manufacturer: '',
    price_per_unit: 0,
    unit_type: 'bundle',
    coverage_per_unit: 0.328,
    waste_factor: 0.1,
    is_active: true,
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        manufacturer: product.manufacturer || '',
        price_per_unit: product.price_per_unit,
        unit_type: product.unit_type,
        coverage_per_unit: product.coverage_per_unit ?? 0,
        waste_factor: product.waste_factor,
        is_active: product.is_active,
      });
    } else {
      setFormData({
        name: '',
        category: 'shingles_architectural',
        manufacturer: '',
        price_per_unit: 0,
        unit_type: 'bundle',
        coverage_per_unit: 0.328,
        waste_factor: 0.1,
        is_active: true,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoryOptions = Object.entries(PRODUCT_CATEGORIES).map(([value, label]) => ({
    value,
    label,
  }));

  const unitOptions = [
    { value: 'bundle', label: 'Bundle' },
    { value: 'roll', label: 'Roll' },
    { value: 'piece', label: 'Piece' },
    { value: 'box', label: 'Box' },
    { value: 'can', label: 'Can' },
    { value: 'tube', label: 'Tube' },
    { value: '10x10 panel', label: '10x10 Panel' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add Product'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., GAF HDZ Shingle"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categoryOptions}
          />

          <Input
            label="Manufacturer"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            placeholder="e.g., GAF, Atlas"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price per Unit"
            type="number"
            step="0.01"
            value={formData.price_per_unit}
            onChange={(e) => setFormData({ ...formData, price_per_unit: parseFloat(e.target.value) || 0 })}
            required
          />

          <Select
            label="Unit Type"
            value={formData.unit_type}
            onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
            options={unitOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Coverage per Unit"
            type="number"
            step="0.001"
            value={formData.coverage_per_unit}
            onChange={(e) => setFormData({ ...formData, coverage_per_unit: parseFloat(e.target.value) || 0 })}
            hint="Squares (100 sq ft) or linear feet"
            required
          />

          <Input
            label="Waste Factor"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={formData.waste_factor}
            onChange={(e) => setFormData({ ...formData, waste_factor: parseFloat(e.target.value) || 0 })}
            hint="0.10 = 10% waste"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {product ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
