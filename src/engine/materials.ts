// Material quantity calculations
import type { RoofMeasurements, ProductSelection, MaterialLineItem } from './types';

/**
 * Calculate shingle bundles needed
 * 1 square = 100 sq ft
 * Standard shingle bundle covers ~33.3 sq ft (0.328 squares)
 */
export function calculateShingleBundles(
  sqft: number,
  coveragePerBundle: number = 0.328, // squares per bundle
  wasteFactor: number = 0.10
): number {
  const squares = sqft / 100;
  const squaresWithWaste = squares * (1 + wasteFactor);
  const bundles = Math.ceil(squaresWithWaste / coveragePerBundle);
  return bundles;
}

/**
 * Calculate hip/ridge shingle bundles
 * Each bundle covers X linear feet
 */
export function calculateRidgeBundles(
  linearFeet: number,
  coveragePerBundle: number = 25, // feet per bundle
  wasteFactor: number = 0.10
): number {
  const feetWithWaste = linearFeet * (1 + wasteFactor);
  return Math.ceil(feetWithWaste / coveragePerBundle);
}

/**
 * Calculate starter strip bundles
 * Each bundle covers X linear feet
 */
export function calculateStarterBundles(
  eaveLength: number,
  rakeLength: number,
  coveragePerBundle: number = 120,
  wasteFactor: number = 0.10
): number {
  const totalLength = eaveLength + rakeLength;
  const lengthWithWaste = totalLength * (1 + wasteFactor);
  return Math.ceil(lengthWithWaste / coveragePerBundle);
}

/**
 * Calculate underlayment rolls needed
 * Standard roll covers 10 squares
 */
export function calculateUnderlaymentRolls(
  sqft: number,
  coveragePerRoll: number = 1000, // sq ft
  wasteFactor: number = 0.10
): number {
  const sqftWithWaste = sqft * (1 + wasteFactor);
  return Math.ceil(sqftWithWaste / coveragePerRoll);
}

/**
 * Calculate ice & water shield rolls
 * Typically installed along eaves (2 courses) and valleys
 */
export function calculateIceWaterRolls(
  eaveLength: number,
  valleyLength: number,
  coveragePerRoll: number = 65, // linear feet
  iceWaterWidth: number = 3, // feet
  wasteFactor: number = 0.10
): number {
  // 2 courses along eave = 6 feet of coverage, so multiply eave by 2
  const eaveArea = eaveLength * 2; // 2 courses
  const valleyArea = valleyLength;
  const totalLength = eaveArea + valleyArea;
  const lengthWithWaste = totalLength * (1 + wasteFactor);
  return Math.ceil(lengthWithWaste / coveragePerRoll);
}

/**
 * Calculate drip edge pieces
 * Standard piece is 10 feet
 */
export function calculateDripEdge(
  eaveLength: number,
  rakeLength: number,
  pieceLength: number = 10,
  wasteFactor: number = 0.10
): number {
  const totalLength = eaveLength + rakeLength;
  const lengthWithWaste = totalLength * (1 + wasteFactor);
  return Math.ceil(lengthWithWaste / pieceLength);
}

/**
 * Calculate valley flashing pieces
 */
export function calculateValleyFlashing(
  valleyLength: number,
  pieceLength: number = 10,
  wasteFactor: number = 0.10
): number {
  const lengthWithWaste = valleyLength * (1 + wasteFactor);
  return Math.ceil(lengthWithWaste / pieceLength);
}

/**
 * Calculate ridge vent pieces
 */
export function calculateRidgeVent(
  ridgeLength: number,
  pieceLength: number = 5,
  wasteFactor: number = 0.10
): number {
  const lengthWithWaste = ridgeLength * (1 + wasteFactor);
  return Math.ceil(lengthWithWaste / pieceLength);
}

/**
 * Calculate cap nails boxes
 * 1 box per ~35 squares (for underlayment)
 */
export function calculateCapNails(
  sqft: number,
  coveragePerBox: number = 3500 // sq ft
): number {
  return Math.ceil(sqft / coveragePerBox);
}

/**
 * Calculate coil nails boxes
 * 1 box per ~20 squares (for shingles)
 */
export function calculateCoilNails(
  sqft: number,
  coveragePerBox: number = 2000 // sq ft
): number {
  return Math.ceil(sqft / coveragePerBox);
}

/**
 * Calculate metal panels needed
 * Standard panel is 10x10 (100 sq ft = 1 square)
 */
export function calculateMetalPanels(
  sqft: number,
  panelSqft: number = 100,
  wasteFactor: number = 0.05
): number {
  const sqftWithWaste = sqft * (1 + wasteFactor);
  return Math.ceil(sqftWithWaste / panelSqft);
}

