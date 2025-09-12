import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}
if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (uses service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          status: 'created' | 'running' | 'succeeded' | 'failed'
          input: any
          output: any
          error: string | null
          provider: string | null
          provider_job_id: string | null
          model_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          status?: 'created' | 'running' | 'succeeded' | 'failed'
          input?: any
          output?: any
          error?: string | null
          provider?: string | null
          provider_job_id?: string | null
          model_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          status?: 'created' | 'running' | 'succeeded' | 'failed'
          input?: any
          output?: any
          error?: string | null
          provider?: string | null
          provider_job_id?: string | null
          model_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
