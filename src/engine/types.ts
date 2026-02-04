// Core types for the estimation engine

export interface RoofMeasurements {
  totalSqft: number;
  pitch: string;        // e.g., "4/12"
  ridgeLength: number;  // feet
  hipLength: number;    // feet
  valleyLength: number; // feet
  eaveLength: number;   // feet
  rakeLength: number;   // feet
  facets: number;
  stories: number;
  layers: number;       // existing shingle layers
  isWalkable: boolean;
}

export interface ProductSelection {
  productId: string;
  productName: string;
  category: string;
  manufacturer: string;
  pricePerUnit: number;
  unitType: string;
  coveragePerUnit: number;
  wasteFactor: number;
}

export interface InspectionItem {
  itemType: string;
  description: string;
  quantity: number;
  unit: string;
  materialCost: number;
  laborCost: number;
}

export interface MaterialLineItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  wasteFactor?: number;
}

export interface LaborLineItem {
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  totalCost: number;
}

export interface FixedCostItem {
  name: string;
  cost: number;
  description?: string;
}

export interface EstimateBreakdown {
  // Material costs
  materials: MaterialLineItem[];
  materialSubtotal: number;

  // Labor costs
  labor: LaborLineItem[];
  laborSubtotal: number;

  // Inspection/additional items
  inspectionItems: InspectionItem[];
  inspectionSubtotal: number;

  // Fixed costs
  fixedCosts: FixedCostItem[];
  fixedCostSubtotal: number;

  // Totals
  subtotal: number;          // materials + labor + inspection + fixed
  overheadPercent: number;
  overheadAmount: number;
  marginPercent: number;
  marginAmount: number;
  totalPrice: number;

  // Financing
  financingOptions: FinancingOption[];
}

export interface FinancingOption {
  termMonths: number;
  apr: number;
  monthlyPayment: number;
  totalPayment: number;
  dealerFee?: number;
}

export interface EstimateInput {
  roofType: 'shingle' | 'metal_rib' | 'metal_standing_seam';
  measurements: RoofMeasurements;
  selectedProducts: ProductSelection[];
  inspectionItems: InspectionItem[];
  overheadPercent: number;
  marginPercent: number;
  includeDelivery: boolean;
  includeProjectManager: boolean;
  dumpLoads: number;
}

export interface PricingMatrixItem {
  id: string;
  category: string;
  itemName: string;
  unit: string;
  baseCost: number;
  laborCostPerUnit: number;
  markupPercent: number;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: string;
  manufacturer: string | null;
  pricePerUnit: number;
  unitType: string;
  coveragePerUnit: number | null;
  wasteFactor: number;
  isActive: boolean;
}
