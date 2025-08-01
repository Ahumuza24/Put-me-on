
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ynqonbnmiwdzgoucqqtt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucW9uYm5taXdkemdvdWNxcXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzQ2MTIsImV4cCI6MjA2OTM1MDYxMn0.fBElPUkJPi3qBo8aIr2NgeI4H7pFnyrarR0t17xFwWw'

export const supabase = createClient(supabaseUrl, supabaseKey)
;