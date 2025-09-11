// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'https://kmxcttxyqumolhuvvdrz.supabase.co'
// const supabaseKey =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteGN0dHh5cXVtb2xodXZ2ZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwOTM0MjUsImV4cCI6MjA1NDY2OTQyNX0.OqEqkhY4MOnv67qn4UcpMBtY2JQqdsMu5Z3cPCEmrGA"
// const supabase = createClient(supabaseUrl, supabaseKey)


import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://kmxcttxyqumolhuvvdrz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteGN0dHh5cXVtb2xodXZ2ZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwOTM0MjUsImV4cCI6MjA1NDY2OTQyNX0.OqEqkhY4MOnv67qn4UcpMBtY2JQqdsMu5Z3cPCEmrGA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase