-- ========================================================
-- BGMI SURVIVAL ESPORTS PLATFORM - SUPABASE DATABASE SCHEMA
-- Execute this entire SQL script in your Supabase SQL Editor
-- ========================================================

-- 1. TEAMS TABLE (Registered Squads & 4-Player Rosters)
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  team_name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_year TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  leader_bgmi_id TEXT NOT NULL,
  leader_ign TEXT,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ATTENDANCE TABLE (Event Day Verified Teams)
CREATE TABLE IF NOT EXISTS attendance (
  team_id TEXT PRIMARY KEY REFERENCES teams(id) ON DELETE CASCADE,
  is_present BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MATCHES TABLE (Rooms, Slot Numbers, Standings, & Scoring)
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  map TEXT NOT NULL,
  room_id TEXT NOT NULL,
  room_password TEXT NOT NULL,
  is_final_round BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, LIVE, FINISHED
  is_completed BOOLEAN DEFAULT false,
  participating_teams JSONB NOT NULL DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 4. MODERATORS TABLE (Admin Managed Credentials & Powers)
CREATE TABLE IF NOT EXISTS moderators (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PENALTIES TABLE (Illegal Move Logs & Point Deductions)
CREATE TABLE IF NOT EXISTS penalties (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  deduction_points INT DEFAULT 0,
  is_disqualified BOOLEAN DEFAULT false,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SETTINGS TABLE (Event Date, Countdown, Global Config)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Grant Public Access for Tournament Platform
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderators ENABLE ROW LEVEL SECURITY;
ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow Public Read and Write Access (for universal synchronization)
DROP POLICY IF EXISTS "Allow public full access on teams" ON teams;
DROP POLICY IF EXISTS "Allow public full access on attendance" ON attendance;
DROP POLICY IF EXISTS "Allow public full access on matches" ON matches;
DROP POLICY IF EXISTS "Allow public full access on moderators" ON moderators;
DROP POLICY IF EXISTS "Allow public full access on penalties" ON penalties;
DROP POLICY IF EXISTS "Allow public full access on settings" ON settings;

CREATE POLICY "Allow public full access on teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access on attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access on matches" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access on moderators" ON moderators FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access on penalties" ON penalties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access on settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Enable Supabase Realtime Engine for Universal Cross-User Sync
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE teams, attendance, matches, moderators, penalties, settings;
COMMIT;
