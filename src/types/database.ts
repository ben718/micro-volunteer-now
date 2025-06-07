
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
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          bio: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          max_distance: number
          availability: Json | null
          interests: string[] | null
          skills: string[] | null
          languages: string[] | null
          impact_score: number
          total_missions_completed: number
          total_hours_volunteered: number
          created_at: string
          updated_at: string
          role: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          max_distance?: number
          availability?: Json | null
          interests?: string[] | null
          skills?: string[] | null
          languages?: string[] | null
          impact_score?: number
          total_missions_completed?: number
          total_hours_volunteered?: number
          created_at?: string
          updated_at?: string
          role?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          max_distance?: number
          availability?: Json | null
          interests?: string[] | null
          skills?: string[] | null
          languages?: string[] | null
          impact_score?: number
          total_missions_completed?: number
          total_hours_volunteered?: number
          created_at?: string
          updated_at?: string
          role?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          color: string
          description: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          color: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          color?: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      missions: {
        Row: {
          id: string
          association_id: string
          title: string
          description: string
          short_description: string
          category: string
          image_url: string | null
          address: string
          city: string
          postal_code: string
          latitude: number | null
          longitude: number | null
          date: string
          start_time: string
          end_time: string
          duration: number
          spots_available: number
          spots_taken: number
          min_age: number
          requirements: string[] | null
          skills_needed: string[] | null
          languages_needed: string[] | null
          materials_provided: string[] | null
          materials_to_bring: string[] | null
          status: string
          is_recurring: boolean
          recurring_pattern: Json | null
          impact_description: string | null
          impact_metrics: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          association_id: string
          title: string
          description: string
          short_description: string
          category: string
          image_url?: string | null
          address: string
          city: string
          postal_code: string
          latitude?: number | null
          longitude?: number | null
          date: string
          start_time: string
          end_time: string
          duration: number
          spots_available: number
          spots_taken?: number
          min_age?: number
          requirements?: string[] | null
          skills_needed?: string[] | null
          languages_needed?: string[] | null
          materials_provided?: string[] | null
          materials_to_bring?: string[] | null
          status?: string
          is_recurring?: boolean
          recurring_pattern?: Json | null
          impact_description?: string | null
          impact_metrics?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          association_id?: string
          title?: string
          description?: string
          short_description?: string
          category?: string
          image_url?: string | null
          address?: string
          city?: string
          postal_code?: string
          latitude?: number | null
          longitude?: number | null
          date?: string
          start_time?: string
          end_time?: string
          duration?: number
          spots_available?: number
          spots_taken?: number
          min_age?: number
          requirements?: string[] | null
          skills_needed?: string[] | null
          languages_needed?: string[] | null
          materials_provided?: string[] | null
          materials_to_bring?: string[] | null
          status?: string
          is_recurring?: boolean
          recurring_pattern?: Json | null
          impact_description?: string | null
          impact_metrics?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      mission_registrations: {
        Row: {
          id: string
          mission_id: string
          user_id: string
          status: string
          registration_date: string
          confirmation_date: string | null
          completion_date: string | null
          cancellation_date: string | null
          cancellation_reason: string | null
          feedback: string | null
          rating: number | null
          hours_logged: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          user_id: string
          status?: string
          registration_date?: string
          confirmation_date?: string | null
          completion_date?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          feedback?: string | null
          rating?: number | null
          hours_logged?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          user_id?: string
          status?: string
          registration_date?: string
          confirmation_date?: string | null
          completion_date?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          feedback?: string | null
          rating?: number | null
          hours_logged?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      associations: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website: string | null
          email: string
          phone: string
          address: string
          city: string
          postal_code: string
          siret: string | null
          categories: string[]
          latitude: number | null
          longitude: number | null
          verified: boolean
          impact_score: number
          total_missions_created: number
          total_volunteers_engaged: number
          notification_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          email: string
          phone: string
          address: string
          city: string
          postal_code: string
          siret?: string | null
          categories: string[]
          latitude?: number | null
          longitude?: number | null
          verified?: boolean
          impact_score?: number
          total_missions_created?: number
          total_volunteers_engaged?: number
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          email?: string
          phone?: string
          address?: string
          city?: string
          postal_code?: string
          siret?: string | null
          categories?: string[]
          latitude?: number | null
          longitude?: number | null
          verified?: boolean
          impact_score?: number
          total_missions_created?: number
          total_volunteers_engaged?: number
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      association_members: {
        Row: {
          id: string
          association_id: string
          user_id: string | null
          email: string
          role: string
          status: string
          invitation_token: string | null
          invitation_sent_at: string | null
          invitation_accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          association_id: string
          user_id?: string | null
          email: string
          role: string
          status?: string
          invitation_token?: string | null
          invitation_sent_at?: string | null
          invitation_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          association_id?: string
          user_id?: string | null
          email?: string
          role?: string
          status?: string
          invitation_token?: string | null
          invitation_sent_at?: string | null
          invitation_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      language_levels: {
        Row: {
          id: string
          user_id: string
          language: string
          level: string
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: string
          level: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          level?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          mission_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          mission_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          mission_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          participant1_id: string
          participant2_id: string
          last_message_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant1_id: string
          participant2_id: string
          last_message_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant1_id?: string
          participant2_id?: string
          last_message_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          related_entity_type: string | null
          related_entity_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          age: number | null
          avatar: string | null
          level: string | null
          missions_count: number
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          age?: number | null
          avatar?: string | null
          level?: string | null
          missions_count?: number
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number | null
          avatar?: string | null
          level?: string | null
          missions_count?: number
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      global_stats: {
        Row: {
          id: string
          total_missions: number
          total_volunteers: number
          total_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_missions?: number
          total_volunteers?: number
          total_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_missions?: number
          total_volunteers?: number
          total_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      available_missions: {
        Row: {
          id: string
          association_id: string
          title: string
          description: string
          short_description: string
          category: string
          image_url: string | null
          address: string
          city: string
          postal_code: string
          latitude: number | null
          longitude: number | null
          date: string
          start_time: string
          end_time: string
          duration: number
          spots_available: number
          spots_taken: number
          min_age: number
          requirements: string[] | null
          skills_needed: string[] | null
          languages_needed: string[] | null
          materials_provided: string[] | null
          materials_to_bring: string[] | null
          status: string
          is_recurring: boolean
          recurring_pattern: Json | null
          impact_description: string | null
          impact_metrics: Json | null
          created_at: string
          updated_at: string
          association_name: string
          association_logo: string | null
        }
      }
    }
    Functions: {
      search_nearby_missions: {
        Args: {
          p_latitude: number
          p_longitude: number
          p_distance?: number
          p_category?: string
          p_date_start?: string
          p_date_end?: string
          p_duration_max?: number
          p_language?: string
        }
        Returns: {
          id: string
          association_id: string
          title: string
          description: string
          short_description: string
          category: string
          image_url: string | null
          address: string
          city: string
          postal_code: string
          latitude: number | null
          longitude: number | null
          date: string
          start_time: string
          end_time: string
          duration: number
          spots_available: number
          spots_taken: number
          min_age: number
          requirements: string[] | null
          skills_needed: string[] | null
          languages_needed: string[] | null
          materials_provided: string[] | null
          materials_to_bring: string[] | null
          status: string
          is_recurring: boolean
          recurring_pattern: Json | null
          impact_description: string | null
          impact_metrics: Json | null
          created_at: string
          updated_at: string
        }[]
      }
    }
  }
}
