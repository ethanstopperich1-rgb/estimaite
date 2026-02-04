// Database types - will be auto-generated from Supabase
// For now, define manually

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          name: string;
          role: 'admin' | 'estimator' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id: string;
          email: string;
          name: string;
          role: 'admin' | 'estimator' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'estimator' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
      };
      pricing_matrix: {
        Row: {
          id: string;
          organization_id: string;
          category: string;
          item_name: string;
          unit: string;
          base_cost: number;
          labor_cost_per_unit: number;
          markup_percent: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          category: string;
          item_name: string;
          unit: string;
          base_cost: number;
          labor_cost_per_unit?: number;
          markup_percent?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          category?: string;
          item_name?: string;
          unit?: string;
          base_cost?: number;
          labor_cost_per_unit?: number;
          markup_percent?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          category: string;
          manufacturer: string | null;
          price_per_unit: number;
          unit_type: string;
          coverage_per_unit: number | null;
          waste_factor: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          category: string;
          manufacturer?: string | null;
          price_per_unit: number;
          unit_type: string;
          coverage_per_unit?: number | null;
          waste_factor?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          category?: string;
          manufacturer?: string | null;
          price_per_unit?: number;
          unit_type?: string;
          coverage_per_unit?: number | null;
          waste_factor?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          customer_id: string | null;
          name: string;
          status: 'draft' | 'estimated' | 'proposed' | 'accepted' | 'declined' | 'completed';
          property_address: string | null;
          property_city: string | null;
          property_state: string | null;
          property_zip: string | null;
          roof_type: string | null;
          total_sqft: number | null;
          pitch: string | null;
          ridge_length: number | null;
          hip_length: number | null;
          valley_length: number | null;
          eave_length: number | null;
          rake_length: number | null;
          facets: number | null;
          eagleview_data: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          customer_id?: string | null;
          name: string;
          status?: 'draft' | 'estimated' | 'proposed' | 'accepted' | 'declined' | 'completed';
          property_address?: string | null;
          property_city?: string | null;
          property_state?: string | null;
          property_zip?: string | null;
          roof_type?: string | null;
          total_sqft?: number | null;
          pitch?: string | null;
          ridge_length?: number | null;
          hip_length?: number | null;
          valley_length?: number | null;
          eave_length?: number | null;
          rake_length?: number | null;
          facets?: number | null;
          eagleview_data?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          customer_id?: string | null;
          name?: string;
          status?: 'draft' | 'estimated' | 'proposed' | 'accepted' | 'declined' | 'completed';
          property_address?: string | null;
          property_city?: string | null;
          property_state?: string | null;
          property_zip?: string | null;
          roof_type?: string | null;
          total_sqft?: number | null;
          pitch?: string | null;
          ridge_length?: number | null;
          hip_length?: number | null;
          valley_length?: number | null;
          eave_length?: number | null;
          rake_length?: number | null;
          facets?: number | null;
          eagleview_data?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_inspection_items: {
        Row: {
          id: string;
          project_id: string;
          item_type: string;
          description: string | null;
          quantity: number;
          unit: string;
          unit_cost: number;
          labor_cost: number;
          total_cost: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          item_type: string;
          description?: string | null;
          quantity: number;
          unit: string;
          unit_cost: number;
          labor_cost?: number;
          total_cost: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          item_type?: string;
          description?: string | null;
          quantity?: number;
          unit?: string;
          unit_cost?: number;
          labor_cost?: number;
          total_cost?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
      project_estimates: {
        Row: {
          id: string;
          project_id: string;
          version: number;
          material_cost: number;
          labor_cost: number;
          overhead_cost: number;
          overhead_percent: number;
          profit_margin: number;
          profit_amount: number;
          subtotal: number;
          total_price: number;
          financing_options: Json;
          line_items: Json;
          valid_until: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          version?: number;
          material_cost: number;
          labor_cost: number;
          overhead_cost?: number;
          overhead_percent?: number;
          profit_margin?: number;
          profit_amount?: number;
          subtotal: number;
          total_price: number;
          financing_options?: Json;
          line_items: Json;
          valid_until?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          version?: number;
          material_cost?: number;
          labor_cost?: number;
          overhead_cost?: number;
          overhead_percent?: number;
          profit_margin?: number;
          profit_amount?: number;
          subtotal?: number;
          total_price?: number;
          financing_options?: Json;
          line_items?: Json;
          valid_until?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          estimate_id: string;
          pdf_url: string | null;
          sent_at: string | null;
          viewed_at: string | null;
          signed_at: string | null;
          signature_data: string | null;
          signer_name: string | null;
          signer_ip: string | null;
          status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired' | 'declined';
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          estimate_id: string;
          pdf_url?: string | null;
          sent_at?: string | null;
          viewed_at?: string | null;
          signed_at?: string | null;
          signature_data?: string | null;
          signer_name?: string | null;
          signer_ip?: string | null;
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired' | 'declined';
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          estimate_id?: string;
          pdf_url?: string | null;
          sent_at?: string | null;
          viewed_at?: string | null;
          signed_at?: string | null;
          signature_data?: string | null;
          signer_name?: string | null;
          signer_ip?: string | null;
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired' | 'declined';
          expires_at?: string | null;
          created_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          changes: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          changes?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          changes?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      get_user_organization_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_user_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {};
  };
}
