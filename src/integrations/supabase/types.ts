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
      fragrance_collections: {
        Row: {
          created_at: string
          fragrance_id: number
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          fragrance_id: number
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          fragrance_id?: number
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      Messages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          read: boolean | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      Notifications: {
        Row: {
          content: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean | null
          recipient_id: string | null
          source_id: string | null
          type: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id: string
          link?: string | null
          read?: boolean | null
          recipient_id?: string | null
          source_id?: string | null
          type?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          recipient_id?: string | null
          source_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      Posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          id: string
          likes_count: number | null
          media_urls: string | null
          privacy_level: number | null
          user_id: string | null
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id: string
          likes_count?: number | null
          media_urls?: string | null
          privacy_level?: number | null
          user_id?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: string
          likes_count?: number | null
          media_urls?: string | null
          privacy_level?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      "Relationships Table": {
        Row: {
          circle_level: number | null
          created_at: string
          id: string
          last_interaction_date: string | null
          related_user_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          circle_level?: number | null
          created_at?: string
          id: string
          last_interaction_date?: string | null
          related_user_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          circle_level?: number | null
          created_at?: string
          id?: string
          last_interaction_date?: string | null
          related_user_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          gender_preference: string | null
          id: string
          intensity: number | null
          occasions: string[] | null
          preferred_notes: string[] | null
          price_max: number | null
          price_min: number | null
          seasons: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gender_preference?: string | null
          id?: string
          intensity?: number | null
          occasions?: string[] | null
          preferred_notes?: string[] | null
          price_max?: number | null
          price_min?: number | null
          seasons?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gender_preference?: string | null
          id?: string
          intensity?: number | null
          occasions?: string[] | null
          preferred_notes?: string[] | null
          price_max?: number | null
          price_min?: number | null
          seasons?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Users: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          profile_picture_url: string | null
          settings: Json | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at: string
          email?: string | null
          full_name?: string | null
          id: string
          profile_picture_url?: string | null
          settings?: Json | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          profile_picture_url?: string | null
          settings?: Json | null
          username?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
