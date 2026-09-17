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

// 30 Sample BGMI Teams for Testing (4 players per squad = 120 total players)
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
  },
  {
    id: 'team-107',
    teamName: 'Team XSpark',
    leaderName: 'Tanmay Singh',
    leaderYear: '2nd',
    leaderPhone: '9432109876',
    leaderBgmiId: '5785432176',
    leaderIgn: 'XSPARK_Scout',
    members: [
      { name: 'Sarangajyoti Deka', bgmiId: '5785432177', ign: 'XSPARK_Sarang' },
      { name: 'Harsh Paudwal', bgmiId: '5785432178', ign: 'XSPARK_GOBBLIN' },
      { name: 'Tushar Choudhary', bgmiId: '5785432179', ign: 'XSPARK_Dreams' }
    ],
    registeredAt: '2026-09-16T16:00:00Z'
  },
  {
    id: 'team-108',
    teamName: 'Blind Esports',
    leaderName: 'Manpreet Singh',
    leaderYear: '1st',
    leaderPhone: '9321098765',
    leaderBgmiId: '5896543287',
    leaderIgn: 'BLIND_Manya',
    members: [
      { name: 'Mohammed Rameez', bgmiId: '5896543288', ign: 'BLIND_Joker' },
      { name: 'Nakul Sharma', bgmiId: '5896543289', ign: 'BLIND_Nakul' },
      { name: 'Shryansh Jain', bgmiId: '5896543290', ign: 'BLIND_Skipz' }
    ],
    registeredAt: '2026-09-16T17:30:00Z'
  },
  {
    id: 'team-109',
    teamName: 'Entity Gaming',
    leaderName: 'Saumraj Shrestha',
    leaderYear: '2nd',
    leaderPhone: '9210987654',
    leaderBgmiId: '5907654398',
    leaderIgn: 'ENTITY_Saumraj',
    members: [
      { name: 'Shubh Kumar', bgmiId: '5907654399', ign: 'ENTITY_Shubh' },
      { name: 'Praveen Gamer', bgmiId: '5907654400', ign: 'ENTITY_Praveen' },
      { name: 'Ronak Singh', bgmiId: '5907654401', ign: 'ENTITY_Ronak' }
    ],
    registeredAt: '2026-09-16T18:15:00Z'
  },
  {
    id: 'team-110',
    teamName: 'Team Tamilas',
    leaderName: 'Karthik Raja',
    leaderYear: '1st',
    leaderPhone: '9109876543',
    leaderBgmiId: '6018765409',
    leaderIgn: 'TT_MrClean',
    members: [
      { name: 'Vignesh Kumar', bgmiId: '6018765410', ign: 'TT_Vicky' },
      { name: 'Surya Narayanan', bgmiId: '6018765411', ign: 'TT_Surya' },
      { name: 'Balaji S', bgmiId: '6018765412', ign: 'TT_Bala' }
    ],
    registeredAt: '2026-09-16T19:00:00Z'
  },
  {
    id: 'team-111',
    teamName: 'Orangutan Esports',
    leaderName: 'Ashutosh Dutta',
    leaderYear: '2nd',
    leaderPhone: '9012345678',
    leaderBgmiId: '6129876510',
    leaderIgn: 'OG_Punkk',
    members: [
      { name: 'Akshat Goel', bgmiId: '6129876511', ign: 'OG_Akshat' },
      { name: 'Wizzy Roy', bgmiId: '6129876512', ign: 'OG_Wizzy' },
      { name: 'Akmal Khan', bgmiId: '6129876513', ign: 'OG_Akmal' }
    ],
    registeredAt: '2026-09-17T08:00:00Z'
  },
  {
    id: 'team-112',
    teamName: 'Revenant Esports',
    leaderName: 'Sensei Sharma',
    leaderYear: '1st',
    leaderPhone: '9123456780',
    leaderBgmiId: '6230987621',
    leaderIgn: 'RVT_Sensei',
    members: [
      { name: 'Fierce Rajput', bgmiId: '6230987622', ign: 'RVT_Fierce' },
      { name: 'Paradox Gaming', bgmiId: '6230987623', ign: 'RVT_Paradox' },
      { name: 'Apollo Singh', bgmiId: '6230987624', ign: 'RVT_Apollo' }
    ],
    registeredAt: '2026-09-17T09:30:00Z'
  },
  {
    id: 'team-113',
    teamName: 'Global Esports',
    leaderName: 'Mavi Chaudhary',
    leaderYear: '2nd',
    leaderPhone: '9234567891',
    leaderBgmiId: '6341098732',
    leaderIgn: 'GE_Mavi',
    members: [
      { name: 'Neyoo Vyas', bgmiId: '6341098733', ign: 'GE_Neyoo' },
      { name: 'Slugger Pro', bgmiId: '6341098734', ign: 'GE_Slugger' },
      { name: 'Darklord X', bgmiId: '6341098735', ign: 'GE_Darklord' }
    ],
    registeredAt: '2026-09-17T10:15:00Z'
  },
  {
    id: 'team-114',
    teamName: 'Velocity Gaming',
    leaderName: 'Aman Jain',
    leaderYear: '1st',
    leaderPhone: '9345678902',
    leaderBgmiId: '6452109843',
    leaderIgn: 'VLT_Aman',
    members: [
      { name: 'Chirag Agarwal', bgmiId: '6452109844', ign: 'VLT_Chirag' },
      { name: 'Viper Pro', bgmiId: '6452109845', ign: 'VLT_Viper' },
      { name: 'Rex Gaming', bgmiId: '6452109846', ign: 'VLT_Rex' }
    ],
    registeredAt: '2026-09-17T11:00:00Z'
  },
  {
    id: 'team-115',
    teamName: 'Medal Esports',
    leaderName: 'Kyoya Takanashi',
    leaderYear: '2nd',
    leaderPhone: '9456789013',
    leaderBgmiId: '6563210954',
    leaderIgn: 'MEDAL_Kyoya',
    members: [
      { name: 'Sayyam Jain', bgmiId: '6563210955', ign: 'MEDAL_Sayyam' },
      { name: 'Incognito X', bgmiId: '6563210956', ign: 'MEDAL_Incognito' },
      { name: 'Marky Gamer', bgmiId: '6563210957', ign: 'MEDAL_Marky' }
    ],
    registeredAt: '2026-09-17T11:45:00Z'
  },
  {
    id: 'team-116',
    teamName: 'Enigma Gaming',
    leaderName: 'Egger Patel',
    leaderYear: '1st',
    leaderPhone: '9567890124',
    leaderBgmiId: '6674321065',
    leaderIgn: 'EG_Egger',
    members: [
      { name: 'Rawknee Bro', bgmiId: '6674321066', ign: 'EG_Rawknee' },
      { name: 'ShadowX Legend', bgmiId: '6674321067', ign: 'EG_ShadowX' },
      { name: 'Maxy Gaming', bgmiId: '6674321068', ign: 'EG_Maxy' }
    ],
    registeredAt: '2026-09-17T12:30:00Z'
  },
  {
    id: 'team-117',
    teamName: 'Hydra Esports',
    leaderName: 'Dynamo Gamer',
    leaderYear: '2nd',
    leaderPhone: '9678901235',
    leaderBgmiId: '6785432176',
    leaderIgn: 'HYDRA_Dynamo',
    members: [
      { name: 'Alpha Clasher', bgmiId: '6785432177', ign: 'HYDRA_Alpha' },
      { name: 'Emperor King', bgmiId: '6785432178', ign: 'HYDRA_Emperor' },
      { name: 'Mafia Bear', bgmiId: '6785432179', ign: 'HYDRA_Mafia' }
    ],
    registeredAt: '2026-09-17T13:00:00Z'
  },
  {
    id: 'team-118',
    teamName: 'Nigma Galaxy',
    leaderName: 'Pucko Singh',
    leaderYear: '1st',
    leaderPhone: '9789012346',
    leaderBgmiId: '6896543287',
    leaderIgn: 'NG_Pucko',
    members: [
      { name: 'Blaze Fire', bgmiId: '6896543288', ign: 'NG_Blaze' },
      { name: 'Venom Sniper', bgmiId: '6896543289', ign: 'NG_Venom' },
      { name: 'Static Volt', bgmiId: '6896543290', ign: 'NG_Static' }
    ],
    registeredAt: '2026-09-17T13:30:00Z'
  },
  {
    id: 'team-119',
    teamName: 'Chemin Esports',
    leaderName: 'Justin Pro',
    leaderYear: '2nd',
    leaderPhone: '9890123457',
    leaderBgmiId: '6907654398',
    leaderIgn: 'CHEMIN_Justin',
    members: [
      { name: 'Destro King', bgmiId: '6907654399', ign: 'CHEMIN_Destro' },
      { name: 'Delta PG', bgmiId: '6907654400', ign: 'CHEMIN_Delta' },
      { name: '4Bit Gamer', bgmiId: '6907654401', ign: 'CHEMIN_4Bit' }
    ],
    registeredAt: '2026-09-17T14:00:00Z'
  },
  {
    id: 'team-120',
    teamName: 'Reckoning Esports',
    leaderName: 'Punkk Malhotra',
    leaderYear: '1st',
    leaderPhone: '9901234568',
    leaderBgmiId: '7018765409',
    leaderIgn: 'RCK_Punkk',
    members: [
      { name: 'Ninja Boy', bgmiId: '7018765410', ign: 'RCK_Ninja' },
      { name: 'Ares War', bgmiId: '7018765411', ign: 'RCK_Ares' },
      { name: 'Thor Thunder', bgmiId: '7018765412', ign: 'RCK_Thor' }
    ],
    registeredAt: '2026-09-17T14:30:00Z'
  },
  {
    id: 'team-121',
    teamName: 'Skylightz Gaming',
    leaderName: 'Gamlaa Pro',
    leaderYear: '2nd',
    leaderPhone: '9012345679',
    leaderBgmiId: '7129876510',
    leaderIgn: 'SG_Gamlaa',
    members: [
      { name: 'Pukar Singh', bgmiId: '7129876511', ign: 'SG_Pukar' },
      { name: 'Vanya Lady', bgmiId: '7129876512', ign: 'SG_Vanya' },
      { name: 'Kratos God', bgmiId: '7129876513', ign: 'SG_Kratos' }
    ],
    registeredAt: '2026-09-17T15:00:00Z'
  },
  {
    id: 'team-122',
    teamName: 'Gods Reign',
    leaderName: 'Simp Lord',
    leaderYear: '1st',
    leaderPhone: '9123456789',
    leaderBgmiId: '7230987621',
    leaderIgn: 'GR_Simp',
    members: [
      { name: 'Aquanox Water', bgmiId: '7230987622', ign: 'GR_Aquanox' },
      { name: 'Sticker Boy', bgmiId: '7230987623', ign: 'GR_Sticker' },
      { name: 'Robin Hood', bgmiId: '7230987624', ign: 'GR_Robin' }
    ],
    registeredAt: '2026-09-17T15:30:00Z'
  },
  {
    id: 'team-123',
    teamName: 'Cincinnati Esports',
    leaderName: 'Luffy Monkey',
    leaderYear: '2nd',
    leaderPhone: '9234567890',
    leaderBgmiId: '7341098732',
    leaderIgn: 'CIN_Luffy',
    members: [
      { name: 'Zoro Swordsman', bgmiId: '7341098733', ign: 'CIN_Zoro' },
      { name: 'Sanji Cook', bgmiId: '7341098734', ign: 'CIN_Sanji' },
      { name: 'Usopp Sniper', bgmiId: '7341098735', ign: 'CIN_Usopp' }
    ],
    registeredAt: '2026-09-17T16:00:00Z'
  },
  {
    id: 'team-124',
    teamName: 'Team MAYHEM',
    leaderName: 'ClutchGod Pro',
    leaderYear: '1st',
    leaderPhone: '9345678901',
    leaderBgmiId: '7452109843',
    leaderIgn: 'MAYHEM_Clutch',
    members: [
      { name: 'Zgod Gaming', bgmiId: '7452109844', ign: 'MAYHEM_Zgod' },
      { name: 'Ghatak Coach', bgmiId: '7452109845', ign: 'MAYHEM_Ghatak' },
      { name: 'JONATHAN Gaming', bgmiId: '7452109846', ign: 'MAYHEM_Jony' }
    ],
    registeredAt: '2026-09-17T16:30:00Z'
  },
  {
    id: 'team-125',
    teamName: '8Bit Esports',
    leaderName: 'Thug Animesh',
    leaderYear: '2nd',
    leaderPhone: '9456789012',
    leaderBgmiId: '7563210954',
    leaderIgn: '8BIT_Thug',
    members: [
      { name: 'Goldy Bhai', bgmiId: '7563210955', ign: '8BIT_Goldy' },
      { name: 'Mamba Venom', bgmiId: '7563210956', ign: '8BIT_Mamba' },
      { name: 'Rebel Bro', bgmiId: '7563210957', ign: '8BIT_Rebel' }
    ],
    registeredAt: '2026-09-17T17:00:00Z'
  },
  {
    id: 'team-126',
    teamName: 'Team Insane',
    leaderName: 'Skipz Sharma',
    leaderYear: '1st',
    leaderPhone: '9567890123',
    leaderBgmiId: '7674321065',
    leaderIgn: 'INSANE_Skipz',
    members: [
      { name: 'Darklord Pro', bgmiId: '7674321066', ign: 'INSANE_Darklord' },
      { name: 'Azooz Youtube', bgmiId: '7674321067', ign: 'INSANE_Azooz' },
      { name: 'Fierce Hunter', bgmiId: '7674321068', ign: 'INSANE_Fierce' }
    ],
    registeredAt: '2026-09-17T17:30:00Z'
  },
  {
    id: 'team-127',
    teamName: 'Gladiators Esports',
    leaderName: 'Delta PG',
    leaderYear: '2nd',
    leaderPhone: '9678901234',
    leaderBgmiId: '7785432176',
    leaderIgn: 'GLAD_Delta',
    members: [
      { name: 'Shogun Warrior', bgmiId: '7785432177', ign: 'GLAD_Shogun' },
      { name: 'Destro Champ', bgmiId: '7785432178', ign: 'GLAD_Destro' },
      { name: 'Justin WWCD', bgmiId: '7785432179', ign: 'GLAD_Justin' }
    ],
    registeredAt: '2026-09-17T18:00:00Z'
  },
  {
    id: 'team-128',
    teamName: 'Big Brother Esports',
    leaderName: 'Saumraj King',
    leaderYear: '1st',
    leaderPhone: '9789012345',
    leaderBgmiId: '7896543287',
    leaderIgn: 'BB_Saumraj',
    members: [
      { name: 'Uzair Khan', bgmiId: '7896543288', ign: 'BB_Uzair' },
      { name: 'Aman Gamer', bgmiId: '7896543289', ign: 'BB_Aman' },
      { name: 'Maxy Boy', bgmiId: '7896543290', ign: 'BB_Maxy' }
    ],
    registeredAt: '2026-09-17T18:15:00Z'
  },
  {
    id: 'team-129',
    teamName: 'Aerobotz Esports',
    leaderName: 'Aero Pilot',
    leaderYear: '2nd',
    leaderPhone: '9890123456',
    leaderBgmiId: '7907654398',
    leaderIgn: 'AERO_Pilot',
    members: [
      { name: 'Sky High', bgmiId: '7907654399', ign: 'AERO_Sky' },
      { name: 'Cloud Nine', bgmiId: '7907654400', ign: 'AERO_Cloud' },
      { name: 'Jet Engine', bgmiId: '7907654401', ign: 'AERO_Jet' }
    ],
    registeredAt: '2026-09-17T18:30:00Z'
  },
  {
    id: 'team-130',
    teamName: 'Team FS Esports',
    leaderName: 'Freeze Shot',
    leaderYear: '1st',
    leaderPhone: '9901234567',
    leaderBgmiId: '8018765409',
    leaderIgn: 'FS_Freeze',
    members: [
      { name: 'Cold Ice', bgmiId: '8018765410', ign: 'FS_Ice' },
      { name: 'Frost Bite', bgmiId: '8018765411', ign: 'FS_Frost' },
      { name: 'Blizzard Storm', bgmiId: '8018765412', ign: 'FS_Blizzard' }
    ],
    registeredAt: '2026-09-17T18:45:00Z'
  }
];

// Default attendance for all 30 teams
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
