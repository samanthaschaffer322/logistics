import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          created_at: string
        }
        Insert: {
          id?: string
          file_name: string
          storage_path: string
          uploaded_by: string
          parsed_json: any
          created_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          storage_path?: string
          uploaded_by?: string
          parsed_json?: any
          created_at?: string
        }
      }
    }
  }
}
