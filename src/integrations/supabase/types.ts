export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: {
          contact_info: Json
          created_at: string
          id: string
          message: string
          property_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_info: Json
          created_at?: string
          id?: string
          message: string
          property_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_info?: Json
          created_at?: string
          id?: string
          message?: string
          property_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          amenities: string[] | null
          available_from: string | null
          created_at: string
          description: string
          details: Json
          features: Json | null
          id: string
          images: string[] | null
          lease_duration: number | null
          location: Json
          maintenance_fee: number | null
          notice_period: number | null
          parking: Json | null
          posted_by: Json
          preferred_tenants: string[] | null
          price: number
          property_score: number
          purpose: string
          security_deposit: number | null
          sub_type: string | null
          title: string
          type: string
          updated_at: string
          videos: string[] | null
          views: number
        }
        Insert: {
          amenities?: string[] | null
          available_from?: string | null
          created_at?: string
          description: string
          details: Json
          features?: Json | null
          id?: string
          images?: string[] | null
          lease_duration?: number | null
          location: Json
          maintenance_fee?: number | null
          notice_period?: number | null
          parking?: Json | null
          posted_by: Json
          preferred_tenants?: string[] | null
          price: number
          property_score?: number
          purpose: string
          security_deposit?: number | null
          sub_type?: string | null
          title: string
          type: string
          updated_at?: string
          videos?: string[] | null
          views?: number
        }
        Update: {
          amenities?: string[] | null
          available_from?: string | null
          created_at?: string
          description?: string
          details?: Json
          features?: Json | null
          id?: string
          images?: string[] | null
          lease_duration?: number | null
          location?: Json
          maintenance_fee?: number | null
          notice_period?: number | null
          parking?: Json | null
          posted_by?: Json
          preferred_tenants?: string[] | null
          price?: number
          property_score?: number
          purpose?: string
          security_deposit?: number | null
          sub_type?: string | null
          title?: string
          type?: string
          updated_at?: string
          videos?: string[] | null
          views?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          email_verified: boolean
          id: string
          inquiries: string[] | null
          listed_properties: string[] | null
          name: string
          phone: string
          phone_verified: boolean
          saved_properties: string[] | null
          saved_searches: Json[] | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          type: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          email_verified?: boolean
          id: string
          inquiries?: string[] | null
          listed_properties?: string[] | null
          name: string
          phone: string
          phone_verified?: boolean
          saved_properties?: string[] | null
          saved_searches?: Json[] | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: string
          inquiries?: string[] | null
          listed_properties?: string[] | null
          name?: string
          phone?: string
          phone_verified?: boolean
          saved_properties?: string[] | null
          saved_searches?: Json[] | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
