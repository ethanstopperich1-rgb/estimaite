// Labor cost calculations
import type { RoofMeasurements, LaborLineItem, PricingMatrixItem } from './types';

/**
 * Calculate base labor for shingle installation
 */
export function calculateShingleLabor(
  measurements: RoofMeasurements,
  laborRate: number = 80 // per square
): LaborLineItem {
  const squares = measurements.totalSqft / 100;
  return {
    name: 'Shingle Installation Labor',
    quantity: squares,
    unit: 'square',
    rate: laborRate,
    totalCost: squares * laborRate,
  };
}

/**
 * Calculate base labor for rib panel installation
 */
export function calculateRibPanelLabor(
  measurements: RoofMeasurements,
  laborRate: number = 150 // per square
): LaborLineItem {
  const squares = measurements.totalSqft / 100;
  return {
    name: 'Rib Panel Installation Labor',
    quantity: squares,
    unit: 'square',
    rate: laborRate,
    totalCost: squares * laborRate,
  };
}

/**
 * Calculate base labor for standing seam installation
 */
export function calculateStandingSeamLabor(
  measurements: RoofMeasurements,
  laborRate: number = 200 // per square
): LaborLineItem {
  const squares = measurements.totalSqft / 100;
  return {
    name: 'Standing Seam Installation Labor',
    quantity: squares,
    unit: 'square',
    rate: laborRate,
    totalCost: squares * laborRate,
  };
}

/**
 * Calculate extra labor for tear-off of existing layers
 */
export function calculateTearOffLabor(
  measurements: RoofMeasurements,
  laborRatePerLayer: number = 8 // per square per layer
): LaborLineItem | null {
  if (measurements.layers <= 1) return null;

  const squares = measurements.totalSqft / 100;
  const extraLayers = measurements.layers - 1;

  return {
    name: `Tear-Off Extra Layers (${extraLayers} layer${extraLayers > 1 ? 's' : ''})`,
    quantity: squares,
    unit: 'square',
    rate: laborRatePerLayer * extraLayers,
    totalCost: squares * laborRatePerLayer * extraLayers,
  };
}

/**
 * Calculate extra labor for steep/non-walkable roofs
 */
export function calculateSteepRoofLabor(
  measurements: RoofMeasurements,
  laborRate: number = 10 // per square
): LaborLineItem | null {
  if (measurements.isWalkable) return null;

  const squares = measurements.totalSqft / 100;
  return {
    name: 'Steep Roof Premium',
    quantity: squares,
    unit: 'square',
    rate: laborRate,
    totalCost: squares * laborRate,
  };
}

/**
 * Calculate extra labor for multi-story buildings
 */
export function calculateMultiStoryLabor(
  measurements: RoofMeasurements,
  laborRatePerStory: number = 5 // per square per extra story
): LaborLineItem | null {
  if (measurements.stories <= 1) return null;

  const squares = measurements.totalSqft / 100;
  const extraStories = measurements.stories - 1;

  return {
    name: `Multi-Story Premium (${measurements.stories} stories)`,
    quantity: squares,
    unit: 'square',
    rate: laborRatePerStory * extraStories,
    totalCost: squares * laborRatePerStory * extraStories,
  };
}

/**
 * Get labor rate from pricing matrix
 */
export function getLaborRate(
  pricingMatrix: PricingMatrixItem[],
  itemName: string
): number {
  const item = pricingMatrix.find(p =>
    p.category === 'labor' && p.itemName === itemName
  );
  return item?.laborCostPerUnit || 0;
}

/**
 * Generate complete labor list for a shingle roof
 */
export function generateShingleLaborList(
  measurements: RoofMeasurements,
  pricingMatrix: PricingMatrixItem[]
): LaborLineItem[] {
  const items: LaborLineItem[] = [];

  // Base shingle labor
  const shingleRate = getLaborRate(pricingMatrix, 'shingle_labor') || 80;
  items.push(calculateShingleLabor(measurements, shingleRate));

  // Tear-off if multiple layers
  const tearOffRate = getLaborRate(pricingMatrix, 'extra_layers_labor') || 8;
  const tearOff = calculateTearOffLabor(measurements, tearOffRate);
  if (tearOff) items.push(tearOff);

  // Steep roof premium
  const steepRate = getLaborRate(pricingMatrix, 'non_walkable') || 10;
  const steep = calculateSteepRoofLabor(measurements, steepRate);
  if (steep) items.push(steep);

  // Multi-story premium
  const multiStory = calculateMultiStoryLabor(measurements, 5);
  if (multiStory) items.push(multiStory);

  return items;
}

/**
 * Generate complete labor list for a metal rib panel roof
 */
export function generateRibPanelLaborList(
  measurements: RoofMeasurements,
  pricingMatrix: PricingMatrixItem[]
): LaborLineItem[] {
  const items: LaborLineItem[] = [];

  // Base rib panel labor
  const ribPanelRate = getLaborRate(pricingMatrix, 'rib_panel_labor') || 150;
  items.push(calculateRibPanelLabor(measurements, ribPanelRate));

  // Tear-off if needed
  const tearOffRate = getLaborRate(pricingMatrix, 'extra_layers_labor') || 8;
  const tearOff = calculateTearOffLabor(measurements, tearOffRate);
  if (tearOff) items.push(tearOff);

  // Steep roof premium
  const steepRate = getLaborRate(pricingMatrix, 'non_walkable') || 10;
  const steep = calculateSteepRoofLabor(measurements, steepRate);
  if (steep) items.push(steep);

  // Multi-story premium
  const multiStory = calculateMultiStoryLabor(measurements, 5);
  if (multiStory) items.push(multiStory);

  return items;
}

/**
 * Generate complete labor list for a standing seam metal roof
 */
export function generateStandingSeamLaborList(
  measurements: RoofMeasurements,
  pricingMatrix: PricingMatrixItem[]
): LaborLineItem[] {
  const items: LaborLineItem[] = [];

  // Base standing seam labor
  const standingSeamRate = getLaborRate(pricingMatrix, 'standing_seam_labor') || 200;
  items.push(calculateStandingSeamLabor(measurements, standingSeamRate));

  // Tear-off if needed
  const tearOffRate = getLaborRate(pricingMatrix, 'extra_layers_labor') || 8;
  const tearOff = calculateTearOffLabor(measurements, tearOffRate);
  if (tearOff) items.push(tearOff);

  // Steep roof premium
  const steepRate = getLaborRate(pricingMatrix, 'non_walkable') || 10;
  const steep = calculateSteepRoofLabor(measurements, steepRate);
  if (steep) items.push(steep);

  // Multi-story premium
  const multiStory = calculateMultiStoryLabor(measurements, 5);
  if (multiStory) items.push(multiStory);

  return items;
}
