-- ============================================================
-- EstimAIte Complete Database Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Organizations (multi-tenant root)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users with organization membership
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'estimator', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Matrix for configurable costs
CREATE TABLE pricing_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  base_cost DECIMAL(10,2) NOT NULL,
  labor_cost_per_unit DECIMAL(10,2) DEFAULT 0,
  markup_percent DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, category, item_name)
);

-- Products catalog
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT,
  price_per_unit DECIMAL(10,2) NOT NULL,
  unit_type TEXT NOT NULL,
  coverage_per_unit DECIMAL(10,4),
  waste_factor DECIMAL(5,2) DEFAULT 0.10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'estimated', 'proposed', 'accepted', 'declined', 'completed')),
  property_address TEXT,
  property_city TEXT,
  property_state TEXT,
  property_zip TEXT,
  roof_type TEXT,
  total_sqft DECIMAL(10,2),
  pitch TEXT,
  ridge_length DECIMAL(10,2),
  hip_length DECIMAL(10,2),
  valley_length DECIMAL(10,2),
  eave_length DECIMAL(10,2),
  rake_length DECIMAL(10,2),
  facets INTEGER,
  stories INTEGER DEFAULT 1,
  layers INTEGER DEFAULT 1,
  is_walkable BOOLEAN DEFAULT true,
  eagleview_data JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Inspection Items
CREATE TABLE project_inspection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Estimates
CREATE TABLE project_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  material_cost DECIMAL(10,2) NOT NULL,
  labor_cost DECIMAL(10,2) NOT NULL,
  overhead_cost DECIMAL(10,2) DEFAULT 0,
  overhead_percent DECIMAL(5,2) DEFAULT 0,
  profit_margin DECIMAL(5,2) DEFAULT 0,
  profit_amount DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  financing_options JSONB DEFAULT '[]',
  line_items JSONB NOT NULL DEFAULT '[]',
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, version)
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimate_id UUID NOT NULL REFERENCES project_estimates(id) ON DELETE CASCADE,
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signature_data TEXT,
  signer_name TEXT,
  signer_ip TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'expired', 'declined')),
  expires_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_pricing_matrix_org ON pricing_matrix(organization_id);
CREATE INDEX idx_pricing_matrix_category ON pricing_matrix(organization_id, category);
CREATE INDEX idx_products_org ON products(organization_id);
CREATE INDEX idx_products_category ON products(organization_id, category);
CREATE INDEX idx_customers_org ON customers(organization_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(organization_id, status);
CREATE INDEX idx_inspection_items_project ON project_inspection_items(project_id);
CREATE INDEX idx_estimates_project ON project_estimates(project_id);
CREATE INDEX idx_proposals_estimate ON proposals(estimate_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_audit_log_org ON audit_log(organization_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pricing_matrix_updated_at BEFORE UPDATE ON pricing_matrix FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'admin' FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION can_user_write()
RETURNS BOOLEAN AS $$
  SELECT role IN ('admin', 'estimator') FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Policies (simplified for demo - allow all for authenticated users in their org)
CREATE POLICY "org_select" ON organizations FOR SELECT USING (id = get_user_organization_id());
CREATE POLICY "org_update" ON organizations FOR UPDATE USING (id = get_user_organization_id() AND is_user_admin());

CREATE POLICY "users_select" ON users FOR SELECT USING (organization_id = get_user_organization_id());
CREATE POLICY "users_update" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "pricing_select" ON pricing_matrix FOR SELECT USING (organization_id = get_user_organization_id());
CREATE POLICY "pricing_insert" ON pricing_matrix FOR INSERT WITH CHECK (organization_id = get_user_organization_id());
CREATE POLICY "pricing_update" ON pricing_matrix FOR UPDATE USING (organization_id = get_user_organization_id());
CREATE POLICY "pricing_delete" ON pricing_matrix FOR DELETE USING (organization_id = get_user_organization_id());

CREATE POLICY "products_select" ON products FOR SELECT USING (organization_id = get_user_organization_id());
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (organization_id = get_user_organization_id());
CREATE POLICY "products_update" ON products FOR UPDATE USING (organization_id = get_user_organization_id());
CREATE POLICY "products_delete" ON products FOR DELETE USING (organization_id = get_user_organization_id());

CREATE POLICY "customers_select" ON customers FOR SELECT USING (organization_id = get_user_organization_id());
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (organization_id = get_user_organization_id());
CREATE POLICY "customers_update" ON customers FOR UPDATE USING (organization_id = get_user_organization_id());
CREATE POLICY "customers_delete" ON customers FOR DELETE USING (organization_id = get_user_organization_id());

CREATE POLICY "projects_select" ON projects FOR SELECT USING (organization_id = get_user_organization_id());
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (organization_id = get_user_organization_id());
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (organization_id = get_user_organization_id());
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (organization_id = get_user_organization_id());

CREATE POLICY "inspection_select" ON project_inspection_items FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));
CREATE POLICY "inspection_insert" ON project_inspection_items FOR INSERT WITH CHECK (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));
CREATE POLICY "inspection_update" ON project_inspection_items FOR UPDATE USING (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));
CREATE POLICY "inspection_delete" ON project_inspection_items FOR DELETE USING (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));

