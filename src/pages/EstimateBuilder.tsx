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
  TrendingUp,
  Sparkles,
  Building2,
  Zap,
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
      {/* Custom Header for Roofing Pros USA */}
      <div className="border-b border-navy-700 bg-navy-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/20">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">New Estimate</h1>
                  <p className="text-sm text-gray-400">Build a detailed roofing proposal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-brand-green/20 text-brand-green border-brand-green/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Steps - Linear Style */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === step.key;
              const isComplete = index < currentStepIndex;

              return (
                <div key={step.key} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.key)}
                    className={`
                      group flex items-center gap-2 px-4 py-2.5 rounded-xl
                      transition-all duration-200 ease-smooth
                      ${isActive
                        ? 'bg-accent text-white shadow-lg shadow-accent/25 scale-105'
                        : isComplete
                        ? 'bg-success/20 text-success hover:bg-success/30'
                        : 'bg-navy-800/80 text-gray-400 hover:bg-navy-750 hover:text-gray-300'
                      }
                    `}
                  >
                    <span className={`
                      flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? 'bg-white/20'
                        : isComplete
                        ? 'bg-success/20'
                        : 'bg-navy-700 group-hover:bg-navy-600'
                      }
                    `}>
                      {isComplete ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </span>
                    <span className="hidden sm:inline font-medium">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-8 h-0.5 mx-1 rounded-full transition-colors duration-300
                      ${index < currentStepIndex ? 'bg-success' : 'bg-navy-700'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
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
                className="transition-all duration-200 hover:scale-105 active:scale-95"
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
                className="bg-gradient-to-r from-accent to-accent-light hover:shadow-lg hover:shadow-accent/25 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Proposal
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar - Live Estimate */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-gradient-to-b from-navy-900 to-navy-900/80 border-navy-700/50 shadow-xl overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

                <CardHeader className="relative border-b border-navy-700/50">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Calculator className="w-5 h-5 text-accent" />
                    </div>
                    <span>Estimate Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4 pt-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-navy-800/50 rounded-xl border border-navy-700/50 hover:border-navy-600 transition-colors">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Roof Size</p>
                      <p className="text-xl font-bold text-white mt-1">
                        {formatNumber(measurements.totalSqft)}
                        <span className="text-sm font-normal text-gray-400 ml-1">sq ft</span>
                      </p>
                    </div>
                    <div className="p-3 bg-navy-800/50 rounded-xl border border-navy-700/50 hover:border-navy-600 transition-colors">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Squares</p>
                      <p className="text-xl font-bold text-white mt-1">
                        {formatNumber(measurements.totalSqft / 100, 1)}
                      </p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {estimate && (
                    <div className="space-y-2.5 pt-4 border-t border-navy-700/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Materials</span>
                        <span className="text-gray-200 font-medium">{formatCurrency(estimate.materialSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Labor</span>
                        <span className="text-gray-200 font-medium">{formatCurrency(estimate.laborSubtotal)}</span>
                      </div>
                      {estimate.inspectionSubtotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Inspection Items</span>
                          <span className="text-gray-200 font-medium">{formatCurrency(estimate.inspectionSubtotal)}</span>
                        </div>
                      )}
                      {estimate.fixedCostSubtotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Fixed Costs</span>
                          <span className="text-gray-200 font-medium">{formatCurrency(estimate.fixedCostSubtotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2.5 border-t border-navy-700/50">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-gray-200 font-medium">{formatCurrency(estimate.subtotal)}</span>
                      </div>
                      {estimate.marginAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Margin ({marginPercent}%)
                          </span>
                          <span className="text-success font-medium">{formatCurrency(estimate.marginAmount)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total - Hero Section */}
                  <div className="pt-4 border-t border-navy-700/50">
                    <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-sm text-gray-400">Total Price</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatCurrency((estimate?.totalPrice || quickEstimate.highEstimate) / (measurements.totalSqft / 100))}/square
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {estimate ? formatCurrency(estimate.totalPrice) : formatCurrency(quickEstimate.highEstimate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financing */}
                  {estimate && estimate.financingOptions.length > 0 && (
                    <div className="pt-4 border-t border-navy-700/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-brand-green" />
                        <span className="text-sm font-medium text-gray-300">Financing Options</span>
                      </div>
                      <div className="space-y-2">
                        {estimate.financingOptions.slice(0, 3).map(option => (
                          <div
                            key={option.termMonths}
                            className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg border border-navy-700/50 hover:border-brand-green/30 transition-colors cursor-pointer group"
                          >
                            <div>
                              <span className="text-lg font-semibold text-brand-green group-hover:text-brand-green-light transition-colors">
                                {formatCurrency(option.monthlyPayment)}
                              </span>
                              <span className="text-gray-400 text-sm">/mo</span>
                            </div>
                            <span className="text-sm text-gray-500">{option.termMonths / 12} years</span>
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-navy-800/30 border-b border-navy-700/50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Ruler className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span>Roof Measurements</span>
            <p className="text-sm font-normal text-gray-400 mt-0.5">Enter the roof dimensions from EagleView report</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Roof Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Roof Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'shingle', label: 'Shingle', icon: Home, desc: 'Asphalt shingles' },
              { value: 'metal_rib', label: 'Metal Rib Panel', icon: Building2, desc: 'Ribbed metal panels' },
              { value: 'metal_standing_seam', label: 'Standing Seam', icon: Building2, desc: 'Premium metal' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setRoofType(option.value as typeof roofType)}
                className={`
                  group relative p-4 rounded-xl border-2 transition-all duration-200
                  ${roofType === option.value
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
                    : 'border-navy-700 bg-navy-800/50 hover:border-navy-600 hover:bg-navy-800'
                  }
                `}
              >
                <option.icon className={`w-6 h-6 mb-2 transition-colors ${
                  roofType === option.value ? 'text-accent' : 'text-gray-400 group-hover:text-gray-300'
                }`} />
                <div className={`font-semibold transition-colors ${
                  roofType === option.value ? 'text-white' : 'text-gray-300'
                }`}>
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                {roofType === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
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
            <label className="block text-sm font-semibold text-gray-300 mb-2">Walkable?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMeasurements({ ...measurements, isWalkable: true })}
                className={`
                  flex-1 p-2.5 rounded-lg border-2 font-medium transition-all duration-200
                  ${measurements.isWalkable
                    ? 'border-success bg-success/10 text-success'
                    : 'border-navy-700 bg-navy-800 text-gray-400 hover:border-navy-600'
                  }
                `}
              >
                Yes
              </button>
              <button
                onClick={() => setMeasurements({ ...measurements, isWalkable: false })}
                className={`
                  flex-1 p-2.5 rounded-lg border-2 font-medium transition-all duration-200
                  ${!measurements.isWalkable
                    ? 'border-danger bg-danger/10 text-danger'
                    : 'border-navy-700 bg-navy-800 text-gray-400 hover:border-navy-600'
                  }
                `}
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-navy-800/30 border-b border-navy-700/50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Package className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span>Product Selection</span>
            <p className="text-sm font-normal text-gray-400 mt-0.5">Choose shingle manufacturer and materials</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Manufacturer Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Shingle Manufacturer</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'GAF', label: 'GAF', line: 'HDZ Timberline', color: 'from-blue-500/20 to-blue-600/10' },
              { value: 'Atlas', label: 'Atlas', line: 'Pinnacle Pristine', color: 'from-emerald-500/20 to-emerald-600/10' },
            ].map(mfg => (
              <button
                key={mfg.value}
                onClick={() => setManufacturer(mfg.value as 'GAF' | 'Atlas')}
                className={`
                  relative p-5 rounded-xl border-2 transition-all duration-200 text-left overflow-hidden
                  ${manufacturer === mfg.value
                    ? 'border-accent bg-gradient-to-br ' + mfg.color + ' shadow-lg'
                    : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                  }
                `}
              >
                <div className="text-xl font-bold text-white">{mfg.label}</div>
                <div className="text-sm text-gray-400 mt-1">{mfg.line}</div>
                {manufacturer === mfg.value && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Products List */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Included Products</h3>
          <div className="space-y-2">
            {selectedProducts.map(product => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-4 bg-navy-800/50 rounded-xl border border-navy-700/50 hover:border-navy-600 transition-all duration-200 group"
              >
                <div>
                  <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{product.productName}</p>
                  <p className="text-sm text-gray-500">{product.manufacturer} • {product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-accent font-semibold">{formatCurrency(product.pricePerUnit)}</p>
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-navy-800/30 border-b border-navy-700/50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Wrench className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span>Inspection Items</span>
            <p className="text-sm font-normal text-gray-400 mt-0.5">Add items found during roof inspection</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Current Items */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-navy-800/50 rounded-xl border border-navy-700/50 group animate-fade-in"
              >
                <div className="flex-1">
                  <p className="text-gray-200 font-medium">{item.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(item.materialCost + item.laborCost)} per {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-navy-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                      className="px-3 py-2 text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-white font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="px-3 py-2 text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Items */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Add Inspection Items</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {options
              .filter(opt => !items.find(i => i.itemType === opt.type))
              .map(option => (
                <button
                  key={option.type}
                  onClick={() => addItem(option)}
                  className="flex items-center justify-between p-4 bg-navy-800/50 border border-navy-700/50 rounded-xl hover:border-accent hover:bg-navy-800 transition-all duration-200 group"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">{option.label}</span>
                  <span className="text-sm text-gray-500 group-hover:text-accent transition-colors">
                    + {formatCurrency(option.materialCost + option.laborCost)}
                  </span>
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
      <Card className="overflow-hidden">
        <CardHeader className="bg-navy-800/30 border-b border-navy-700/50">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span>Pricing Adjustments</span>
              <p className="text-sm font-normal text-gray-400 mt-0.5">Fine-tune margins and additional costs</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
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
            <label className="flex items-center gap-3 p-4 bg-navy-800/50 rounded-xl border border-navy-700/50 cursor-pointer hover:border-navy-600 transition-colors">
              <input
                type="checkbox"
                checked={includeDelivery}
                onChange={e => setIncludeDelivery(e.target.checked)}
                className="w-5 h-5 rounded border-navy-600 bg-navy-800 text-accent focus:ring-accent focus:ring-offset-0"
              />
              <div>
                <span className="text-gray-300 font-medium">Delivery</span>
                <p className="text-xs text-gray-500">$250</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 bg-navy-800/50 rounded-xl border border-navy-700/50 cursor-pointer hover:border-navy-600 transition-colors">
              <input
                type="checkbox"
                checked={includeProjectManager}
                onChange={e => setIncludeProjectManager(e.target.checked)}
                className="w-5 h-5 rounded border-navy-600 bg-navy-800 text-accent focus:ring-accent focus:ring-offset-0"
              />
              <div>
                <span className="text-gray-300 font-medium">Project Manager</span>
                <p className="text-xs text-gray-500">$500</p>
              </div>
            </label>
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
      <Card className="overflow-hidden">
        <CardHeader className="bg-navy-800/30 border-b border-navy-700/50">
          <CardTitle>Material Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-navy-700/50">
                  <th className="pb-3">Item</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Cost</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {estimate.materials.map((item, i) => (
                  <tr key={i} className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors">
                    <td className="py-3 text-gray-200">{item.name}</td>
                    <td className="py-3 text-center text-gray-400">{item.quantity} {item.unit}</td>
                    <td className="py-3 text-right text-gray-400">{formatCurrency(item.unitCost)}</td>
                    <td className="py-3 text-right text-gray-200 font-medium">{formatCurrency(item.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td colSpan={3} className="pt-4 text-gray-300">Material Subtotal</td>
                  <td className="pt-4 text-right text-accent text-lg">{formatCurrency(estimate.materialSubtotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Labor Breakdown */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-navy-800/30 border-b border-navy-700/50">
          <CardTitle>Labor Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-navy-700/50">
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Rate</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {estimate.labor.map((item, i) => (
                  <tr key={i} className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors">
                    <td className="py-3 text-gray-200">{item.name}</td>
                    <td className="py-3 text-center text-gray-400">{formatNumber(item.quantity, 1)} {item.unit}</td>
                    <td className="py-3 text-right text-gray-400">{formatCurrency(item.rate)}/{item.unit}</td>
                    <td className="py-3 text-right text-gray-200 font-medium">{formatCurrency(item.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td colSpan={3} className="pt-4 text-gray-300">Labor Subtotal</td>
                  <td className="pt-4 text-right text-accent text-lg">{formatCurrency(estimate.laborSubtotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
