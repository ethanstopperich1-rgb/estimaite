-- EstimAIte Seed Data - Actual Pricing from Roofing Pros USA Calculator
-- Source: /samples/pricing.xlsx

-- Insert organization
INSERT INTO organizations (id, name, logo_url, settings) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Roofing Pros USA', NULL,
   '{"defaultOverheadPercent": 0, "defaultMarginPercent": 41, "taxRate": 10}')
ON CONFLICT (id) DO UPDATE SET settings = EXCLUDED.settings;

-- ================================================================
-- PRODUCTS - Shingles
-- ================================================================
DELETE FROM products WHERE organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO products (organization_id, name, category, manufacturer, price_per_unit, unit_type, coverage_per_unit, waste_factor) VALUES
  -- GAF Shingles
  ('00000000-0000-0000-0000-000000000001', 'GAF HDZ Shingle', 'shingles_architectural', 'GAF', 37.50, 'bundle', 0.328, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'GAF HDZ Hip and Ridge', 'shingles_architectural', 'GAF', 51.50, 'bundle', 25.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'GAF Starter', 'shingles_architectural', 'GAF', 51.50, 'bundle', 120.0, 0.10),

  -- Atlas Shingles
  ('00000000-0000-0000-0000-000000000001', 'Atlas Pinnacle Pristine', 'shingles_architectural', 'Atlas', 37.50, 'bundle', 0.328, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Atlas Ridge', 'shingles_architectural', 'Atlas', 63.50, 'bundle', 25.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Atlas Starter', 'shingles_architectural', 'Atlas', 71.00, 'bundle', 120.0, 0.10),

  -- Atlas Impact (Class 4)
  ('00000000-0000-0000-0000-000000000001', 'Atlas Impact (Class 4)', 'shingles_designer', 'Atlas', 50.00, 'bundle', 0.328, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Atlas Impact Hip and Ridge', 'shingles_designer', 'Atlas', 92.50, 'bundle', 30.0, 0.10),

  -- Metal Panels
  ('00000000-0000-0000-0000-000000000001', 'Rib Panel 29ga', 'metal_corrugated', 'Generic', 175.00, '10x10 panel', 1.0, 0.05),
  ('00000000-0000-0000-0000-000000000001', 'Rib Panel 26ga', 'metal_corrugated', 'Generic', 250.00, '10x10 panel', 1.0, 0.05),
  ('00000000-0000-0000-0000-000000000001', 'Standing Seam 26ga', 'metal_standing_seam', 'Generic', 225.00, '10x10 panel', 1.0, 0.05),

  -- Metal Trim
  ('00000000-0000-0000-0000-000000000001', '29ga Ridge', 'flashing', 'Generic', 36.30, 'piece', 10.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', '29ga Hip', 'flashing', 'Generic', 15.80, 'piece', 10.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', '29ga Eave', 'flashing', 'Generic', 11.40, 'piece', 10.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', '29ga Rake', 'flashing', 'Generic', 16.70, 'piece', 10.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', '29ga Valley', 'flashing', 'Generic', 36.30, 'piece', 10.0, 0.10),

  -- Underlayment
  ('00000000-0000-0000-0000-000000000001', 'Synthetic Underlayment', 'underlayment', 'Generic', 67.00, 'roll', 10.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Ice and Water Shield', 'underlayment', 'Generic', 66.00, 'roll', 65.0, 0.10),

  -- Fasteners & Supplies
  ('00000000-0000-0000-0000-000000000001', 'Cap Nails', 'supplies', 'Generic', 29.00, 'box', 35.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Coil Nails', 'supplies', 'Generic', 46.00, 'box', 20.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Drip Edge', 'flashing', 'Generic', 11.00, 'piece', 10.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Ridge Vent', 'ventilation', 'Generic', 11.00, 'piece', 5.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Colored Screws', 'supplies', 'Generic', 16.60, 'box', 3.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Butyl Tape', 'supplies', 'Generic', 7.00, 'roll', 8.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Spray Paint', 'supplies', 'Generic', 10.00, 'can', 1.0, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Geocel', 'supplies', 'Generic', 15.00, 'tube', 2.0, 0.10);

-- ================================================================
-- PRICING MATRIX - Labor Rates
-- ================================================================
DELETE FROM pricing_matrix WHERE organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO pricing_matrix (organization_id, category, item_name, unit, base_cost, labor_cost_per_unit, markup_percent) VALUES
  -- Shingle Labor
  ('00000000-0000-0000-0000-000000000001', 'labor', 'shingle_labor', 'square', 0, 80.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'rib_panel_labor', 'square', 0, 150.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'standing_seam_labor', 'square', 0, 200.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'extra_layers_labor', 'square', 0, 8.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'non_walkable', 'square', 0, 10.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'flat_roof', 'square', 0, 200.00, 0),

  -- Inspection Items - Materials + Labor
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'pipeboot', 'ea', 14.00, 10.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'electrical_boot', 'ea', 35.00, 15.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'metal_roof_vent', 'ea', 35.00, 25.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'chimney_flashing', 'ea', 48.00, 150.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'skylight_flashing', 'ea', 48.00, 150.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'decking_replacement', 'sheet', 35.00, 15.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'structural_framing', 'lf', 12.00, 3.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'wall_flashing', 'lf', 15.00, 3.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'fascia_repair', 'lf', 12.00, 2.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'soffit_repair', 'lf', 56.00, 2.00, 10),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'smart_vents', 'lf', 20.00, 5.00, 10),

  -- Gutters
  ('00000000-0000-0000-0000-000000000001', 'gutters', '6in_gutter', 'lf', 8.00, 4.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'gutters', '6in_gutter_guards', 'lf', 8.00, 2.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'gutters', 'downspout', 'ea', 60.00, 25.00, 0),

  -- Fixed Costs
  ('00000000-0000-0000-0000-000000000001', 'fixed', 'shingle_delivery', 'job', 250.00, 0, 10),
  ('00000000-0000-0000-0000-000000000001', 'fixed', 'poly_shingle_delivery', 'job', 750.00, 0, 10),
  ('00000000-0000-0000-0000-000000000001', 'fixed', 'metal_delivery', 'job', 300.00, 0, 0),
  ('00000000-0000-0000-0000-000000000001', 'fixed', 'project_manager', 'job', 500.00, 0, 0),
  ('00000000-0000-0000-0000-000000000001', 'fixed', 'full_report_fee', 'job', 55.00, 0, 0),
  ('00000000-0000-0000-0000-000000000001', 'fixed', 'dump_fee', 'load', 250.00, 0, 0),
  ('00000000-0000-0000-0000-000000000001', 'fixed', 'free_3_sheets', 'job', 220.00, 0, 0);

-- ================================================================
-- SAMPLE CUSTOMERS
-- ================================================================
INSERT INTO customers (organization_id, name, email, phone, address, city, state, zip) VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'john.smith@email.com', '(407) 555-1234', '123 Oak Street', 'Orlando', 'FL', '32801'),
  ('00000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'sarah.j@email.com', '(407) 555-5678', '456 Palm Avenue', 'Orlando', 'FL', '32803'),
  ('00000000-0000-0000-0000-000000000001', 'Mike Williams', 'mike.w@email.com', '(813) 555-9012', '789 Beach Road', 'Tampa', 'FL', '33602')
ON CONFLICT DO NOTHING;

-- ================================================================
-- FINANCING OPTIONS (from spreadsheet: 12.99% APR, 120-180 months)
-- ================================================================
-- Note: These are stored in organization settings and used by the financing calculator
-- Default: 12.99% APR, 120-180 month terms, optional dealer fee

COMMENT ON TABLE pricing_matrix IS 'Pricing data imported from Roofing Pros USA calculator spreadsheet on 2024-02-04';
