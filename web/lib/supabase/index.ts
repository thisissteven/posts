import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY as string

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)
