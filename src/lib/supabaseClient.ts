import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ludguqvdobqdvvcsrlnd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZGd1cXZkb2JxZHZ2Y3NybG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MzYyNzUsImV4cCI6MjA1OTMxMjI3NX0.Q_O2QJXxTwrVD9VRJMm8XYrc3CYrlZqejNvC29UH9pk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 