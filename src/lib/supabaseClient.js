import { createClient } from '@supabase/supabase-js';

const ACTIVE_SUPABASE_URL = 'https://geezacpfyxlcadhluqpe.supabase.co';
const ACTIVE_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZXphY3BmeXhsY2FkaGx1cXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNDUyMjYsImV4cCI6MjEwOTgyMTIyNn0.04qkLCJlVrf6XAFqkM2nbiN5998xgqNiExLxH7hGPfY';

let configuredUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ACTIVE_SUPABASE_URL;

let configuredKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ACTIVE_SUPABASE_ANON_KEY;

// Safety check: If Vercel has the old paused project URL configured, override with the active project
if (configuredUrl.includes('dmxfrlalsteybezkstec') || !configuredUrl) {
  configuredUrl = ACTIVE_SUPABASE_URL;
  configuredKey = ACTIVE_SUPABASE_ANON_KEY;
}

export const isSupabaseConfigured = Boolean(configuredUrl && configuredKey);

export const supabase = isSupabaseConfigured
  ? createClient(configuredUrl, configuredKey)
  : null;
