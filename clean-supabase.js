const SUPABASE_URL = 'https://znbzyslbvmeuheozuyht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYnp5c2xidm1ldWhlb3p1eWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0Nzk1NzYsImV4cCI6MjExMDA1NTU3Nn0.-NBxbBg5FFrUCaMg5vk2c4ueV4dGipkS08tCzKBrpmU';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
  'Content-Type': 'application/json'
};

async function main() {
  const tables = ['attendance', 'penalties', 'matches', 'moderators', 'settings', 'teams'];

  console.log('--- Checking & Clearing Tables in Supabase ---');

  for (const table of tables) {
    try {
      const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
      if (!checkRes.ok) {
        console.log(`Table '${table}': failed to read (${checkRes.status})`);
        continue;
      }
      const existing = await checkRes.json();
      console.log(`Table '${table}': has ${existing.length} rows`);

      if (existing.length > 0) {
        const idField = table === 'attendance' ? 'team_id' : (table === 'settings' ? 'key' : 'id');
        const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${idField}=neq._non_existent_key_9999_`, {
          method: 'DELETE',
          headers
        });
        console.log(`Deleted rows from '${table}': status ${deleteRes.status} ${deleteRes.statusText}`);
      }
    } catch (err) {
      console.error(`Error processing table '${table}':`, err.message);
    }
  }

  console.log('--- Verification After Wipe ---');
  for (const table of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
    if (res.ok) {
      const remaining = await res.json();
      console.log(`Table '${table}': ${remaining.length} rows remaining.`);
    }
  }
}

main();
