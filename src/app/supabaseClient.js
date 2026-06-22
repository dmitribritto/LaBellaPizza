import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytbneajzoviottyaabsa.supabase.co'
const supabaseAnonKey = 'sb_publishable_z9U_amgivPQvHA0guzBEVQ_VhElrY_W' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)