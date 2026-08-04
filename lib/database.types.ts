export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null;
          country: string | null;
          created_at: string;
          id: string;
          is_default: boolean | null;
          label: string | null;
          line1: string | null;
          phone: string | null;
          user_id: string;
        };
        Insert: {
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: string;
          is_default?: boolean | null;
          label?: string | null;
          line1?: string | null;
          phone?: string | null;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          type: Database["public"]["Enums"]["application_type"];
          position: string | null;
          message: string | null;
          cv_url: string | null;
          cover_letter_url: string | null;
          internship_request_url: string | null;
          other_docs: string[] | null;
          status: Database["public"]["Enums"]["application_status"];
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          type?: Database["public"]["Enums"]["application_type"];
          position?: string | null;
          message?: string | null;
          cv_url?: string | null;
          cover_letter_url?: string | null;
          internship_request_url?: string | null;
          other_docs?: string[] | null;
          status?: Database["public"]["Enums"]["application_status"];
          user_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          author: string | null;
          category: string | null;
          content: string | null;
          cover_url: string | null;
          created_at: string;
          excerpt: string | null;
          icon: string | null;
          id: string;
          published: boolean | null;
          published_at: string | null;
          read_time: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          author?: string | null;
          category?: string | null;
          content?: string | null;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          icon?: string | null;
          id?: string;
          published?: boolean | null;
          published_at?: string | null;
          read_time?: string | null;
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      brands: {
        Row: {
          created_at: string;
          id: string;
          monogram: string | null;
          name: string;
          origin: string | null;
          slug: string;
          logo: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          monogram?: string | null;
          name: string;
          origin?: string | null;
          slug: string;
          logo?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          icon: string | null;
          features: string[] | null;
          accent: string | null;
          sort_order: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          features?: string[] | null;
          accent?: string | null;
          sort_order?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          accent: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          accent?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
        Relationships: [];
      };
      invoices: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          number: string;
          order_id: string | null;
          url: string | null;
          user_id: string;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          id?: string;
          number: string;
          order_id?: string | null;
          url?: string | null;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          message: string | null;
          name: string;
          phone: string | null;
          status: Database["public"]["Enums"]["message_status"];
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name: string;
          phone?: string | null;
          status?: Database["public"]["Enums"]["message_status"];
          subject?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: { created_at: string; email: string; id: string };
        Insert: { created_at?: string; email: string; id?: string };
        Update: Partial<
          Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]
        >;
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          read: boolean | null;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          read?: boolean | null;
          title: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity?: number;
          unit_price?: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          channel: Database["public"]["Enums"]["order_channel"];
          created_at: string;
          id: string;
          notes: string | null;
          reference: string;
          status: Database["public"]["Enums"]["order_status"];
          total: number;
          user_id: string;
        };
        Insert: {
          channel?: Database["public"]["Enums"]["order_channel"];
          created_at?: string;
          id?: string;
          notes?: string | null;
          reference?: string;
          status?: Database["public"]["Enums"]["order_status"];
          total?: number;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          accent: string | null;
          badges: string[] | null;
          brand_id: string | null;
          category_id: string | null;
          created_at: string;
          delivery: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          images: string[] | null;
          in_stock: boolean | null;
          is_featured: boolean | null;
          name: string;
          old_price: number | null;
          price: number;
          rating: number | null;
          reviews: number | null;
          short_description: string | null;
          slug: string;
          specs: Json | null;
          stock_qty: number | null;
          updated_at: string;
          warranty: string | null;
        };
        Insert: {
          accent?: string | null;
          badges?: string[] | null;
          brand_id?: string | null;
          category_id?: string | null;
          created_at?: string;
          delivery?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          images?: string[] | null;
          in_stock?: boolean | null;
          is_featured?: boolean | null;
          name: string;
          old_price?: number | null;
          price?: number;
          rating?: number | null;
          reviews?: number | null;
          short_description?: string | null;
          slug: string;
          specs?: Json | null;
          stock_qty?: number | null;
          updated_at?: string;
          warranty?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: { key: string; value: string | null; updated_at: string };
        Insert: { key: string; value?: string | null; updated_at?: string };
        Update: Partial<{ key: string; value: string | null; updated_at: string }>;
        Relationships: [];
      };
      promotions: {
        Row: {
          active: boolean | null;
          code: string | null;
          created_at: string;
          description: string | null;
          discount_percent: number | null;
          ends_at: string | null;
          id: string;
          starts_at: string | null;
          title: string;
        };
        Insert: {
          active?: boolean | null;
          code?: string | null;
          created_at?: string;
          description?: string | null;
          discount_percent?: number | null;
          ends_at?: string | null;
          id?: string;
          starts_at?: string | null;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["promotions"]["Insert"]>;
        Relationships: [];
      };
      quotes: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          message: string | null;
          name: string;
          phone: string | null;
          product_id: string | null;
          status: Database["public"]["Enums"]["quote_status"];
          subject: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name: string;
          phone?: string | null;
          product_id?: string | null;
          status?: Database["public"]["Enums"]["quote_status"];
          subject?: string | null;
          user_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      message_status: "new" | "read" | "replied";
      order_channel: "whatsapp" | "online";
      order_status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
      quote_status: "new" | "processing" | "sent" | "closed";
      user_role: "client" | "admin";
      application_type: "stage" | "emploi" | "spontanee";
      application_status: "received" | "reviewing" | "accepted" | "rejected";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
