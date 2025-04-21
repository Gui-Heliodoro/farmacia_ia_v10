export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          customer_name: string
          customer_phone: string
          last_message: string
          last_message_time: string
          status: 'in_progress' | 'waiting_human' | 'completed'
          assigned_to: string | null
          ai_handled_count: number
          human_handled_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          customer_name: string
          customer_phone: string
          last_message?: string
          last_message_time?: string
          status?: 'in_progress' | 'waiting_human' | 'completed'
          assigned_to?: string | null
          ai_handled_count?: number
          human_handled_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          last_message?: string
          last_message_time?: string
          status?: 'in_progress' | 'waiting_human' | 'completed'
          assigned_to?: string | null
          ai_handled_count?: number
          human_handled_count?: number
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          category: string
          price: number
          stock_quantity: number
          critical_level: number
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          category: string
          price: number
          stock_quantity: number
          critical_level: number
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          category?: string
          price?: number
          stock_quantity?: number
          critical_level?: number
          image_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string
          role: 'vendor' | 'pharmacist' | 'admin'
          avatar_url: string | null
          phone: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          full_name: string
          role: 'vendor' | 'pharmacist' | 'admin'
          avatar_url?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string
          role?: 'vendor' | 'pharmacist' | 'admin'
          avatar_url?: string | null
          phone?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      conversation_status: 'in_progress' | 'waiting_human' | 'completed'
      user_role: 'vendor' | 'pharmacist' | 'admin'
    }
  }
}