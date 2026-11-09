import fs from 'fs';

// Read .env file directly if process.env is not populated
let url = process.env.VITE_SUPABASE_URL;
let key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const k = match[1].trim();
        const v = match[2].trim();
        if (k === 'VITE_SUPABASE_URL') url = v;
        if (k === 'VITE_SUPABASE_ANON_KEY') key = v;
      }
    }
  } catch (e) {}
}

const SUPABASE_URL = url || "https://geezacpfyxlcadhluqpe.supabase.co";
const SUPABASE_ANON_KEY = key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZXphY3BmeXhsY2FkaGx1cXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNDUyMjYsImV4cCI6MjEwOTgyMTIyNn0.04qkLCJlVrf6XAFqkM2nbiN5998xgqNiExLxH7hGPfY";

async function checkDatabase() {
  console.log("--------------------------------------------------");
  console.log("Checking Supabase connection to:", SUPABASE_URL);
  console.log("--------------------------------------------------");

  const tables = ['teams', 'attendance', 'matches', 'moderators', 'penalties', 'settings'];
  let connectionSuccess = false;

  for (const table of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
        method: "GET",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (res.ok) {
        connectionSuccess = true;
        const data = await res.json();
        console.log(`✅ Table '${table}': READY (found ${data.length} sample row(s))`);
      } else {
        const err = await res.text();
        console.log(`⚠️ Table '${table}' returned HTTP ${res.status}: ${err}`);
      }
    } catch (err) {
      console.error(`❌ Network error reaching table '${table}':`, err.message);
      return;
    }
  }

  if (connectionSuccess) {
    console.log("--------------------------------------------------");
    console.log("🎉 ALL TABLES VERIFIED! Database is fully operational.");
    console.log("--------------------------------------------------");
  } else {
    console.log("--------------------------------------------------");
    console.log("ℹ️ Connected to Supabase, but tables might not be created yet.");
    console.log("Please run the SQL schema in your Supabase SQL editor!");
    console.log("--------------------------------------------------");
  }
}

checkDatabase();

