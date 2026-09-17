/**
 * LocalStorage Sync & Supabase Hybrid Cloud Database Integration
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const STORAGE_KEYS = {
  TEAMS: 'bgmi_tournament_teams',
  ATTENDANCE: 'bgmi_tournament_attendance',
  MATCHES: 'bgmi_tournament_matches',
  ACTIVE_MATCH: 'bgmi_tournament_active_match',
  EVENT_DATE: 'bgmi_tournament_event_date',
  SESSION: 'bgmi_tournament_session',
  MODERATORS: 'bgmi_tournament_moderators',
  PENALTIES: 'bgmi_tournament_penalties'
};

// Default Credentials
export const PASSWORDS = {
  ADMIN: 'bgmi-admin',
  MODERATOR: 'bgmi-moderator',
  USER: 'bgmi'
};

// Full Granular Permissions Structure
export const DEFAULT_PERMISSIONS = {
  // TEAM MANAGEMENT
  viewTeams: true,
  editTeams: true,
  verifyTeams: true,

  // MATCH MANAGEMENT
  manageLobbies: true,
  matchSetup: true,
  startMatch: true,
  endMatch: true,

  // SCORING
  viewScores: true,
  enterScores: true,
  editScores: true,
  deleteScores: true,

  // TOURNAMENT CONTROL
  disqualifyTeams: true
};

// Default Moderator Accounts
export const DEFAULT_MODERATORS = [
  {
    id: 'mod-1',
    username: 'moderator1',
    password: 'bgmi-moderator',
    name: 'Official Tournament Moderator',
    permissions: { ...DEFAULT_PERMISSIONS }
  }
];

// Initial Demo Teams
export const DEFAULT_DEMO_TEAMS = [
  {
    id: 'team-101',
    teamName: 'Apex Predators',
    leaderName: 'Aarav Sharma',
    leaderYear: '1st',
    leaderPhone: '9876543210',
    leaderBgmiId: '5124893012',
    leaderIgn: 'APEX_Aarav',
    members: [
      { name: 'Rohan Gupta', bgmiId: '5124893013', ign: 'APEX_Rohan' },
      { name: 'Karan Patel', bgmiId: '5124893014', ign: 'APEX_Karan' },
      { name: 'Vikram Singh', bgmiId: '5124893015', ign: 'APEX_Vicky' }
    ],
    registeredAt: '2026-09-15T10:30:00Z'
  },
  {
    id: 'team-102',
    teamName: 'Soul Destroyers',
    leaderName: 'Devansh Verma',
    leaderYear: '2nd',
    leaderPhone: '9812345678',
    leaderBgmiId: '5239847101',
    leaderIgn: 'SOUL_Dev',
    members: [
      { name: 'Arjun Mehta', bgmiId: '5239847102', ign: 'SOUL_Arjun' },
      { name: 'Sameer Joshi', bgmiId: '5239847103', ign: 'SOUL_Sam' },
      { name: 'Nikhil Roy', bgmiId: '5239847104', ign: 'SOUL_Nik' }
    ],
    registeredAt: '2026-09-15T11:15:00Z'
  },
  {
    id: 'team-103',
    teamName: 'GodLike Titans',
    leaderName: 'Kabir Kapoor',
    leaderYear: '2nd',
    leaderPhone: '9988776655',
    leaderBgmiId: '5341209876',
    leaderIgn: 'GOD_Kabir',
    members: [
      { name: 'Pranav Reddy', bgmiId: '5341209877', ign: 'GOD_Pranav' },
      { name: 'Aditya Nair', bgmiId: '5341209878', ign: 'GOD_Adi' },
      { name: 'Harsh Vardhan', bgmiId: '5341209879', ign: 'GOD_Harsh' }
    ],
    registeredAt: '2026-09-15T14:20:00Z'
  },
  {
    id: 'team-104',
    teamName: 'Cyber Strikers',
    leaderName: 'Ananya Deshmukh',
    leaderYear: '1st',
    leaderPhone: '9765432109',
    leaderBgmiId: '5452109843',
    leaderIgn: 'CYBER_Ana',
    members: [
      { name: 'Priya Sharma', bgmiId: '5452109844', ign: 'CYBER_Priya' },
      { name: 'Sneha Rao', bgmiId: '5452109845', ign: 'CYBER_Sneha' },
      { name: 'Meera Iyer', bgmiId: '5452109846', ign: 'CYBER_Meera' }
    ],
    registeredAt: '2026-09-16T09:00:00Z'
  },
  {
    id: 'team-105',
    teamName: 'Shadow Esports',
    leaderName: 'Siddharth Saxena',
    leaderYear: '2nd',
    leaderPhone: '9654321098',
    leaderBgmiId: '5563210954',
    leaderIgn: 'SHADOW_Sid',
    members: [
      { name: 'Varun Sen', bgmiId: '5563210955', ign: 'SHADOW_Varun' },
      { name: 'Manish Kumar', bgmiId: '5563210956', ign: 'SHADOW_Mani' },
      { name: 'Yash Agarwal', bgmiId: '5563210957', ign: 'SHADOW_Yash' }
    ],
    registeredAt: '2026-09-16T12:45:00Z'
  },
  {
    id: 'team-106',
    teamName: 'Inferno Elites',
    leaderName: 'Ishaan Malhotra',
    leaderYear: '1st',
    leaderPhone: '9543210987',
    leaderBgmiId: '5674321065',
    leaderIgn: 'INF_Ishaan',
    members: [
      { name: 'Tushar Bhatt', bgmiId: '5674321066', ign: 'INF_Tushar' },
      { name: 'Chirag Sethi', bgmiId: '5674321067', ign: 'INF_Chirag' },
      { name: 'Aman Dubey', bgmiId: '5674321068', ign: 'INF_Aman' }
    ],
    registeredAt: '2026-09-16T15:10:00Z'
  }
];

export const DEFAULT_ATTENDANCE = {
  'team-101': true,
  'team-102': true,
  'team-103': true,
  'team-104': true,
  'team-105': true,
  'team-106': false
};

export const getDefaultEventDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
};

/* --- TEAMS CLOUD / LOCAL SYNC --- */
export function loadStoredTeams() {
  const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(DEFAULT_DEMO_TEAMS));
    return DEFAULT_DEMO_TEAMS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_DEMO_TEAMS;
  }
}

