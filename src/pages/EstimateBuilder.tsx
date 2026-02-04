import { useState, useMemo } from 'react';
import {
  Calculator,
  Home,
  Ruler,
  Package,
  Wrench,
  DollarSign,
  FileText,
  ChevronRight,
  Check,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import {
  calculateEstimate,
  calculateQuickEstimate,
  formatCurrency,
  formatNumber,
  generateFinancingOptions,
} from '../engine';
import type { RoofMeasurements, ProductSelection, InspectionItem, EstimateBreakdown } from '../engine/types';

// Demo products data (would come from database)
const DEMO_PRODUCTS: ProductSelection[] = [
  // GAF Shingles
  { productId: '1', productName: 'GAF HDZ Shingle', category: 'shingles_architectural', manufacturer: 'GAF', pricePerUnit: 37.50, unitType: 'bundle', coveragePerUnit: 0.328, wasteFactor: 0.10 },
  { productId: '2', productName: 'GAF HDZ Hip and Ridge', category: 'shingles_architectural', manufacturer: 'GAF', pricePerUnit: 51.50, unitType: 'bundle', coveragePerUnit: 25, wasteFactor: 0.10 },
  { productId: '3', productName: 'GAF Starter', category: 'shingles_architectural', manufacturer: 'GAF', pricePerUnit: 51.50, unitType: 'bundle', coveragePerUnit: 120, wasteFactor: 0.10 },
  // Atlas Shingles
  { productId: '4', productName: 'Atlas Pinnacle Pristine', category: 'shingles_architectural', manufacturer: 'Atlas', pricePerUnit: 37.50, unitType: 'bundle', coveragePerUnit: 0.328, wasteFactor: 0.10 },
  { productId: '5', productName: 'Atlas Ridge', category: 'shingles_architectural', manufacturer: 'Atlas', pricePerUnit: 63.50, unitType: 'bundle', coveragePerUnit: 25, wasteFactor: 0.10 },
  { productId: '6', productName: 'Atlas Starter', category: 'shingles_architectural', manufacturer: 'Atlas', pricePerUnit: 71.00, unitType: 'bundle', coveragePerUnit: 120, wasteFactor: 0.10 },
  // Underlayment
  { productId: '7', productName: 'Synthetic Underlayment', category: 'underlayment', manufacturer: 'Generic', pricePerUnit: 67.00, unitType: 'roll', coveragePerUnit: 10, wasteFactor: 0.10 },
  { productId: '8', productName: 'Ice and Water Shield', category: 'underlayment', manufacturer: 'Generic', pricePerUnit: 66.00, unitType: 'roll', coveragePerUnit: 65, wasteFactor: 0.10 },
  // Flashing
  { productId: '9', productName: 'Drip Edge', category: 'flashing', manufacturer: 'Generic', pricePerUnit: 11.00, unitType: 'piece', coveragePerUnit: 10, wasteFactor: 0.10 },
  // Ventilation
  { productId: '10', productName: 'Ridge Vent', category: 'ventilation', manufacturer: 'Generic', pricePerUnit: 11.00, unitType: 'piece', coveragePerUnit: 5, wasteFactor: 0.10 },
  // Fasteners
  { productId: '11', productName: 'Cap Nails', category: 'supplies', manufacturer: 'Generic', pricePerUnit: 29.00, unitType: 'box', coveragePerUnit: 35, wasteFactor: 0.10 },
  { productId: '12', productName: 'Coil Nails', category: 'supplies', manufacturer: 'Generic', pricePerUnit: 46.00, unitType: 'box', coveragePerUnit: 20, wasteFactor: 0.10 },
];

// Demo inspection items
const DEMO_INSPECTION_OPTIONS = [
  { type: 'pipeboot', label: 'Pipe Boot', unit: 'ea', materialCost: 14, laborCost: 10 },
  { type: 'electrical_boot', label: 'Electrical Boot', unit: 'ea', materialCost: 35, laborCost: 15 },
  { type: 'metal_roof_vent', label: 'Metal Roof Vent', unit: 'ea', materialCost: 35, laborCost: 25 },
  { type: 'chimney_flashing', label: 'Chimney Flashing', unit: 'ea', materialCost: 48, laborCost: 150 },
  { type: 'skylight_flashing', label: 'Skylight Flashing', unit: 'ea', materialCost: 48, laborCost: 150 },
  { type: 'decking_replacement', label: 'Decking Replacement', unit: 'sheet', materialCost: 35, laborCost: 15 },
];

type Step = 'measurements' | 'products' | 'inspection' | 'review';

export default function EstimateBuilder() {
  const [currentStep, setCurrentStep] = useState<Step>('measurements');

  // Form state
  const [roofType, setRoofType] = useState<'shingle' | 'metal_rib' | 'metal_standing_seam'>('shingle');
  const [manufacturer, setManufacturer] = useState<'GAF' | 'Atlas'>('GAF');
  const [measurements, setMeasurements] = useState<RoofMeasurements>({
    totalSqft: 1592,
    pitch: '4/12',
    ridgeLength: 59,
    hipLength: 0,
    valleyLength: 22,
    eaveLength: 88,
    rakeLength: 85,
    facets: 4,
    stories: 1,
    layers: 1,
    isWalkable: true,
  });
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    { itemType: 'pipeboot', description: 'Pipe Boot', quantity: 4, unit: 'ea', materialCost: 14, laborCost: 10 },
  ]);
  const [marginPercent, setMarginPercent] = useState(41);
  const [overheadPercent, setOverheadPercent] = useState(0);
  const [includeDelivery, setIncludeDelivery] = useState(true);
  const [includeProjectManager, setIncludeProjectManager] = useState(true);
  const [dumpLoads, setDumpLoads] = useState(1);

  // Get selected products based on manufacturer
  const selectedProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter(p =>
      p.manufacturer === manufacturer ||
      p.manufacturer === 'Generic'
    );
  }, [manufacturer]);

  // Calculate estimate
  const estimate = useMemo<EstimateBreakdown | null>(() => {
    if (measurements.totalSqft === 0) return null;

    return calculateEstimate({
      roofType,
      measurements,
      selectedProducts,
      inspectionItems,
      overheadPercent,
      marginPercent,
      includeDelivery,
      includeProjectManager,
      dumpLoads,
    });
  }, [roofType, measurements, selectedProducts, inspectionItems, overheadPercent, marginPercent, includeDelivery, includeProjectManager, dumpLoads]);

  // Quick estimate for display
  const quickEstimate = useMemo(() => {
    return calculateQuickEstimate(measurements.totalSqft, roofType, marginPercent);
  }, [measurements.totalSqft, roofType, marginPercent]);

  const steps: { key: Step; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'measurements', label: 'Measurements', icon: Ruler },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'inspection', label: 'Inspection', icon: Wrench },
    { key: 'review', label: 'Review', icon: FileText },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <AppShell>
      <Header
        title="New Estimate"
        subtitle="Build a detailed roofing estimate"
      />

      <div className="p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentStep === step.key
                      ? 'bg-accent text-white'
                      : index < currentStepIndex
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 mx-2 text-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 'measurements' && (
              <MeasurementsStep
                measurements={measurements}
                setMeasurements={setMeasurements}
                roofType={roofType}
                setRoofType={setRoofType}
              />
            )}

            {currentStep === 'products' && (
              <ProductsStep
                manufacturer={manufacturer}
                setManufacturer={setManufacturer}
                selectedProducts={selectedProducts}
              />
            )}

            {currentStep === 'inspection' && (
              <InspectionStep
                items={inspectionItems}
                setItems={setInspectionItems}
                options={DEMO_INSPECTION_OPTIONS}
              />
            )}

            {currentStep === 'review' && estimate && (
              <ReviewStep
                estimate={estimate}
                marginPercent={marginPercent}
                setMarginPercent={setMarginPercent}
                overheadPercent={overheadPercent}
                setOverheadPercent={setOverheadPercent}
                includeDelivery={includeDelivery}
                setIncludeDelivery={setIncludeDelivery}
                includeProjectManager={includeProjectManager}
                setIncludeProjectManager={setIncludeProjectManager}
                dumpLoads={dumpLoads}
                setDumpLoads={setDumpLoads}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  const prevIndex = Math.max(0, currentStepIndex - 1);
                  setCurrentStep(steps[prevIndex].key);
                }}
                disabled={currentStepIndex === 0}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (currentStepIndex < steps.length - 1) {
                    setCurrentStep(steps[currentStepIndex + 1].key);
                  }
                }}
                disabled={currentStepIndex === steps.length - 1}
              >
                {currentStepIndex === steps.length - 1 ? 'Generate Proposal' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar - Live Estimate */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-accent" />
                    Estimate Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-navy-800 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Roof Size</p>
                      <p className="text-lg font-semibold text-white">
                        {formatNumber(measurements.totalSqft)} sq ft
                      </p>
                    </div>
                    <div className="p-3 bg-navy-800 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Squares</p>
                      <p className="text-lg font-semibold text-white">
                        {formatNumber(measurements.totalSqft / 100, 1)}
                      </p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {estimate && (
                    <div className="space-y-2 pt-4 border-t border-navy-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Materials</span>
                        <span className="text-gray-200">{formatCurrency(estimate.materialSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Labor</span>
                        <span className="text-gray-200">{formatCurrency(estimate.laborSubtotal)}</span>
                      </div>
                      {estimate.inspectionSubtotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Inspection Items</span>
                          <span className="text-gray-200">{formatCurrency(estimate.inspectionSubtotal)}</span>
                        </div>
                      )}
                      {estimate.fixedCostSubtotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Fixed Costs</span>
                          <span className="text-gray-200">{formatCurrency(estimate.fixedCostSubtotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2 border-t border-navy-700">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-gray-200">{formatCurrency(estimate.subtotal)}</span>
                      </div>
                      {estimate.marginAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Margin ({marginPercent}%)</span>
                          <span className="text-gray-200">{formatCurrency(estimate.marginAmount)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-4 border-t border-navy-700">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-400">Total Price</span>
                      <span className="text-3xl font-bold text-accent">
                        {estimate ? formatCurrency(estimate.totalPrice) : formatCurrency(quickEstimate.highEstimate)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency((estimate?.totalPrice || quickEstimate.highEstimate) / (measurements.totalSqft / 100))}/square
                    </p>
                  </div>

                  {/* Financing */}
                  {estimate && estimate.financingOptions.length > 0 && (
                    <div className="pt-4 border-t border-navy-700">
                      <p className="text-sm text-gray-400 mb-2">Financing Options</p>
                      <div className="space-y-2">
                        {estimate.financingOptions.slice(0, 3).map(option => (
                          <div
                            key={option.termMonths}
                            className="p-2 bg-navy-800 rounded text-sm"
                          >
                            <span className="text-accent font-semibold">
                              {formatCurrency(option.monthlyPayment)}
                            </span>
                            <span className="text-gray-400">/mo × {option.termMonths / 12} yrs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// Step Components
function MeasurementsStep({
  measurements,
  setMeasurements,
  roofType,
  setRoofType,
}: {
  measurements: RoofMeasurements;
  setMeasurements: (m: RoofMeasurements) => void;
  roofType: 'shingle' | 'metal_rib' | 'metal_standing_seam';
  setRoofType: (t: 'shingle' | 'metal_rib' | 'metal_standing_seam') => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-accent" />
          Roof Measurements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Roof Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Roof Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'shingle', label: 'Shingle' },
              { value: 'metal_rib', label: 'Metal Rib Panel' },
              { value: 'metal_standing_seam', label: 'Standing Seam' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setRoofType(option.value as typeof roofType)}
                className={`p-3 rounded-lg border transition-colors ${
                  roofType === option.value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-navy-600 bg-navy-800 text-gray-300 hover:border-navy-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Measurements */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Total Roof Area (sq ft)"
            type="number"
            value={measurements.totalSqft}
            onChange={e => setMeasurements({ ...measurements, totalSqft: parseFloat(e.target.value) || 0 })}
          />
          <Select
            label="Pitch"
            value={measurements.pitch}
            onChange={e => setMeasurements({ ...measurements, pitch: e.target.value })}
            options={[
              { value: '2/12', label: '2/12 (Low)' },
              { value: '3/12', label: '3/12' },
              { value: '4/12', label: '4/12' },
              { value: '5/12', label: '5/12' },
              { value: '6/12', label: '6/12' },
              { value: '7/12', label: '7/12' },
              { value: '8/12', label: '8/12' },
              { value: '9/12', label: '9/12 (Steep)' },
              { value: '10/12', label: '10/12 (Steep)' },
              { value: '12/12', label: '12/12 (Very Steep)' },
            ]}
          />
        </div>

        {/* Linear Measurements */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="Ridge Length (ft)"
            type="number"
            value={measurements.ridgeLength}
            onChange={e => setMeasurements({ ...measurements, ridgeLength: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="Hip Length (ft)"
            type="number"
            value={measurements.hipLength}
            onChange={e => setMeasurements({ ...measurements, hipLength: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="Valley Length (ft)"
            type="number"
            value={measurements.valleyLength}
            onChange={e => setMeasurements({ ...measurements, valleyLength: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="Eave Length (ft)"
            type="number"
            value={measurements.eaveLength}
            onChange={e => setMeasurements({ ...measurements, eaveLength: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="Rake Length (ft)"
            type="number"
            value={measurements.rakeLength}
            onChange={e => setMeasurements({ ...measurements, rakeLength: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="Facets"
            type="number"
            value={measurements.facets}
            onChange={e => setMeasurements({ ...measurements, facets: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* Additional Options */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Select
            label="Stories"
            value={measurements.stories.toString()}
            onChange={e => setMeasurements({ ...measurements, stories: parseInt(e.target.value) || 1 })}
            options={[
              { value: '1', label: '1 Story' },
              { value: '2', label: '2 Stories' },
              { value: '3', label: '3 Stories' },
            ]}
          />
          <Select
            label="Existing Layers"
            value={measurements.layers.toString()}
            onChange={e => setMeasurements({ ...measurements, layers: parseInt(e.target.value) || 1 })}
            options={[
              { value: '1', label: '1 Layer' },
              { value: '2', label: '2 Layers' },
              { value: '3', label: '3 Layers' },
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Walkable?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMeasurements({ ...measurements, isWalkable: true })}
                className={`flex-1 p-2 rounded border ${
                  measurements.isWalkable
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-navy-600 bg-navy-800 text-gray-400'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setMeasurements({ ...measurements, isWalkable: false })}
                className={`flex-1 p-2 rounded border ${
                  !measurements.isWalkable
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-navy-600 bg-navy-800 text-gray-400'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductsStep({
  manufacturer,
  setManufacturer,
  selectedProducts,
}: {
  manufacturer: 'GAF' | 'Atlas';
  setManufacturer: (m: 'GAF' | 'Atlas') => void;
  selectedProducts: ProductSelection[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-accent" />
          Product Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manufacturer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Shingle Manufacturer</label>
          <div className="grid grid-cols-2 gap-3">
            {['GAF', 'Atlas'].map(mfg => (
              <button
                key={mfg}
                onClick={() => setManufacturer(mfg as 'GAF' | 'Atlas')}
                className={`p-4 rounded-lg border transition-colors ${
                  manufacturer === mfg
                    ? 'border-accent bg-accent/10'
                    : 'border-navy-600 bg-navy-800 hover:border-navy-500'
                }`}
              >
                <div className="text-lg font-semibold text-white">{mfg}</div>
                <div className="text-sm text-gray-400">
                  {mfg === 'GAF' ? 'HDZ Timberline' : 'Pinnacle Pristine'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Products List */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Included Products</h3>
          <div className="space-y-2">
            {selectedProducts.map(product => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-3 bg-navy-800 rounded-lg"
              >
                <div>
                  <p className="text-gray-200">{product.productName}</p>
                  <p className="text-sm text-gray-500">{product.manufacturer}</p>
                </div>
                <div className="text-right">
                  <p className="text-accent font-medium">{formatCurrency(product.pricePerUnit)}</p>
                  <p className="text-xs text-gray-500">per {product.unitType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InspectionStep({
  items,
  setItems,
  options,
}: {
  items: InspectionItem[];
  setItems: (items: InspectionItem[]) => void;
  options: typeof DEMO_INSPECTION_OPTIONS;
}) {
  const addItem = (option: typeof options[0]) => {
    setItems([
      ...items,
      {
        itemType: option.type,
        description: option.label,
        quantity: 1,
        unit: option.unit,
        materialCost: option.materialCost,
        laborCost: option.laborCost,
      },
    ]);
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" />
          Inspection Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Items */}
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-navy-800 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-gray-200">{item.description}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.materialCost + item.laborCost)} per {item.unit}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateQuantity(index, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 bg-navy-700 border border-navy-600 rounded text-center text-white"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Items */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Add Inspection Items</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {options
              .filter(opt => !items.find(i => i.itemType === opt.type))
              .map(option => (
                <button
                  key={option.type}
                  onClick={() => addItem(option)}
                  className="flex items-center justify-between p-3 bg-navy-800 border border-navy-700 rounded-lg hover:border-accent transition-colors"
                >
                  <span className="text-gray-300">{option.label}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(option.materialCost + option.laborCost)}</span>
                </button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewStep({
  estimate,
  marginPercent,
  setMarginPercent,
  overheadPercent,
  setOverheadPercent,
  includeDelivery,
  setIncludeDelivery,
  includeProjectManager,
  setIncludeProjectManager,
  dumpLoads,
  setDumpLoads,
}: {
  estimate: EstimateBreakdown;
  marginPercent: number;
  setMarginPercent: (n: number) => void;
  overheadPercent: number;
  setOverheadPercent: (n: number) => void;
  includeDelivery: boolean;
  setIncludeDelivery: (b: boolean) => void;
  includeProjectManager: boolean;
  setIncludeProjectManager: (b: boolean) => void;
  dumpLoads: number;
  setDumpLoads: (n: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent" />
            Pricing Adjustments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Margin %"
              type="number"
              value={marginPercent}
              onChange={e => setMarginPercent(parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Overhead %"
              type="number"
              value={overheadPercent}
              onChange={e => setOverheadPercent(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDelivery}
                  onChange={e => setIncludeDelivery(e.target.checked)}
                  className="rounded border-navy-600 bg-navy-800 text-accent focus:ring-accent"
                />
                <span className="text-gray-300">Include Delivery ($250)</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProjectManager}
                  onChange={e => setIncludeProjectManager(e.target.checked)}
                  className="rounded border-navy-600 bg-navy-800 text-accent focus:ring-accent"
                />
                <span className="text-gray-300">Project Manager ($500)</span>
              </label>
            </div>
            <Input
              label="Dump Loads"
              type="number"
              min="0"
              value={dumpLoads}
              onChange={e => setDumpLoads(parseInt(e.target.value) || 0)}
              hint="$250 per load"
            />
          </div>
        </CardContent>
      </Card>

      {/* Material Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Material Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-navy-700">
                <th className="pb-2">Item</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Unit Cost</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.materials.map((item, i) => (
                <tr key={i} className="border-b border-navy-800">
                  <td className="py-2 text-gray-200">{item.name}</td>
                  <td className="py-2 text-center text-gray-400">{item.quantity} {item.unit}</td>
                  <td className="py-2 text-right text-gray-400">{formatCurrency(item.unitCost)}</td>
                  <td className="py-2 text-right text-gray-200">{formatCurrency(item.totalCost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td colSpan={3} className="pt-3 text-gray-300">Material Subtotal</td>
                <td className="pt-3 text-right text-accent">{formatCurrency(estimate.materialSubtotal)}</td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>

      {/* Labor Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Labor Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-navy-700">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Rate</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.labor.map((item, i) => (
                <tr key={i} className="border-b border-navy-800">
                  <td className="py-2 text-gray-200">{item.name}</td>
                  <td className="py-2 text-center text-gray-400">{formatNumber(item.quantity, 1)} {item.unit}</td>
                  <td className="py-2 text-right text-gray-400">{formatCurrency(item.rate)}/{item.unit}</td>
                  <td className="py-2 text-right text-gray-200">{formatCurrency(item.totalCost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td colSpan={3} className="pt-3 text-gray-300">Labor Subtotal</td>
                <td className="pt-3 text-right text-accent">{formatCurrency(estimate.laborSubtotal)}</td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
