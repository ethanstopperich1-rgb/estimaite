// Main estimation calculator
import type {
  RoofMeasurements,
  ProductSelection,
  InspectionItem,
  PricingMatrixItem,
  EstimateBreakdown,
  FixedCostItem,
  EstimateInput,
} from './types';
import { generateShingleMaterialList, generateMetalMaterialList } from './materials';
import { generateShingleLaborList, generateRibPanelLaborList, generateStandingSeamLaborList } from './labor';
import { generateFinancingOptions } from './financing';

/**
 * Calculate complete estimate breakdown
 */
export function calculateEstimate(input: EstimateInput): EstimateBreakdown {
  const {
    roofType,
    measurements,
    selectedProducts,
    inspectionItems,
    overheadPercent,
    marginPercent,
    includeDelivery,
    includeProjectManager,
    dumpLoads,
  } = input;

  // Generate material list based on roof type
  const materials = roofType === 'shingle'
    ? generateShingleMaterialList(measurements, selectedProducts)
    : generateMetalMaterialList(measurements, selectedProducts);

  const materialSubtotal = materials.reduce((sum, item) => sum + item.totalCost, 0);

  // Generate labor list based on roof type - use empty pricing matrix for now
  // In real app, this would come from the database
  const pricingMatrix: PricingMatrixItem[] = [];

  let labor;
  switch (roofType) {
    case 'metal_standing_seam':
      labor = generateStandingSeamLaborList(measurements, pricingMatrix);
      break;
    case 'metal_rib':
      labor = generateRibPanelLaborList(measurements, pricingMatrix);
      break;
    default:
      labor = generateShingleLaborList(measurements, pricingMatrix);
  }

  const laborSubtotal = labor.reduce((sum, item) => sum + item.totalCost, 0);

  // Calculate inspection items subtotal
  const inspectionSubtotal = inspectionItems.reduce(
    (sum, item) => sum + (item.materialCost + item.laborCost) * item.quantity,
    0
  );

  // Fixed costs
  const fixedCosts: FixedCostItem[] = [];

  if (includeDelivery) {
    const deliveryCost = roofType === 'shingle' ? 250 : 300;
    fixedCosts.push({
      name: 'Material Delivery',
      cost: deliveryCost,
    });
  }

  if (includeProjectManager) {
    fixedCosts.push({
      name: 'Project Manager',
      cost: 500,
    });
  }

  if (dumpLoads > 0) {
    fixedCosts.push({
      name: `Dump Fees (${dumpLoads} load${dumpLoads > 1 ? 's' : ''})`,
      cost: dumpLoads * 250,
    });
  }

  const fixedCostSubtotal = fixedCosts.reduce((sum, item) => sum + item.cost, 0);

  // Calculate totals
  const subtotal = materialSubtotal + laborSubtotal + inspectionSubtotal + fixedCostSubtotal;
  const overheadAmount = subtotal * (overheadPercent / 100);
  const subtotalWithOverhead = subtotal + overheadAmount;
  const marginAmount = subtotalWithOverhead * (marginPercent / 100);
  const totalPrice = subtotalWithOverhead + marginAmount;

  // Generate financing options
  const financingOptions = generateFinancingOptions(totalPrice, {
    apr: 12.99,
    terms: [60, 84, 120, 180],
  });

  return {
    materials,
    materialSubtotal: Math.round(materialSubtotal * 100) / 100,
    labor,
    laborSubtotal: Math.round(laborSubtotal * 100) / 100,
    inspectionItems,
    inspectionSubtotal: Math.round(inspectionSubtotal * 100) / 100,
    fixedCosts,
    fixedCostSubtotal: Math.round(fixedCostSubtotal * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    overheadPercent,
    overheadAmount: Math.round(overheadAmount * 100) / 100,
    marginPercent,
    marginAmount: Math.round(marginAmount * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    financingOptions,
  };
}

/**
 * Calculate quick estimate based on just sqft and roof type
 * Useful for initial price range
 */
export function calculateQuickEstimate(
  sqft: number,
  roofType: 'shingle' | 'metal_rib' | 'metal_standing_seam',
  marginPercent: number = 41
): {
  lowEstimate: number;
  highEstimate: number;
  perSquare: number;
} {
  // Cost per square (100 sqft) including materials and labor
  let baseCostPerSquare: number;

  switch (roofType) {
    case 'metal_standing_seam':
      baseCostPerSquare = 650; // $650-900 per square
      break;
    case 'metal_rib':
      baseCostPerSquare = 450; // $450-650 per square
      break;
    default: // shingle
      baseCostPerSquare = 350; // $350-500 per square
  }

  const squares = sqft / 100;
  const baseCost = squares * baseCostPerSquare;

  // Apply margin
  const withMargin = baseCost * (1 + marginPercent / 100);

  // Calculate range (±15%)
  const lowEstimate = Math.round(withMargin * 0.85);
  const highEstimate = Math.round(withMargin * 1.15);
  const perSquare = Math.round(withMargin / squares);

  return {
    lowEstimate,
    highEstimate,
    perSquare,
  };
}

/**
 * Convert pricing matrix items from database format
 */
export function convertPricingMatrix(
  items: Array<{
    id: string;
    category: string;
    item_name: string;
    unit: string;
    base_cost: number;
    labor_cost_per_unit: number;
    markup_percent: number;
  }>
): PricingMatrixItem[] {
  return items.map(item => ({
    id: item.id,
    category: item.category,
    itemName: item.item_name,
    unit: item.unit,
    baseCost: item.base_cost,
    laborCostPerUnit: item.labor_cost_per_unit,
    markupPercent: item.markup_percent,
  }));
}

/**
 * Convert product items from database format
 */
export function convertProducts(
  products: Array<{
    id: string;
    name: string;
    category: string;
    manufacturer: string | null;
    price_per_unit: number;
    unit_type: string;
    coverage_per_unit: number | null;
    waste_factor: number;
  }>
): ProductSelection[] {
  return products.map(p => ({
    productId: p.id,
    productName: p.name,
    category: p.category,
    manufacturer: p.manufacturer || '',
    pricePerUnit: p.price_per_unit,
    unitType: p.unit_type,
    coveragePerUnit: p.coverage_per_unit || 0,
    wasteFactor: p.waste_factor,
  }));
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number with commas
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
