import * as pdfjsLib from 'pdfjs-dist';
import type { ParseResult, RoofMeasurements, ParserOptions } from './types';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Parse an EagleView PDF report and extract roof measurements
 */
export async function parseEagleViewPDF(
  file: File | ArrayBuffer,
  options: ParserOptions = {}
): Promise<ParseResult> {
  const { debug = false } = options;
  const warnings: string[] = [];

  try {
    // Load the PDF
    const data = file instanceof File ? await file.arrayBuffer() : file;
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    if (debug) {
      console.log(`[EagleView Parser] Loaded PDF with ${pdf.numPages} pages`);
    }

    // Extract text from all pages
    const allText: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      allText.push(pageText);
    }

    const fullText = allText.join('\n\n');

    if (debug) {
      console.log('[EagleView Parser] Extracted text:', fullText.substring(0, 500));
    }

    // Extract measurements
    const measurements = extractMeasurements(fullText, warnings);

    if (!measurements) {
      return {
        success: false,
        error: 'Could not extract measurements from PDF. Is this an EagleView report?',
        warnings,
      };
    }

    return {
      success: true,
      measurements,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing PDF',
      warnings,
    };
  }
}

/**
 * Extract measurements from the PDF text
 */
function extractMeasurements(
  text: string,
  warnings: string[]
): RoofMeasurements | null {
  const rawData: Record<string, unknown> = {};

  // Helper to extract a number from a pattern
  const extractNumber = (pattern: RegExp, defaultValue = 0): number => {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      rawData[pattern.source] = value;
      return value;
    }
    return defaultValue;
  };

  // Helper to extract a string from a pattern
  const extractString = (pattern: RegExp, defaultValue = ''): string => {
    const match = text.match(pattern);
    if (match) {
      rawData[pattern.source] = match[1];
      return match[1].trim();
    }
    return defaultValue;
  };

  // Property Address (first line usually has the address)
  const addressMatch = text.match(/^([^,]+),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5})/);
  let propertyAddress = '';
  let city = '';
  let state = '';
  let zipCode = '';

  if (addressMatch) {
    propertyAddress = addressMatch[1].trim();
    city = addressMatch[2].trim();
    state = addressMatch[3].trim();
    zipCode = addressMatch[4].trim();
  } else {
    warnings.push('Could not extract property address');
  }

  // Report Date and ID
  const reportDate = extractString(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const reportId = extractString(/Report:\s*(\d+)/);

  // Primary Measurements
  const totalRoofArea = extractNumber(/Total\s+(?:Roof\s+)?Area\s*=?\s*([\d,]+)\s*sq\s*ft/i);
  const totalFacets = extractNumber(/Total\s+(?:Roof\s+)?Facets\s*=?\s*(\d+)/i);
  const predominantPitch = extractString(/Predominant\s+Pitch\s*=?\s*(\d+\/\d+)/i);

  // Number of Stories
  const storiesMatch = text.match(/Number\s+of\s+Stories\s*(?:=|<=?|>=?)?\s*(\d+)/i);
  const numberOfStories = storiesMatch ? parseInt(storiesMatch[1], 10) : null;

  // Linear Measurements
  const ridgeLength = extractNumber(/(?:Total\s+)?Ridges?\s*(?:\/Hips)?\s*=\s*([\d,]+)\s*ft/i);
  const hipLength = extractNumber(/Hips?\s*=\s*([\d,]+)\s*ft(?:\s*\(\d+\s*Hips?\))?/i);
  const valleyLength = extractNumber(/(?:Total\s+)?Valleys?\s*=\s*([\d,]+)\s*ft/i);
  const rakeLength = extractNumber(/(?:Total\s+)?Rakes?\s*(?:†)?\s*=\s*([\d,]+)\s*ft/i);
  const eaveLength = extractNumber(/(?:Total\s+)?Eaves?\s*(?:\/Starter)?\s*(?:‡)?\s*=\s*([\d,]+)\s*ft/i);
  const dripEdgeLength = extractNumber(/Drip\s+Edge\s*\([^)]+\)\s*=\s*([\d,]+)\s*ft/i);
  const flashingLength = extractNumber(/(?<!Step\s)Flashing\s*=\s*([\d,]+)\s*ft/i);
  const stepFlashingLength = extractNumber(/Step\s+[Ff]lashing\s*=\s*([\d,]+)\s*ft/i);

  // Penetrations
  const totalPenetrations = extractNumber(/Total\s+Penetrations\s*=?\s*(\d+)/i);
  const penetrationsArea = extractNumber(/Total\s+Penetrations\s+Area\s*=?\s*([\d,]+)\s*sq\s*ft/i);
  const penetrationsPerimeter = extractNumber(/Total\s+Penetrations\s+Perimeter\s*=?\s*([\d,]+)\s*ft/i);
  const totalAreaLessPenetrations = extractNumber(/Total\s+(?:Roof\s+)?Area\s+Less\s+Penetrations\s*=?\s*([\d,]+)\s*sq\s*ft/i);

  // Waste Calculation - look for "Suggested" column
  const wasteMatch = text.match(/Suggested[\s\S]*?(\d+)\s*%/i);
  const suggestedWastePercent = wasteMatch ? parseInt(wasteMatch[1], 10) : 7; // Default to 7% if not found

  // Validation
  if (totalRoofArea === 0) {
    warnings.push('Total roof area not found or is zero');
    return null;
  }

  if (totalFacets === 0) {
    warnings.push('Number of facets not found');
  }

  if (!predominantPitch) {
    warnings.push('Predominant pitch not found');
  }

  return {
    propertyAddress,
    city,
    state,
    zipCode,
    reportDate,
    reportId,
    totalRoofArea,
    totalFacets,
    predominantPitch,
    numberOfStories,
    ridgeLength,
    hipLength,
    valleyLength,
    rakeLength,
    eaveLength,
    dripEdgeLength: dripEdgeLength || eaveLength + rakeLength,
    flashingLength,
    stepFlashingLength,
    totalPenetrations,
    penetrationsArea,
    penetrationsPerimeter,
    totalAreaLessPenetrations: totalAreaLessPenetrations || totalRoofArea - penetrationsArea,
    suggestedWastePercent,
    rawData,
  };
}

/**
 * Validate that a file is likely an EagleView PDF
 */
export function isEagleViewPDF(text: string): boolean {
  const indicators = [
    /eagleview/i,
    /Precise\s+Aerial\s+Roof\s+Measurement/i,
    /Total\s+Roof\s+Area/i,
    /Predominant\s+Pitch/i,
  ];

  return indicators.some((pattern) => pattern.test(text));
}