/**
 * Generate complete material list for a shingle roof
 */
export function generateShingleMaterialList(
  measurements: RoofMeasurements,
  products: ProductSelection[]
): MaterialLineItem[] {
  const items: MaterialLineItem[] = [];

  // Find selected products by category
  const shingleProduct = products.find(p => p.category === 'shingles_architectural' || p.category === 'shingles_designer');
  const ridgeProduct = products.find(p => p.productName.toLowerCase().includes('ridge'));
  const starterProduct = products.find(p => p.productName.toLowerCase().includes('starter'));
  const underlaymentProduct = products.find(p => p.category === 'underlayment' && !p.productName.toLowerCase().includes('ice'));
  const iceWaterProduct = products.find(p => p.productName.toLowerCase().includes('ice'));
  const dripEdgeProduct = products.find(p => p.productName.toLowerCase().includes('drip'));
  const ridgeVentProduct = products.find(p => p.category === 'ventilation');
  const capNailsProduct = products.find(p => p.productName.toLowerCase().includes('cap'));
  const coilNailsProduct = products.find(p => p.productName.toLowerCase().includes('coil'));

  // Main shingles
  if (shingleProduct) {
    const qty = calculateShingleBundles(
      measurements.totalSqft,
      shingleProduct.coveragePerUnit,
      shingleProduct.wasteFactor
    );
    items.push({
      name: shingleProduct.productName,
      category: 'Shingles',
      quantity: qty,
      unit: 'bundle',
      unitCost: shingleProduct.pricePerUnit,
      totalCost: qty * shingleProduct.pricePerUnit,
      wasteFactor: shingleProduct.wasteFactor,
    });
  }

  // Ridge/Hip shingles
  if (ridgeProduct) {
    const ridgeHipLength = measurements.ridgeLength + measurements.hipLength;
    const qty = calculateRidgeBundles(
      ridgeHipLength,
      ridgeProduct.coveragePerUnit,
      ridgeProduct.wasteFactor
    );
    items.push({
      name: ridgeProduct.productName,
      category: 'Shingles',
      quantity: qty,
      unit: 'bundle',
      unitCost: ridgeProduct.pricePerUnit,
      totalCost: qty * ridgeProduct.pricePerUnit,
    });
  }

  // Starter strip
  if (starterProduct) {
    const qty = calculateStarterBundles(
      measurements.eaveLength,
      measurements.rakeLength,
      starterProduct.coveragePerUnit,
      starterProduct.wasteFactor
    );
    items.push({
      name: starterProduct.productName,
      category: 'Shingles',
      quantity: qty,
      unit: 'bundle',
      unitCost: starterProduct.pricePerUnit,
      totalCost: qty * starterProduct.pricePerUnit,
    });
  }

  // Underlayment
  if (underlaymentProduct) {
    const qty = calculateUnderlaymentRolls(
      measurements.totalSqft,
      (underlaymentProduct.coveragePerUnit || 10) * 100, // convert squares to sqft
      underlaymentProduct.wasteFactor
    );
    items.push({
      name: underlaymentProduct.productName,
      category: 'Underlayment',
      quantity: qty,
      unit: 'roll',
      unitCost: underlaymentProduct.pricePerUnit,
      totalCost: qty * underlaymentProduct.pricePerUnit,
    });
  }

  // Ice & Water Shield
  if (iceWaterProduct) {
    const qty = calculateIceWaterRolls(
      measurements.eaveLength,
      measurements.valleyLength,
      iceWaterProduct.coveragePerUnit || 65,
      3,
      iceWaterProduct.wasteFactor
    );
    items.push({
      name: iceWaterProduct.productName,
      category: 'Underlayment',
      quantity: qty,
      unit: 'roll',
      unitCost: iceWaterProduct.pricePerUnit,
      totalCost: qty * iceWaterProduct.pricePerUnit,
    });
  }

  // Drip Edge
  if (dripEdgeProduct) {
    const qty = calculateDripEdge(
      measurements.eaveLength,
      measurements.rakeLength,
      dripEdgeProduct.coveragePerUnit || 10,
      dripEdgeProduct.wasteFactor
    );
    items.push({
      name: dripEdgeProduct.productName,
      category: 'Flashing',
      quantity: qty,
      unit: 'piece',
      unitCost: dripEdgeProduct.pricePerUnit,
      totalCost: qty * dripEdgeProduct.pricePerUnit,
    });
  }

  // Ridge Vent
  if (ridgeVentProduct && measurements.ridgeLength > 0) {
    const qty = calculateRidgeVent(
      measurements.ridgeLength,
      ridgeVentProduct.coveragePerUnit || 5,
      ridgeVentProduct.wasteFactor
    );
    items.push({
      name: ridgeVentProduct.productName,
      category: 'Ventilation',
      quantity: qty,
      unit: 'piece',
      unitCost: ridgeVentProduct.pricePerUnit,
      totalCost: qty * ridgeVentProduct.pricePerUnit,
    });
  }

  // Cap Nails
  if (capNailsProduct) {
    const qty = calculateCapNails(measurements.totalSqft, (capNailsProduct.coveragePerUnit || 35) * 100);
    items.push({
      name: capNailsProduct.productName,
      category: 'Fasteners',
      quantity: qty,
      unit: 'box',
      unitCost: capNailsProduct.pricePerUnit,
      totalCost: qty * capNailsProduct.pricePerUnit,
    });
  }

  // Coil Nails
  if (coilNailsProduct) {
    const qty = calculateCoilNails(measurements.totalSqft, (coilNailsProduct.coveragePerUnit || 20) * 100);
    items.push({
      name: coilNailsProduct.productName,
      category: 'Fasteners',
      quantity: qty,
      unit: 'box',
      unitCost: coilNailsProduct.pricePerUnit,
      totalCost: qty * coilNailsProduct.pricePerUnit,
    });
  }

  return items;
}

