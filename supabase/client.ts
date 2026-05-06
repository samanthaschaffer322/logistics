import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const isSupabaseConfigured = !!(url && key && !url.includes('your-project'))

export const supabase = isSupabaseConfigured
  ? createClient(url, key)
  : ({
      from: () => ({ select: () => ({ data: [], error: null }), insert: () => ({ data: null, error: null }), update: () => ({ eq: () => ({ data: null, error: null }) }), delete: () => ({ eq: () => ({ data: null, error: null }) }) })
    } as any)

export default supabase
