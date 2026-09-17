/**
 * LocalStorage & Universal Supabase Cloud Real-Time Database Sync System
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
  viewTeams: true,
  editTeams: true,
  verifyTeams: true,
  manageLobbies: true,
  matchSetup: true,
  startMatch: true,
  endMatch: true,
  viewScores: true,
  enterScores: true,
  editScores: true,
  deleteScores: true,
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

// 30 Sample BGMI Teams
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

export const DEFAULT_ATTENDANCE = DEFAULT_DEMO_TEAMS.reduce((acc, t) => {
  acc[t.id] = true;
  return acc;
}, {});

export const getDefaultEventDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
};

// Broadcast Channel for Multi-Tab Local Sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('bgmi_universal_sync')
  : null;

export function broadcastLocalChange(type) {
  if (syncChannel) {
    try { syncChannel.postMessage({ type, timestamp: Date.now() }); } catch (e) {}
  }
}

/* ========================================================
   UNIVERSAL CLOUD FETCH & SAVE ENGINE (SUPABASE + LOCAL)
   ======================================================== */

/**
 * Fetch Event Date universally
 */
export async function fetchEventDateCloud() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('key', 'event_date').single();
      if (!error && data && data.value) {
        localStorage.setItem(STORAGE_KEYS.EVENT_DATE, data.value);
        return data.value;
      }
    } catch (e) {}
  }
  return localStorage.getItem(STORAGE_KEYS.EVENT_DATE) || getDefaultEventDate();
}

/**
 * Save Event Date universally
 */
export async function saveEventDate(eventDateIso) {
  localStorage.setItem(STORAGE_KEYS.EVENT_DATE, eventDateIso);
  broadcastLocalChange('EVENT_DATE_UPDATED');

  if (isSupabaseConfigured) {
    try {
      await supabase.from('settings').upsert({
        key: 'event_date',
        value: eventDateIso,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
  }
}

/**
 * Fetch all teams from Supabase Cloud or LocalStorage
 */
export async function fetchTeamsCloud() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('teams').select('*').order('registered_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const formatted = data.map(t => ({
          id: t.id,
          teamName: t.team_name,
          leaderName: t.leader_name,
          leaderYear: t.leader_year,
          leaderPhone: t.leader_phone,
          leaderBgmiId: t.leader_bgmi_id,
          leaderIgn: t.leader_ign,
          members: t.members || [],
          registeredAt: t.registered_at
        }));
        localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(formatted));
        return formatted;
      }
    } catch (e) {
      console.warn('Supabase fetch error, using local data:', e);
    }
  }
  return loadStoredTeams();
}

/**
 * Save team universally to Supabase & Local
 */
export async function saveTeams(teams) {
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  broadcastLocalChange('TEAMS_UPDATED');

  if (isSupabaseConfigured) {
    try {
      const dbPayload = teams.map(t => ({
        id: t.id,
        team_name: t.teamName,
        leader_name: t.leaderName,
        leader_year: t.leaderYear,
        leader_phone: t.leaderPhone,
        leader_bgmi_id: t.leaderBgmiId,
        leader_ign: t.leaderIgn,
        members: t.members || [],
        registered_at: t.registeredAt || new Date().toISOString()
      }));
      await supabase.from('teams').upsert(dbPayload);
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
  }
}

/**
 * Fetch Attendance universally
 */
export async function fetchAttendanceCloud() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('attendance').select('*');
      if (!error && data && data.length > 0) {
        const attObj = {};
        data.forEach(item => {
          attObj[item.team_id] = item.is_present;
        });
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attObj));
        return attObj;
      }
    } catch (e) {}
  }
  return loadStoredAttendance();
}

/**
 * Save Attendance universally
 */
export async function saveAttendance(attendance) {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  broadcastLocalChange('ATTENDANCE_UPDATED');

  if (isSupabaseConfigured) {
    try {
      const rows = Object.entries(attendance).map(([teamId, isPresent]) => ({
        team_id: teamId,
        is_present: isPresent,
        updated_at: new Date().toISOString()
      }));
      await supabase.from('attendance').upsert(rows);
    } catch (e) {}
  }
}

/**
 * Fetch Matches universally
 */
export async function fetchMatchesCloud() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const formatted = data.map(m => ({
          id: m.id,
          name: m.name,
          map: m.map,
          roomId: m.room_id,
          roomPassword: m.room_password,
          isFinalRound: m.is_final_round,
          status: m.status,
          isCompleted: m.is_completed,
          participatingTeams: m.participating_teams || [],
          results: m.results || [],
          createdAt: m.created_at,
          completedAt: m.completed_at
        }));

        const active = formatted.find(m => !m.isCompleted && m.status !== 'FINISHED') || null;
        saveActiveMatch(active);

        const completed = formatted.filter(m => m.isCompleted);
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(completed));
        return { completedMatches: completed, activeMatch: active };
      }
    } catch (e) {}
  }
  return { completedMatches: loadStoredMatches(), activeMatch: loadActiveMatch() };
}

/**
 * Save Matches & Active Match universally
 */
