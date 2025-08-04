import { createClient } from '@supabase/supabase-js'

// Provide fallback values for build time when env vars might not be available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create the client if we have real values (not placeholders)
const hasValidConfig = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: hasValidConfig, // Only persist session if we have valid config
    autoRefreshToken: hasValidConfig,
  },
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => hasValidConfig

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'warehouse' | 'transport' | 'distribution' | 'procurement'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'admin' | 'warehouse' | 'transport' | 'distribution' | 'procurement'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'warehouse' | 'transport' | 'distribution' | 'procurement'
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          item_name: string
          sku: string
          quantity: number
          reorder_level: number
          warehouse_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_name: string
          sku: string
          quantity: number
          reorder_level: number
          warehouse_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_name?: string
          sku?: string
          quantity?: number
          reorder_level?: number
          warehouse_id?: string
          updated_at?: string
        }
      }
      warehouse: {
        Row: {
          id: string
          name: string
          location: string
          manager_id: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          manager_id: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          manager_id?: string
        }
      }
      fleet: {
        Row: {
          id: string
          vehicle_id: string
          driver_id: string
          capacity: number
          status: 'available' | 'in_transit' | 'maintenance'
          current_location: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          driver_id: string
          capacity: number
          status: 'available' | 'in_transit' | 'maintenance'
          current_location: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          driver_id?: string
          capacity?: number
          status?: 'available' | 'in_transit' | 'maintenance'
          current_location?: string
        }
      }
      driver_schedule: {
        Row: {
          id: string
          driver_id: string
          vehicle_id: string
          start_time: string
          end_time: string
          route: string
        }
        Insert: {
          id?: string
          driver_id: string
          vehicle_id: string
          start_time: string
          end_time: string
          route: string
        }
        Update: {
          id?: string
          driver_id?: string
          vehicle_id?: string
          start_time?: string
          end_time?: string
          route?: string
        }
      }
      distribution_orders: {
        Row: {
          id: string
          customer_name: string
          destination: string
          status: 'pending' | 'dispatched' | 'delivered'
          delivery_date: string
        }
        Insert: {
          id?: string
          customer_name: string
          destination: string
          status: 'pending' | 'dispatched' | 'delivered'
          delivery_date: string
        }
        Update: {
          id?: string
          customer_name?: string
          destination?: string
          status?: 'pending' | 'dispatched' | 'delivered'
          delivery_date?: string
        }
      }
      procurement: {
        Row: {
          id: string
          item_id: string
          vendor_name: string
          incoterm: string
          quantity: number
          status: 'requested' | 'ordered' | 'received'
        }
        Insert: {
          id?: string
          item_id: string
          vendor_name: string
          incoterm: string
          quantity: number
          status: 'requested' | 'ordered' | 'received'
        }
        Update: {
          id?: string
          item_id?: string
          vendor_name?: string
          incoterm?: string
          quantity?: number
          status?: 'requested' | 'ordered' | 'received'
        }
      }
      uploaded_plans: {
        Row: {
          id: string
          file_name: string
          storage_path: string
          uploaded_by: string
          parsed_json: any
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          file_name: string
          storage_path: string
          uploaded_by: string
          parsed_json: any
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          storage_path?: string
          uploaded_by?: string
          parsed_json?: any
          updated_at?: string
          created_at?: string
        }
      }
      shipments: {
        Row: {
          id: string
          docket_no: string
          sender_id: string
          receiver_id: string
          package_contact_person: string
          package_contact_phone: string
          package_type: string
          package_weight: number
          pickup_address: string
          delivery_address: string
          transport_company: string
          transport_driver: string
          transport_vehicle: string
          charge_total: number
          charge_advance_paid: number
          charge_balance: number
          status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          pickup_date: string
          delivery_date: string
          estimated_delivery: string
          payment_status: 'pending' | 'partial' | 'paid' | 'overdue'
          current_location: string
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          docket_no: string
          sender_id?: string
          receiver_id?: string
          package_contact_person?: string
          package_contact_phone?: string
          package_type?: string
          package_weight?: number
          pickup_address: string
          delivery_address: string
          transport_company?: string
          transport_driver?: string
          transport_vehicle?: string
          charge_total?: number
          charge_advance_paid?: number
          charge_balance?: number
          status?: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          pickup_date?: string
          delivery_date?: string
          estimated_delivery?: string
          payment_status?: 'pending' | 'partial' | 'paid' | 'overdue'
          current_location?: string
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          docket_no?: string
          sender_id?: string
          receiver_id?: string
          package_contact_person?: string
          package_contact_phone?: string
          package_type?: string
          package_weight?: number
          pickup_address?: string
          delivery_address?: string
          transport_company?: string
          transport_driver?: string
          transport_vehicle?: string
          charge_total?: number
          charge_advance_paid?: number
          charge_balance?: number
          status?: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          pickup_date?: string
          delivery_date?: string
          estimated_delivery?: string
          payment_status?: 'pending' | 'partial' | 'paid' | 'overdue'
          current_location?: string
          notes?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          company_name: string
          contact_person: string
          email: string
          phone: string
          billing_address: string
          status: 'active' | 'inactive' | 'blocked'
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_person?: string
          email?: string
          phone?: string
          billing_address?: string
          status?: 'active' | 'inactive' | 'blocked'
          created_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          contact_person?: string
          email?: string
          phone?: string
          billing_address?: string
          status?: 'active' | 'inactive' | 'blocked'
          created_at?: string
        }
      }
    }
  }
}
