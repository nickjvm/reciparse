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
      collections: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'collections_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      history: {
        Row: {
          created_at: string
          id: number
          parsed_id: string | null
          recipe_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          parsed_id?: string | null
          recipe_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          parsed_id?: string | null
          recipe_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'history_parsed_id_fkey'
            columns: ['parsed_id']
            isOneToOne: false
            referencedRelation: 'parsed'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'history_parsed_id_fkey'
            columns: ['parsed_id']
            isOneToOne: false
            referencedRelation: 'random_parsed'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'history_recipe_id_fkey'
            columns: ['recipe_id']
            isOneToOne: false
            referencedRelation: 'random_recipes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'history_recipe_id_fkey'
            columns: ['recipe_id']
            isOneToOne: false
            referencedRelation: 'recipes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'history_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      parsed: {
        Row: {
          created_at: string
          id: string
          image: string
          name: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          image: string
          name: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          name?: string
          url?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          collection_id: string
          cookTime: string | null
          created_at: string
          created_by: string | null
          handle: string | null
          id: string
          image: string | null
          ingredients: string[]
          instructions: Json[]
          is_public: boolean | null
          name: string
          notes: string | null
          prepTime: string | null
          source: string | null
          totalTime: string | null
          updated_at: string | null
          yield: number | null
        }
        Insert: {
          collection_id: string
          cookTime?: string | null
          created_at?: string
          created_by?: string | null
          handle?: string | null
          id?: string
          image?: string | null
          ingredients: string[]
          instructions: Json[]
          is_public?: boolean | null
          name: string
          notes?: string | null
          prepTime?: string | null
          source?: string | null
          totalTime?: string | null
          updated_at?: string | null
          yield?: number | null
        }
        Update: {
          collection_id?: string
          cookTime?: string | null
          created_at?: string
          created_by?: string | null
          handle?: string | null
          id?: string
          image?: string | null
          ingredients?: string[]
          instructions?: Json[]
          is_public?: boolean | null
          name?: string
          notes?: string | null
          prepTime?: string | null
          source?: string | null
          totalTime?: string | null
          updated_at?: string | null
          yield?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'recipes_collection_id_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'recipes_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      random_parsed: {
        Row: {
          created_at: string | null
          id: string | null
          image: string | null
          name: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          image?: string | null
          name?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          image?: string | null
          name?: string | null
          url?: string | null
        }
        Relationships: []
      }
      random_recipes: {
        Row: {
          collection_id: string | null
          cookTime: string | null
          created_at: string | null
          created_by: string | null
          handle: string | null
          id: string | null
          image: string | null
          ingredients: string[] | null
          instructions: Json[] | null
          is_public: boolean | null
          name: string | null
          notes: string | null
          prepTime: string | null
          source: string | null
          totalTime: string | null
          updated_at: string | null
          yield: number | null
        }
        Insert: {
          collection_id?: string | null
          cookTime?: string | null
          created_at?: string | null
          created_by?: string | null
          handle?: string | null
          id?: string | null
          image?: string | null
          ingredients?: string[] | null
          instructions?: Json[] | null
          is_public?: boolean | null
          name?: string | null
          notes?: string | null
          prepTime?: string | null
          source?: string | null
          totalTime?: string | null
          updated_at?: string | null
          yield?: number | null
        }
        Update: {
          collection_id?: string | null
          cookTime?: string | null
          created_at?: string | null
          created_by?: string | null
          handle?: string | null
          id?: string | null
          image?: string | null
          ingredients?: string[] | null
          instructions?: Json[] | null
          is_public?: boolean | null
          name?: string | null
          notes?: string | null
          prepTime?: string | null
          source?: string | null
          totalTime?: string | null
          updated_at?: string | null
          yield?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'recipes_collection_id_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'recipes_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never
