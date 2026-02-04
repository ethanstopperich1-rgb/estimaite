-- EstimAIte Seed Data
-- Sample data for development and testing

-- Insert sample organization
INSERT INTO organizations (id, name, logo_url, settings) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Roofing Pros USA', NULL, '{"defaultOverheadPercent": 10, "defaultProfitMargin": 20}');

-- Note: Users are created through Supabase Auth
-- After creating a user through auth, run this to link them:
-- INSERT INTO users (id, organization_id, email, name, role) VALUES
--   ('user-auth-id-here', '00000000-0000-0000-0000-000000000001', 'admin@roofingprosusa.com', 'Admin User', 'admin');

-- Sample Products
INSERT INTO products (organization_id, name, category, manufacturer, price_per_unit, unit_type, coverage_per_unit, waste_factor) VALUES
  -- Shingles
  ('00000000-0000-0000-0000-000000000001', 'GAF Timberline HDZ', 'shingles_architectural', 'GAF', 95.00, 'square', 100, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Owens Corning Duration', 'shingles_architectural', 'Owens Corning', 105.00, 'square', 100, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'CertainTeed Landmark', 'shingles_architectural', 'CertainTeed', 98.00, 'square', 100, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'GAF Royal Sovereign', 'shingles_3tab', 'GAF', 75.00, 'square', 100, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'GAF Grand Canyon', 'shingles_designer', 'GAF', 185.00, 'square', 100, 0.12),
  -- Metal
  ('00000000-0000-0000-0000-000000000001', 'Standing Seam 24ga', 'metal_standing_seam', 'ABC Supply', 450.00, 'square', 100, 0.05),
  ('00000000-0000-0000-0000-000000000001', 'Corrugated Metal 26ga', 'metal_corrugated', 'Metal Sales', 225.00, 'square', 100, 0.08),
  -- Underlayment
  ('00000000-0000-0000-0000-000000000001', 'GAF FeltBuster Synthetic', 'underlayment', 'GAF', 85.00, 'roll', 400, 0.10),
  ('00000000-0000-0000-0000-000000000001', 'Grace Ice & Water Shield', 'underlayment', 'Grace', 145.00, 'roll', 200, 0.05);

-- Sample Pricing Matrix (Labor & Inspection Items)
INSERT INTO pricing_matrix (organization_id, category, item_name, unit, base_cost, labor_cost_per_unit, markup_percent) VALUES
  -- Labor rates
  ('00000000-0000-0000-0000-000000000001', 'labor', 'shingles_3tab', 'square', 0, 55.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'shingles_architectural', 'square', 0, 65.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'shingles_designer', 'square', 0, 85.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'metal_standing_seam', 'square', 0, 150.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'metal_corrugated', 'square', 0, 95.00, 0),
  -- Inspection items
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'decking_replacement', 'sheet', 45.00, 25.00, 20),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'drip_edge', 'lf', 3.50, 2.00, 20),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'ice_water_shield', 'roll', 125.00, 35.00, 20),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'fascia_repair', 'lf', 8.00, 12.00, 25),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'soffit_repair', 'sqft', 6.00, 8.00, 25),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'gutter_replacement', 'lf', 12.00, 8.00, 20),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'skylight_flashing', 'ea', 85.00, 125.00, 25),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'chimney_flashing', 'ea', 150.00, 200.00, 25),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'pipe_boot', 'ea', 25.00, 35.00, 20),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'ridge_vent', 'lf', 8.00, 6.00, 20),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'power_vent', 'ea', 125.00, 85.00, 20),
  ('00000000-0000-0000-0000-000000000001', 'inspection', 'tear_off_layer', 'square', 25.00, 45.00, 15);

-- Sample Customers
INSERT INTO customers (organization_id, name, email, phone, address, city, state, zip) VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'john.smith@email.com', '(407) 555-1234', '123 Oak Street', 'Orlando', 'FL', '32801'),
  ('00000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'sarah.j@email.com', '(407) 555-5678', '456 Palm Avenue', 'Orlando', 'FL', '32803'),
  ('00000000-0000-0000-0000-000000000001', 'Mike Williams', 'mike.w@email.com', '(813) 555-9012', '789 Beach Road', 'Tampa', 'FL', '33602'),
  ('00000000-0000-0000-0000-000000000001', 'Emily Davis', 'emily.d@email.com', '(904) 555-3456', '321 River Lane', 'Jacksonville', 'FL', '32202');

-- Sample Projects
INSERT INTO projects (organization_id, customer_id, name, status, property_address, property_city, property_state, property_zip, roof_type, total_sqft, pitch, ridge_length, hip_length, valley_length, eave_length, rake_length, facets) VALUES
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM customers WHERE name = 'John Smith' LIMIT 1),
   'Smith Residence Re-roof',
   'proposed',
   '123 Oak Street', 'Orlando', 'FL', '32801',
   'Hip', 2450, '6/12', 45, 85, 20, 120, 80, 12),
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM customers WHERE name = 'Sarah Johnson' LIMIT 1),
   'Johnson Storm Damage Repair',
   'estimated',
   '456 Palm Avenue', 'Orlando', 'FL', '32803',
   'Gable', 1850, '5/12', 60, 0, 15, 100, 95, 6),
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM customers WHERE name = 'Mike Williams' LIMIT 1),
   'Williams Full Re-roof',
   'accepted',
   '789 Beach Road', 'Tampa', 'FL', '33602',
   'Complex', 3200, '8/12', 75, 120, 45, 145, 110, 18),
  ('00000000-0000-0000-0000-000000000001',
   (SELECT id FROM customers WHERE name = 'Emily Davis' LIMIT 1),
   'Davis Insurance Claim',
   'draft',
   '321 River Lane', 'Jacksonville', 'FL', '32202',
   'Gable', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
