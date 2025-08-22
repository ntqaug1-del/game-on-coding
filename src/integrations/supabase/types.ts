export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      audio_recordings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          file_path: string
          id: string
          public_url: string
          session_id: string | null
          speed: number
          tags: string[] | null
          text_content: string
          title: string
          updated_at: string | null
          user_id: string | null
          voice: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_path: string
          id?: string
          public_url: string
          session_id?: string | null
          speed: number
          tags?: string[] | null
          text_content: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          voice: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_path?: string
          id?: string
          public_url?: string
          session_id?: string | null
          speed?: number
          tags?: string[] | null
          text_content?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          voice?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      elite_web_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      elite_web_votes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          website_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elite_web_votes_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "elite_web_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      elite_web_websites: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          submitted_by: string | null
          updated_at: string | null
          url: string
          views_count: number | null
          votes_count: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          url: string
          views_count?: number | null
          votes_count?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          url?: string
          views_count?: number | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "elite_web_websites_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "elite_web_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          avatar_url: string | null
          class_id: string | null
          created_at: string | null
          id: string
          name: string
          rank: Database["public"]["Enums"]["student_rank"] | null
          score: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          rank?: Database["public"]["Enums"]["student_rank"] | null
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          rank?: Database["public"]["Enums"]["student_rank"] | null
          score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_counter: {
        Row: {
          count: number | null
          id: number
          last_updated: string | null
          page_name: string
        }
        Insert: {
          count?: number | null
          id?: number
          last_updated?: string | null
          page_name: string
        }
        Update: {
          count?: number | null
          id?: number
          last_updated?: string | null
          page_name?: string
        }
        Relationships: []
      }
      visit_logs: {
        Row: {
          created_at: string | null
          id: number
          ip_address: string
          page_name: string
          visit_date: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          ip_address: string
          page_name: string
          visit_date?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          ip_address?: string
          page_name?: string
          visit_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_rank: {
        Args: { score_value: number }
        Returns: Database["public"]["Enums"]["student_rank"]
      }
    }
    Enums: {
      student_rank: "Bạc" | "Vàng" | "Bạch Kim" | "Kim Cương" | "Cao Thủ"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      student_rank: ["Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ"],
    },
  },
} as const
