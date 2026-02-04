// Project status options
export const PROJECT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'text-gray-400' },
  { value: 'estimated', label: 'Estimated', color: 'text-yellow-400' },
  { value: 'proposed', label: 'Proposed', color: 'text-blue-400' },
  { value: 'accepted', label: 'Accepted', color: 'text-emerald-400' },
  { value: 'declined', label: 'Declined', color: 'text-red-400' },
  { value: 'completed', label: 'Completed', color: 'text-accent' },
] as const;

// User roles
export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'estimator', label: 'Estimator' },
  { value: 'viewer', label: 'Viewer' },
] as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  { value: 'shingles_3tab', label: '3-Tab Shingles' },
  { value: 'shingles_architectural', label: 'Architectural Shingles' },
  { value: 'shingles_designer', label: 'Designer Shingles' },
  { value: 'metal_standing_seam', label: 'Standing Seam Metal' },
  { value: 'metal_corrugated', label: 'Corrugated Metal' },
  { value: 'underlayment', label: 'Underlayment' },
  { value: 'ventilation', label: 'Ventilation' },
  { value: 'flashing', label: 'Flashing' },
] as const;

// Inspection item types
export const INSPECTION_ITEM_TYPES = [
  { value: 'decking_replacement', label: 'Decking Replacement', unit: 'sheet' },
  { value: 'drip_edge', label: 'Drip Edge', unit: 'lf' },
  { value: 'ice_water_shield', label: 'Ice & Water Shield', unit: 'roll' },
  { value: 'fascia_repair', label: 'Fascia Repair', unit: 'lf' },
  { value: 'soffit_repair', label: 'Soffit Repair', unit: 'sqft' },
  { value: 'gutter_replacement', label: 'Gutter Replacement', unit: 'lf' },
  { value: 'skylight_flashing', label: 'Skylight Flashing', unit: 'ea' },
  { value: 'chimney_flashing', label: 'Chimney Flashing', unit: 'ea' },
  { value: 'pipe_boot', label: 'Pipe Boot', unit: 'ea' },
  { value: 'ridge_vent', label: 'Ridge Vent', unit: 'lf' },
  { value: 'power_vent', label: 'Power Vent', unit: 'ea' },
  { value: 'tear_off_layer', label: 'Additional Tear-Off Layer', unit: 'square' },
] as const;

// Roof pitch options
export const ROOF_PITCHES = [
  '1/12', '2/12', '3/12', '4/12', '5/12', '6/12', '7/12', '8/12',
  '9/12', '10/12', '11/12', '12/12', '14/12', '16/12', '18/12',
] as const;

// US States
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
] as const;

// Standard financing terms
export const FINANCING_TERMS = [
  { name: 'Same-as-Cash 12 Months', termMonths: 12, apr: 0 },
  { name: '36 Month Financing', termMonths: 36, apr: 9.99 },
  { name: '60 Month Financing', termMonths: 60, apr: 11.99 },
  { name: '84 Month Financing', termMonths: 84, apr: 13.99 },
  { name: '120 Month Financing', termMonths: 120, apr: 14.99 },
] as const;
