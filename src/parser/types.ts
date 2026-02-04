// EagleView PDF Parser Types

export interface RoofMeasurements {
  // Property Info
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  reportDate: string;
  reportId: string;

  // Primary Measurements
  totalRoofArea: number; // sq ft
  totalFacets: number;
  predominantPitch: string; // e.g., "4/12"
  numberOfStories: number | null;

  // Linear Measurements (in feet)
  ridgeLength: number;
  hipLength: number;
  valleyLength: number;
  rakeLength: number;
  eaveLength: number;
  dripEdgeLength: number; // eaves + rakes
  flashingLength: number;
  stepFlashingLength: number;

  // Penetrations
  totalPenetrations: number;
  penetrationsArea: number; // sq ft
  penetrationsPerimeter: number; // ft

  // Computed
  totalAreaLessPenetrations: number;

  // Waste Calculation (from EagleView)
  suggestedWastePercent: number;

  // Raw JSON for storage
  rawData: Record<string, unknown>;
}

export interface ParseResult {
  success: boolean;
  measurements?: RoofMeasurements;
  error?: string;
  warnings?: string[];
}

export interface ParserOptions {
  /** Which pages to extract from (default: all) */
  pages?: number[];
  /** Enable debug logging */
  debug?: boolean;
}
