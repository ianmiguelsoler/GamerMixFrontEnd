import { createClient } from "@supabase/supabase-js";

const supabaseConexion = createClient(
  "https://spdgjlhzfwmpefkuxugl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZGdqbGh6ZndtcGVma3V4dWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MzUzNjgsImV4cCI6MjA1MjAxMTM2OH0.ycGnVnDumAPWtuVvezHO8JqUbOiqPyYtMieQsL_TDe8"
); 

export { supabaseConexion };