export async function saveMatchesAndActive(matches, activeMatch) {
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  saveActiveMatch(activeMatch);
  broadcastLocalChange('MATCHES_UPDATED');

  if (isSupabaseConfigured) {
    try {
      const allMatches = activeMatch ? [activeMatch, ...matches] : matches;
      const dbPayload = allMatches.map(m => ({
        id: m.id,
        name: m.name,
        map: m.map,
        room_id: m.roomId,
        room_password: m.roomPassword,
        is_final_round: m.isFinalRound,
        status: m.status,
        is_completed: Boolean(m.isCompleted),
        participating_teams: m.participatingTeams || [],
        results: m.results || [],
        created_at: m.createdAt || new Date().toISOString(),
        completed_at: m.completedAt || null
      }));
      await supabase.from('matches').upsert(dbPayload);
    } catch (e) {}
  }
}

/**
 * Fetch Penalties universally
 */
export async function fetchPenaltiesCloud() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('penalties').select('*').order('logged_at', { ascending: false });
      if (!error && data) {
        const formatted = data.map(p => ({
          id: p.id,
          teamId: p.team_id,
          teamName: p.team_name,
          violationType: p.violation_type,
          deductionPoints: p.deduction_points,
          isDisqualified: p.is_disqualified,
          notes: p.notes,
          loggedAt: p.logged_at
        }));
        localStorage.setItem(STORAGE_KEYS.PENALTIES, JSON.stringify(formatted));
        return formatted;
      }
    } catch (e) {}
  }
  return loadStoredPenalties();
}

/**
 * Save Penalties universally
 */
export async function savePenalties(penalties) {
  localStorage.setItem(STORAGE_KEYS.PENALTIES, JSON.stringify(penalties));
  broadcastLocalChange('PENALTIES_UPDATED');

  if (isSupabaseConfigured) {
    try {
      const dbPayload = penalties.map(p => ({
        id: p.id,
        team_id: p.teamId,
        team_name: p.teamName,
        violation_type: p.violationType,
        deduction_points: p.deductionPoints,
        is_disqualified: p.isDisqualified,
        notes: p.notes,
        logged_at: p.loggedAt || new Date().toISOString()
      }));
      await supabase.from('penalties').upsert(dbPayload);
    } catch (e) {}
  }
}

/**
 * Fetch Moderators universally
 */
export async function fetchModeratorsCloud() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('moderators').select('*');
      if (!error && data && data.length > 0) {
        const formatted = data.map(m => ({
          id: m.id,
          username: m.username,
          password: m.password,
          name: m.name,
          permissions: { ...DEFAULT_PERMISSIONS, ...(m.permissions || {}) }
        }));
        localStorage.setItem(STORAGE_KEYS.MODERATORS, JSON.stringify(formatted));
        return formatted;
      }
    } catch (e) {}
  }
  return loadStoredModerators();
}

/**
 * Save Moderators universally
 */
export async function saveStoredModerators(moderators) {
  localStorage.setItem(STORAGE_KEYS.MODERATORS, JSON.stringify(moderators));
  broadcastLocalChange('MODERATORS_UPDATED');

  if (isSupabaseConfigured) {
    try {
      const dbPayload = moderators.map(m => ({
        id: m.id,
        username: m.username,
        password: m.password,
        name: m.name,
        permissions: m.permissions || DEFAULT_PERMISSIONS,
        created_at: new Date().toISOString()
      }));
      await supabase.from('moderators').upsert(dbPayload);
    } catch (e) {}
  }
}

/* ========================================================
   LOCAL STORAGE READ HELPERS
   ======================================================== */

export function loadStoredTeams() {
  const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(DEFAULT_DEMO_TEAMS));
    return DEFAULT_DEMO_TEAMS;
  }
  try { return JSON.parse(data); } catch (e) { return DEFAULT_DEMO_TEAMS; }
}

export function loadStoredAttendance() {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
    return DEFAULT_ATTENDANCE;
  }
  try { return JSON.parse(data); } catch (e) { return DEFAULT_ATTENDANCE; }
}

export function loadStoredMatches() {
  const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
  if (!data) return [];
  try { return JSON.parse(data); } catch (e) { return []; }
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
  } catch (e) { return DEFAULT_MODERATORS; }
}

export function loadStoredPenalties() {
  const data = localStorage.getItem(STORAGE_KEYS.PENALTIES);
  if (!data) return [];
  try { return JSON.parse(data); } catch (e) { return []; }
}

/* ========================================================
   SUPABASE REALTIME SUBSCRIPTION FOR UNIVERSAL SYNC
   ======================================================== */

export function subscribeToRealtimeSync(onUniversalUpdate) {
  let supabaseChannel = null;

  if (isSupabaseConfigured) {
    try {
      supabaseChannel = supabase
        .channel('bgmi_realtime_broadcast')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
          onUniversalUpdate(payload);
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription error:', e);
    }
  }

  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      onUniversalUpdate(event.data);
    };
  }

  return () => {
    if (supabaseChannel) {
      try { supabase.removeChannel(supabaseChannel); } catch (e) {}
    }
  };
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
