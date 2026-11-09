import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://geezacpfyxlcadhluqpe.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZXphY3BmeXhsY2FkaGx1cXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNDUyMjYsImV4cCI6MjEwOTgyMTIyNn0.04qkLCJlVrf6XAFqkM2nbiN5998xgqNiExLxH7hGPfY';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
