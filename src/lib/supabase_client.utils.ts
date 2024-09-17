import { createClient} from '@supabase/supabase-js'
import { ENV } from "./constant/env.constant"

export const supabaseClient = createClient(
  ENV.SUPABASE_URL || '',
  ENV.SUPABASE_KEY || ''
)
