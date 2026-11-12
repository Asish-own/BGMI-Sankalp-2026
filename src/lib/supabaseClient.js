import { createClient } from '@supabase/supabase-js';

const ACTIVE_SUPABASE_URL = 'https://znbzyslbvmeuheozuyht.supabase.co';
const ACTIVE_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYnp5c2xidm1ldWhlb3p1eWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0Nzk1NzYsImV4cCI6MjExMDA1NTU3Nn0.-NBxbBg5FFrUCaMg5vk2c4ueV4dGipkS08tCzKBrpmU';

let configuredUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ACTIVE_SUPABASE_URL;

let configuredKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ACTIVE_SUPABASE_ANON_KEY;

// Safety check: If Vercel has any older project URLs configured, override with the active project
if (
  configuredUrl.includes('dmxfrlalsteybezkstec') ||
  configuredUrl.includes('geezacpfyxlcadhluqpe') ||
  !configuredUrl
) {
  configuredUrl = ACTIVE_SUPABASE_URL;
  configuredKey = ACTIVE_SUPABASE_ANON_KEY;
}

export const isSupabaseConfigured = Boolean(configuredUrl && configuredKey);

export const supabase = isSupabaseConfigured
  ? createClient(configuredUrl, configuredKey)
  : null;
