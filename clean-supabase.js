const SUPABASE_URL = 'https://geezacpfyxlcadhluqpe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZXphY3BmeXhsY2FkaGx1cXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNDUyMjYsImV4cCI6MjEwOTgyMTIyNn0.04qkLCJlVrf6XAFqkM2nbiN5998xgqNiExLxH7hGPfY';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
  'Content-Type': 'application/json'
};

async function main() {
  // Order matters for foreign keys: attendance and penalties reference teams(id)
  const tables = ['attendance', 'penalties', 'matches', 'moderators', 'settings', 'teams'];

  console.log('--- Checking & Clearing Tables in Supabase ---');

  for (const table of tables) {
    try {
      // 1. Check count
      const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
      if (!checkRes.ok) {
        console.log(`Table '${table}': failed to read (${checkRes.status})`);
        continue;
      }
      const existing = await checkRes.json();
      console.log(`Table '${table}': has ${existing.length} rows`);

      // 2. Delete rows if any
      if (existing.length > 0) {
        // In PostgREST, to delete all rows: DELETE /table?id=neq.dummy_nonexistent_value or similar filter
        // Or filter by primary key not equal to empty or using in query
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