/**
 * Generate complete material list for a metal roof
 */
export function generateMetalMaterialList(
  measurements: RoofMeasurements,
  products: ProductSelection[]
): MaterialLineItem[] {
  const items: MaterialLineItem[] = [];

  // Find metal panel product
  const panelProduct = products.find(p =>
    p.category === 'metal_corrugated' || p.category === 'metal_standing_seam'
  );

  if (panelProduct) {
    const qty = calculateMetalPanels(
      measurements.totalSqft,
      100, // 10x10 panel
      panelProduct.wasteFactor
    );
    items.push({
      name: panelProduct.productName,
      category: 'Metal Panels',
      quantity: qty,
      unit: 'panel',
      unitCost: panelProduct.pricePerUnit,
      totalCost: qty * panelProduct.pricePerUnit,
      wasteFactor: panelProduct.wasteFactor,
    });
  }

  // Find trim products
  const trimProducts = products.filter(p => p.category === 'flashing');

  for (const trim of trimProducts) {
    let length = 0;
    const name = trim.productName.toLowerCase();

    if (name.includes('ridge')) length = measurements.ridgeLength;
    else if (name.includes('hip')) length = measurements.hipLength;
    else if (name.includes('valley')) length = measurements.valleyLength;
    else if (name.includes('eave')) length = measurements.eaveLength;
    else if (name.includes('rake')) length = measurements.rakeLength;

    if (length > 0) {
      const qty = Math.ceil(length * (1 + trim.wasteFactor) / (trim.coveragePerUnit || 10));
      items.push({
        name: trim.productName,
        category: 'Trim',
        quantity: qty,
        unit: 'piece',
        unitCost: trim.pricePerUnit,
        totalCost: qty * trim.pricePerUnit,
      });
    }
  }

  // Underlayment for metal
  const underlaymentProduct = products.find(p => p.category === 'underlayment');
  if (underlaymentProduct) {
    const qty = calculateUnderlaymentRolls(
      measurements.totalSqft,
      (underlaymentProduct.coveragePerUnit || 10) * 100,
      underlaymentProduct.wasteFactor
    );
    items.push({
      name: underlaymentProduct.productName,
      category: 'Underlayment',
      quantity: qty,
      unit: 'roll',
      unitCost: underlaymentProduct.pricePerUnit,
      totalCost: qty * underlaymentProduct.pricePerUnit,
    });
  }

  // Screws for metal
  const screwProduct = products.find(p => p.productName.toLowerCase().includes('screw'));
  if (screwProduct) {
    const squares = measurements.totalSqft / 100;
    const qty = Math.ceil(squares / (screwProduct.coveragePerUnit || 3));
    items.push({
      name: screwProduct.productName,
      category: 'Fasteners',
      quantity: qty,
      unit: 'box',
      unitCost: screwProduct.pricePerUnit,
      totalCost: qty * screwProduct.pricePerUnit,
    });
  }

  // Butyl tape
  const butylProduct = products.find(p => p.productName.toLowerCase().includes('butyl'));
  if (butylProduct) {
    const trimLength = measurements.ridgeLength + measurements.hipLength + measurements.eaveLength;
    const qty = Math.ceil(trimLength / (butylProduct.coveragePerUnit || 8) / 10); // rough estimate
    if (qty > 0) {
      items.push({
        name: butylProduct.productName,
        category: 'Supplies',
        quantity: qty,
        unit: 'roll',
        unitCost: butylProduct.pricePerUnit,
        totalCost: qty * butylProduct.pricePerUnit,
      });
    }
  }

  return items;
}
