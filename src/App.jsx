import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import EsportsLandingHero from './components/EsportsLandingHero';
import RegistrationForm from './components/RegistrationForm';
import TeamsOverview from './components/TeamsOverview';
import EventCountdown from './components/EventCountdown';
import ModeratorAttendance from './components/ModeratorAttendance';
import AdminMatchControl from './components/AdminMatchControl';
import PublicMatchView from './components/PublicMatchView';
import Leaderboard from './components/Leaderboard';
import LoginModal from './components/LoginModal';
import ModeratorManager from './components/ModeratorManager';
import PenaltyManager from './components/PenaltyManager';

import {
  loadStoredTeams,
  saveTeams,
  loadStoredAttendance,
  saveAttendance,
  loadStoredMatches,
  loadActiveMatch,
  loadStoredModerators,
  saveStoredModerators,
  loadStoredPenalties,
  savePenalties,
  saveMatchesAndActive,
  saveEventDate,
  fetchTeamsCloud,
  fetchAttendanceCloud,
  fetchMatchesCloud,
  fetchPenaltiesCloud,
  fetchModeratorsCloud,
  fetchEventDateCloud,
  subscribeToRealtimeSync,
  getDefaultEventDate,
  DEFAULT_PERMISSIONS
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [session, setSession] = useState({ role: 'user', username: 'Guest' });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [targetRoleForModal, setTargetRoleForModal] = useState('admin');

  const [teams, setTeams] = useState(loadStoredTeams);
  const [attendance, setAttendance] = useState(loadStoredAttendance);
  const [matches, setMatches] = useState(loadStoredMatches);
  const [activeMatch, setActiveMatch] = useState(loadActiveMatch);
  const [moderators, setModerators] = useState(loadStoredModerators);
  const [penalties, setPenalties] = useState(loadStoredPenalties);
  const [eventDateIso, setEventDateIso] = useState(getDefaultEventDate);

  const isUser = session.role === 'user';
  const isAdmin = session.role === 'admin';
  const perms = session.moderatorObj?.permissions || DEFAULT_PERMISSIONS;
  const canVerifyAttendance = isAdmin || (session.role === 'moderator' && perms.verifyTeams);

  // Universal Sync Loader from Supabase Cloud / Local
  const reloadUniversalData = useCallback(async () => {
    try {
      const [cloudTeams, cloudAttendance, cloudMatchesRes, cloudPenalties, cloudMods, cloudEventDate] = await Promise.all([
        fetchTeamsCloud(),
        fetchAttendanceCloud(),
        fetchMatchesCloud(),
        fetchPenaltiesCloud(),
        fetchModeratorsCloud(),
        fetchEventDateCloud()
      ]);

      if (cloudTeams) setTeams(cloudTeams);
      if (cloudAttendance) setAttendance(cloudAttendance);
      if (cloudMatchesRes) {
        setMatches(cloudMatchesRes.completedMatches || []);
        setActiveMatch(cloudMatchesRes.activeMatch || null);
      }
      if (cloudPenalties) setPenalties(cloudPenalties);
      if (cloudMods) setModerators(cloudMods);
      if (cloudEventDate) setEventDateIso(cloudEventDate);
    } catch (e) {
      console.warn('Data sync reload error:', e);
    }
  }, []);

  // Initial Data Load & Real-Time Universal Listener
  useEffect(() => {
    reloadUniversalData();

    const unsubscribe = subscribeToRealtimeSync((updatePayload) => {
      reloadUniversalData();
    });

    return () => {
      unsubscribe();
    };
  }, [reloadUniversalData]);

  // URL Query / Link-based Access Detector (?panel=admin or ?panel=moderator)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    const panel = params.get('panel') || params.get('role');

    if (panel === 'admin' || hash.includes('admin')) {
      setTargetRoleForModal('admin');
      setShowLoginModal(true);
    } else if (panel === 'moderator' || hash.includes('moderator')) {
      setTargetRoleForModal('moderator');
      setShowLoginModal(true);
    }
  }, []);

  // Handlers with Universal Cloud Sync
  const handleUpdateEventDate = async (newDateIso) => {
    setEventDateIso(newDateIso);
    await saveEventDate(newDateIso);
  };

  const handleUpdateModerators = async (updatedMods) => {
    setModerators(updatedMods);
    await saveStoredModerators(updatedMods);
  };

  const handleAddTeam = async (newTeam) => {
    const updated = [newTeam, ...teams];
    setTeams(updated);
    const updatedAttendance = { ...attendance, [newTeam.id]: true };
    setAttendance(updatedAttendance);
    
    await saveTeams(updated);
    await saveAttendance(updatedAttendance);
  };

  const handleUpdateTeam = async (updatedTeam) => {
    const updated = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    setTeams(updated);
    await saveTeams(updated);
  };

  const handleToggleAttendance = async (teamId) => {
    const updated = { ...attendance, [teamId]: !attendance[teamId] };
    setAttendance(updated);
    await saveAttendance(updated);
  };

  const handleMarkAllAttendance = async (status) => {
    const updated = {};
    teams.forEach(t => { updated[t.id] = status; });
    setAttendance(updated);
    await saveAttendance(updated);
  };

  const handleCreateMatch = async (matchData) => {
    setActiveMatch(matchData);
    if (matchData.status === 'PUBLISHED') {
      setActiveTab('public-match');
    } else {
      setActiveTab('admin');
    }
    await saveMatchesAndActive(matches, matchData);
  };

  const handleUpdateActiveMatch = async (updatedMatch) => {
    setActiveMatch(updatedMatch);
    await saveMatchesAndActive(matches, updatedMatch);
  };

  const handlePublishMatch = async () => {
    if (!activeMatch) return;
    const updated = { ...activeMatch, status: 'PUBLISHED' };
    setActiveMatch(updated);
    setActiveTab('public-match');
    await saveMatchesAndActive(matches, updated);
  };

  const handleStartMatch = async () => {
    if (!activeMatch) return;
    const updated = { ...activeMatch, status: 'LIVE' };
    setActiveMatch(updated);
    await saveMatchesAndActive(matches, updated);
  };

  const handleFinishMatch = async (results) => {
    if (!activeMatch) return;

    const completedMatchData = {
      ...activeMatch,
      status: 'FINISHED',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      results: results
    };

    const updatedMatches = [completedMatchData, ...matches];
    setMatches(updatedMatches);
    setActiveMatch(null);
    setActiveTab('leaderboard');
    await saveMatchesAndActive(updatedMatches, null);
  };

  const handleCancelMatch = async () => {
    setActiveMatch(null);
    await saveMatchesAndActive(matches, null);
  };

  const handleAddPenalty = async (penalty) => {
    const updated = [penalty, ...penalties];
    setPenalties(updated);
    await savePenalties(updated);
  };

  const handleDeletePenalty = async (penaltyId) => {
    const updated = penalties.filter(p => p.id !== penaltyId);
    setPenalties(updated);
    await savePenalties(updated);
  };

  const handleLoginSuccess = (sessionObj) => {
    setSession(sessionObj);
    if (sessionObj.role === 'admin') {
      setActiveTab('admin');
    } else if (sessionObj.role === 'moderator') {
      setActiveTab('event');
    } else {
      setActiveTab('leaderboard');
    }
  };

  const handleLogout = () => {
    setSession({ role: 'user', username: 'Guest' });
    setActiveTab('home');
    window.history.pushState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        teamsCount={teams.length}
        activeMatch={activeMatch}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <EsportsLandingHero
            onRegisterClick={() => setActiveTab('register')}
            onViewStandingsClick={() => setActiveTab('leaderboard')}
            activeMatch={activeMatch}
            teamsCount={teams.length}
          />
        )}

        {activeTab === 'register' && (
          <RegistrationForm
            onAddTeam={handleAddTeam}
            onViewTeams={() => setActiveTab('teams')}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsOverview
            session={session}
            teams={teams}
            onUpdateTeam={handleUpdateTeam}
            onNavigateToRegister={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'event' && (
          <div className="space-y-8">
            <EventCountdown
              eventDateIso={eventDateIso}
              onUpdateEventDate={handleUpdateEventDate}
            />

            {/* Attendance checklist rendered ONLY for Staff (Admin/Moderators with verifyTeams permission) */}
            {canVerifyAttendance ? (
              <ModeratorAttendance
                teams={teams}
                attendance={attendance}
                onToggleAttendance={handleToggleAttendance}
                onMarkAll={handleMarkAllAttendance}
              />
            ) : (
              <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center max-w-2xl mx-auto space-y-2">
                <div className="font-display font-bold text-white text-lg">📢 MATCH DAY ADVISORY</div>
                <p className="text-slate-400 text-xs">
                  All team leaders must be present in the esports lobby on match day. Room credentials and assigned slot numbers will be published in the <strong className="text-amber-400">Match Room</strong> tab when match lobbies open!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'public-match' && (
          <PublicMatchView
            activeMatch={activeMatch}
            onStartMatch={handleStartMatch}
          />
        )}

        {activeTab === 'admin' && (
          <AdminMatchControl
            session={session}
            teams={teams}
            attendance={attendance}
            activeMatch={activeMatch}
            completedMatches={matches}
            onCreateMatch={handleCreateMatch}
            onUpdateActiveMatch={handleUpdateActiveMatch}
            onPublishMatch={handlePublishMatch}
            onStartMatch={handleStartMatch}
            onFinishMatch={handleFinishMatch}
            onCancelMatch={handleCancelMatch}
          />
        )}

        {activeTab === 'moderator-mgmt' && session.role === 'admin' && (
          <ModeratorManager
            moderators={moderators}
            onUpdateModerators={handleUpdateModerators}
          />
        )}

        {activeTab === 'penalties' && (
          <PenaltyManager
            teams={teams}
            penalties={penalties}
            onAddPenalty={handleAddPenalty}
            onDeletePenalty={handleDeletePenalty}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            teams={teams}
            matches={matches}
            penalties={penalties}
            activeMatch={activeMatch}
          />
        )}
      </main>

      {/* Login Authentication Modal */}
      <LoginModal
        isOpen={showLoginModal}
        initialRole={targetRoleForModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
        moderators={moderators}
      />

      {/* Esports Footer */}
      <footer className="border-t border-slate-900 bg-[#04060a] py-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-white">BGMI <span className="text-emerald-400">CLUB</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official campus and club Battlegrounds Mobile India esports platform powering competitive survival leagues, automated slot management, and real-time tie-breaker standings.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-sm uppercase">Quick Links</h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-emerald-400">Home Landing</button></li>
              <li><button onClick={() => setActiveTab('register')} className="hover:text-emerald-400">Squad Registration</button></li>
              <li><button onClick={() => setActiveTab('teams')} className="hover:text-emerald-400">Registered Squads</button></li>
              <li><button onClick={() => setActiveTab('leaderboard')} className="hover:text-emerald-400">Official Standings</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-sm uppercase">Tournament Rules</h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>Kill = 2 Points</li>
              <li>1st Place (WWCD) = 6 Points</li>
              <li>2nd Place = 4 Points</li>
              <li>3rd Place = 2 Points</li>
              <li>4th & 5th Place = 1 Point</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase">Stay Updated</h4>
            <p className="text-xs text-slate-400">Subscribe for match room alerts & fixture schedules.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address..."
                className="w-full px-3 py-2 bg-[#0a0f18] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl uppercase">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© 2026 BGMI Club Esports Platform. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300">Fair Play Code</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