CREATE POLICY "estimates_select" ON project_estimates FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));
CREATE POLICY "estimates_insert" ON project_estimates FOR INSERT WITH CHECK (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));
CREATE POLICY "estimates_update" ON project_estimates FOR UPDATE USING (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));
CREATE POLICY "estimates_delete" ON project_estimates FOR DELETE USING (project_id IN (SELECT id FROM projects WHERE organization_id = get_user_organization_id()));

CREATE POLICY "proposals_select" ON proposals FOR SELECT USING (estimate_id IN (SELECT pe.id FROM project_estimates pe JOIN projects p ON pe.project_id = p.id WHERE p.organization_id = get_user_organization_id()));
CREATE POLICY "proposals_insert" ON proposals FOR INSERT WITH CHECK (estimate_id IN (SELECT pe.id FROM project_estimates pe JOIN projects p ON pe.project_id = p.id WHERE p.organization_id = get_user_organization_id()));
CREATE POLICY "proposals_update" ON proposals FOR UPDATE USING (estimate_id IN (SELECT pe.id FROM project_estimates pe JOIN projects p ON pe.project_id = p.id WHERE p.organization_id = get_user_organization_id()));
CREATE POLICY "proposals_delete" ON proposals FOR DELETE USING (estimate_id IN (SELECT pe.id FROM project_estimates pe JOIN projects p ON pe.project_id = p.id WHERE p.organization_id = get_user_organization_id()));

CREATE POLICY "audit_select" ON audit_log FOR SELECT USING (organization_id = get_user_organization_id());
CREATE POLICY "audit_insert" ON audit_log FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

-- ============================================================
-- SEED DATA - Roofing Pros USA Pricing
-- ============================================================

-- Insert organization
INSERT INTO organizations (id, name, logo_url, settings) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Roofing Pros USA', NULL,
   '{"defaultOverheadPercent": 0, "defaultMarginPercent": 41, "taxRate": 10}')
ON CONFLICT (id) DO UPDATE SET settings = EXCLUDED.settings;

-- Products
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

-- Pricing Matrix (Labor Rates & Inspection Items)
INSERT INTO pricing_matrix (organization_id, category, item_name, unit, base_cost, labor_cost_per_unit, markup_percent) VALUES
  -- Labor Rates
  ('00000000-0000-0000-0000-000000000001', 'labor', 'shingle_labor', 'square', 0, 80.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'rib_panel_labor', 'square', 0, 150.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'standing_seam_labor', 'square', 0, 200.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'extra_layers_labor', 'square', 0, 8.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'non_walkable', 'square', 0, 10.00, 0),
  ('00000000-0000-0000-0000-000000000001', 'labor', 'flat_roof', 'square', 0, 200.00, 0),
  -- Inspection Items
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

-- Sample Customers
INSERT INTO customers (organization_id, name, email, phone, address, city, state, zip) VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'john.smith@email.com', '(407) 555-1234', '123 Oak Street', 'Orlando', 'FL', '32801'),
  ('00000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'sarah.j@email.com', '(407) 555-5678', '456 Palm Avenue', 'Orlando', 'FL', '32803'),
  ('00000000-0000-0000-0000-000000000001', 'Mike Williams', 'mike.w@email.com', '(813) 555-9012', '789 Beach Road', 'Tampa', 'FL', '33602');

SELECT 'Setup complete! Now create a user account and run the user setup SQL below.' as status;
