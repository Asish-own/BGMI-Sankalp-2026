import fs from 'fs';

let url = "https://znbzyslbvmeuheozuyht.supabase.co";
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYnp5c2xidm1ldWhlb3p1eWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0Nzk1NzYsImV4cCI6MjExMDA1NTU3Nn0.-NBxbBg5FFrUCaMg5vk2c4ueV4dGipkS08tCzKBrpmU";

async function checkDatabase() {
  console.log("--------------------------------------------------");
  console.log("Checking Supabase connection to:", url);
  console.log("--------------------------------------------------");

  const tables = ['teams', 'attendance', 'matches', 'moderators', 'penalties', 'settings'];
  let connectionSuccess = true;
  let allTablesExist = true;

  for (const table of tables) {
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Table '${table}': READY (found ${data.length} sample row(s))`);
      } else {
        allTablesExist = false;
        const err = await res.text();
        console.log(`⚠️ Table '${table}' returned HTTP ${res.status}: ${err}`);
      }
    } catch (err) {
      connectionSuccess = false;
      console.error(`❌ Network error reaching table '${table}':`, err.message);
      return;
    }
  }

  console.log("--------------------------------------------------");
  if (allTablesExist) {
    console.log("🎉 ALL TABLES VERIFIED! New database is fully connected and ready.");
  } else {
    console.log("👉 ACTION REQUIRED: Tables do not exist yet in this new Supabase project.");
    console.log("You must execute supabase_schema.sql in your Supabase SQL Editor!");
  }
  console.log("--------------------------------------------------");
}

checkDatabase();
