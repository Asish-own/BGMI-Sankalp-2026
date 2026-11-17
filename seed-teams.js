import { SAMPLE_TEAMS, SAMPLE_ATTENDANCE } from './src/utils/sampleTeams.js';

const SUPABASE_URL = 'https://znbzyslbvmeuheozuyht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYnp5c2xidm1ldWhlb3p1eWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0Nzk1NzYsImV4cCI6MjExMDA1NTU3Nn0.-NBxbBg5FFrUCaMg5vk2c4ueV4dGipkS08tCzKBrpmU';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates'
};

async function seed() {
  console.log(`Starting seed of ${SAMPLE_TEAMS.length} sample teams (BGMI-001 through BGMI-030)...`);

  // Prepare teams payload
  // Include leaderStream in members or leader_stream if exists
  const teamsPayload = SAMPLE_TEAMS.map(t => ({
    id: t.id,
    team_name: t.teamName,
    leader_name: t.leaderName,
    leader_year: t.leaderYear,
    leader_phone: t.leaderPhone,
    leader_bgmi_id: t.leaderBgmiId,
    leader_ign: t.leaderIgn,
    members: (t.members || []).map(m => ({ ...m, stream: m.stream || t.leaderStream || '' })),
    registered_at: t.registeredAt
  }));

  // 1. Upsert Teams
  console.log('Upserting teams to Supabase...');
  const teamsRes = await fetch(`${SUPABASE_URL}/rest/v1/teams`, {
    method: 'POST',
    headers,
    body: JSON.stringify(teamsPayload)
  });

  if (teamsRes.ok) {
    console.log(`✅ Successfully seeded ${SAMPLE_TEAMS.length} teams into Supabase 'teams' table!`);
  } else {
    console.error(`❌ Failed to seed teams: ${teamsRes.status} ${teamsRes.statusText}`, await teamsRes.text());
  }

  // 2. Upsert Attendance
  console.log('Upserting attendance records to Supabase...');
  const attendancePayload = Object.entries(SAMPLE_ATTENDANCE).map(([teamId, isPresent]) => ({
    team_id: teamId,
    is_present: isPresent,
    updated_at: new Date().toISOString()
  }));

  const attRes = await fetch(`${SUPABASE_URL}/rest/v1/attendance`, {
    method: 'POST',
    headers,
    body: JSON.stringify(attendancePayload)
  });

  if (attRes.ok) {
    console.log(`✅ Successfully seeded ${attendancePayload.length} attendance records into Supabase 'attendance' table!`);
    const presentCount = attendancePayload.filter(a => a.is_present).length;
    const absentCount = attendancePayload.filter(a => !a.is_present).length;
    console.log(`   - ${presentCount} teams marked PRESENT (Slots 1-25 ready for custom room)`);
    console.log(`   - ${absentCount} teams marked ABSENT (BGMI-026 to BGMI-030 for testing)`);
  } else {
    console.error(`❌ Failed to seed attendance: ${attRes.status} ${attRes.statusText}`, await attRes.text());
  }

  // 3. Verification query
  console.log('\n--- Verifying from Supabase ---');
  const verifyTeams = await fetch(`${SUPABASE_URL}/rest/v1/teams?select=id,team_name,leader_name&order=id.asc`, { headers });
  if (verifyTeams.ok) {
    const list = await verifyTeams.json();
    console.log(`Supabase 'teams' count: ${list.length}`);
    console.log(`First team: ${list[0]?.id} - ${list[0]?.team_name}`);
    console.log(`Last team:  ${list[list.length - 1]?.id} - ${list[list.length - 1]?.team_name}`);
  }

  const verifyAtt = await fetch(`${SUPABASE_URL}/rest/v1/attendance?select=*`, { headers });
  if (verifyAtt.ok) {
    const attList = await verifyAtt.json();
    console.log(`Supabase 'attendance' count: ${attList.length}`);
  }
}

seed().catch(console.error);
