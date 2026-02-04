-- EstimAIte Row Level Security Policies
-- Ensures multi-tenant data isolation

-- Enable RLS on all tables
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

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'admin' FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user can write (admin or estimator)
CREATE OR REPLACE FUNCTION can_user_write()
RETURNS BOOLEAN AS $$
  SELECT role IN ('admin', 'estimator') FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Organizations policies
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (id = get_user_organization_id());

CREATE POLICY "Admins can update their organization"
  ON organizations FOR UPDATE
  USING (id = get_user_organization_id() AND is_user_admin());

-- Users policies
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND organization_id = get_user_organization_id());

CREATE POLICY "Admins can insert users in their organization"
  ON users FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id() AND is_user_admin());

CREATE POLICY "Admins can delete users in their organization"
  ON users FOR DELETE
  USING (organization_id = get_user_organization_id() AND is_user_admin() AND id != auth.uid());

-- Pricing Matrix policies
CREATE POLICY "Users can view their organization's pricing"
  ON pricing_matrix FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Admins can insert pricing"
  ON pricing_matrix FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id() AND is_user_admin());

CREATE POLICY "Admins can update pricing"
  ON pricing_matrix FOR UPDATE
  USING (organization_id = get_user_organization_id() AND is_user_admin());

CREATE POLICY "Admins can delete pricing"
  ON pricing_matrix FOR DELETE
  USING (organization_id = get_user_organization_id() AND is_user_admin());

-- Products policies
CREATE POLICY "Users can view products"
  ON products FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id() AND is_user_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (organization_id = get_user_organization_id() AND is_user_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (organization_id = get_user_organization_id() AND is_user_admin());

-- Customers policies
CREATE POLICY "Users can view customers"
  ON customers FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Writers can insert customers"
  ON customers FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id() AND can_user_write());

CREATE POLICY "Writers can update customers"
  ON customers FOR UPDATE
  USING (organization_id = get_user_organization_id() AND can_user_write());

CREATE POLICY "Admins can delete customers"
  ON customers FOR DELETE
  USING (organization_id = get_user_organization_id() AND is_user_admin());

-- Projects policies
CREATE POLICY "Users can view projects"
  ON projects FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Writers can insert projects"
  ON projects FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id() AND can_user_write());

CREATE POLICY "Writers can update projects"
  ON projects FOR UPDATE
  USING (organization_id = get_user_organization_id() AND can_user_write());

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (organization_id = get_user_organization_id() AND is_user_admin());

-- Project Inspection Items policies
CREATE POLICY "Users can view inspection items for their projects"
  ON project_inspection_items FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
  );

CREATE POLICY "Writers can insert inspection items"
  ON project_inspection_items FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

CREATE POLICY "Writers can update inspection items"
  ON project_inspection_items FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

CREATE POLICY "Writers can delete inspection items"
  ON project_inspection_items FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

-- Project Estimates policies
CREATE POLICY "Users can view estimates"
  ON project_estimates FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
  );

CREATE POLICY "Writers can insert estimates"
  ON project_estimates FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

CREATE POLICY "Writers can update estimates"
  ON project_estimates FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

CREATE POLICY "Writers can delete estimates"
  ON project_estimates FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

-- Proposals policies
CREATE POLICY "Users can view proposals"
  ON proposals FOR SELECT
  USING (
    estimate_id IN (
      SELECT pe.id FROM project_estimates pe
      JOIN projects p ON pe.project_id = p.id
      WHERE p.organization_id = get_user_organization_id()
    )
  );

CREATE POLICY "Writers can insert proposals"
  ON proposals FOR INSERT
  WITH CHECK (
    estimate_id IN (
      SELECT pe.id FROM project_estimates pe
      JOIN projects p ON pe.project_id = p.id
      WHERE p.organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

CREATE POLICY "Writers can update proposals"
  ON proposals FOR UPDATE
  USING (
    estimate_id IN (
      SELECT pe.id FROM project_estimates pe
      JOIN projects p ON pe.project_id = p.id
      WHERE p.organization_id = get_user_organization_id()
    )
    AND can_user_write()
  );

CREATE POLICY "Admins can delete proposals"
  ON proposals FOR DELETE
  USING (
    estimate_id IN (
      SELECT pe.id FROM project_estimates pe
      JOIN projects p ON pe.project_id = p.id
      WHERE p.organization_id = get_user_organization_id()
    )
    AND is_user_admin()
  );

-- Audit Log policies (read-only for users)
CREATE POLICY "Users can view their organization's audit log"
  ON audit_log FOR SELECT
  USING (organization_id = get_user_organization_id());

-- Allow insert from service role or triggers
CREATE POLICY "System can insert audit logs"
  ON audit_log FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id());
