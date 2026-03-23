import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qstnzppyludcztyjjiyx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdG56cHB5bHVkY3p0eWpqaXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjIzNjksImV4cCI6MjA4OTc5ODM2OX0.n5Ltlgaqw7zwozt7loCh5smZtDMILVRs3nmv075QHmU'

export const supabase = createClient(supabaseUrl, supabaseKey)