export function saveTeams(teams) {
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  if (isSupabaseConfigured) {
    // Async background sync with Supabase
    teams.forEach(t => {
      supabase.from('teams').upsert({
        id: t.id,
        team_name: t.teamName,
        leader_name: t.leaderName,
        leader_year: t.leaderYear,
        leader_phone: t.leaderPhone,
        leader_bgmi_id: t.leaderBgmiId,
        leader_ign: t.leaderIgn,
        members: t.members,
        registered_at: t.registeredAt || new Date().toISOString()
      }).then();
    });
  }
}

/* --- ATTENDANCE SYNC --- */
export function loadStoredAttendance() {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
    return DEFAULT_ATTENDANCE;
  }
  try { return JSON.parse(data); } catch (e) { return DEFAULT_ATTENDANCE; }
}

export function saveAttendance(attendance) {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
}

/* --- MATCHES SYNC --- */
export function loadStoredMatches() {
  const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
  if (!data) return [];
  try { return JSON.parse(data); } catch (e) { return []; }
}

export function saveMatches(matches) {
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  if (isSupabaseConfigured) {
    matches.forEach(m => {
      supabase.from('matches').upsert({
        id: m.id,
        name: m.name,
        map: m.map,
        room_id: m.roomId,
        room_password: m.roomPassword,
        is_final_round: m.isFinalRound,
        status: m.status,
        is_completed: m.isCompleted,
        participating_teams: m.participatingTeams,
        results: m.results,
        created_at: m.createdAt,
        completed_at: m.completedAt
      }).then();
    });
  }
}

export function loadActiveMatch() {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_MATCH);
  if (!data) return null;
  try { return JSON.parse(data); } catch (e) { return null; }
}

export function saveActiveMatch(match) {
  if (!match) {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_MATCH);
  } else {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MATCH, JSON.stringify(match));
  }
}

/* --- MODERATORS SYNC --- */
export function loadStoredModerators() {
  const data = localStorage.getItem(STORAGE_KEYS.MODERATORS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.MODERATORS, JSON.stringify(DEFAULT_MODERATORS));
    return DEFAULT_MODERATORS;
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.map(m => ({
      ...m,
      permissions: { ...DEFAULT_PERMISSIONS, ...m.permissions }
    }));
  } catch (e) {
    return DEFAULT_MODERATORS;
  }
}

export function saveStoredModerators(moderators) {
  localStorage.setItem(STORAGE_KEYS.MODERATORS, JSON.stringify(moderators));
}

/* --- PENALTIES SYNC --- */
export function loadStoredPenalties() {
  const data = localStorage.getItem(STORAGE_KEYS.PENALTIES);
  if (!data) return [];
  try { return JSON.parse(data); } catch (e) { return []; }
}

export function saveStoredPenalties(penalties) {
  localStorage.setItem(STORAGE_KEYS.PENALTIES, JSON.stringify(penalties));
}

export function resetDemoData() {
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(DEFAULT_DEMO_TEAMS));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
  localStorage.setItem(STORAGE_KEYS.MODERATORS, JSON.stringify(DEFAULT_MODERATORS));
  localStorage.removeItem(STORAGE_KEYS.MATCHES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_MATCH);
  localStorage.removeItem(STORAGE_KEYS.PENALTIES);
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ role: 'user', username: 'Guest' }));
  window.location.reload();
}
