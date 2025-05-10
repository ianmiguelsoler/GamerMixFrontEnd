import { createClient } from "@supabase/supabase-js";

const supabaseConexion = createClient(
  "https://qzrkjngofmilloizeedz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cmtqbmdvZm1pbGxvaXplZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjc3ODUsImV4cCI6MjA2MjMwMzc4NX0.96azUtohGNhm_PUjmCn4nvBmdrk0zfQ4QLDCWcWYaLY"
); 

export { supabaseConexion };
