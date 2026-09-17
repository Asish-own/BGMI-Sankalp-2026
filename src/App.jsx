import React, { useState, useEffect } from 'react';
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
  saveMatches,
  loadActiveMatch,
  saveActiveMatch,
  loadStoredModerators,
  saveStoredModerators,
  loadStoredPenalties,
  saveStoredPenalties,
  STORAGE_KEYS,
  getDefaultEventDate
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // Starts on the stunning Esports Landing Hero page
  const [session, setSession] = useState({ role: 'user', username: 'Guest' });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [targetRoleForModal, setTargetRoleForModal] = useState('admin');

  const [teams, setTeams] = useState(loadStoredTeams);
  const [attendance, setAttendance] = useState(loadStoredAttendance);
  const [matches, setMatches] = useState(loadStoredMatches);
  const [activeMatch, setActiveMatch] = useState(loadActiveMatch);
  const [moderators, setModerators] = useState(loadStoredModerators);
  const [penalties, setPenalties] = useState(loadStoredPenalties);

  const [eventDateIso, setEventDateIso] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.EVENT_DATE) || getDefaultEventDate();
  });

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

  // Sync state to localStorage
  useEffect(() => { saveTeams(teams); }, [teams]);
  useEffect(() => { saveAttendance(attendance); }, [attendance]);
  useEffect(() => { saveMatches(matches); }, [matches]);
  useEffect(() => { saveActiveMatch(activeMatch); }, [activeMatch]);
  useEffect(() => { saveStoredModerators(moderators); }, [moderators]);
  useEffect(() => { saveStoredPenalties(penalties); }, [penalties]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EVENT_DATE, eventDateIso); }, [eventDateIso]);

  // Handlers
  const handleAddTeam = (newTeam) => {
    const updated = [newTeam, ...teams];
    setTeams(updated);
    setAttendance(prev => ({ ...prev, [newTeam.id]: true }));
  };

  const handleUpdateTeam = (updatedTeam) => {
    setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  };

  const handleToggleAttendance = (teamId) => {
    setAttendance(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const handleMarkAllAttendance = (status) => {
    const updated = {};
    teams.forEach(t => {
      updated[t.id] = status;
    });
    setAttendance(updated);
  };

  const handleCreateMatch = (matchData) => {
    setActiveMatch(matchData);
    setActiveTab('admin');
  };

  const handlePublishMatch = () => {
    if (!activeMatch) return;
    const updated = { ...activeMatch, status: 'PUBLISHED' };
    setActiveMatch(updated);
    setActiveTab('public-match');
  };

  const handleStartMatch = () => {
    if (!activeMatch) return;
    const updated = { ...activeMatch, status: 'LIVE' };
    setActiveMatch(updated);
  };

  const handleFinishMatch = (results) => {
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
  };

  const handleCancelMatch = () => {
    setActiveMatch(null);
  };

  const handleAddPenalty = (penalty) => {
    setPenalties([penalty, ...penalties]);
  };

  const handleDeletePenalty = (penaltyId) => {
    setPenalties(penalties.filter(p => p.id !== penaltyId));
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
              onUpdateEventDate={setEventDateIso}
            />
            <ModeratorAttendance
              teams={teams}
              attendance={attendance}
              onToggleAttendance={handleToggleAttendance}
              onMarkAll={handleMarkAllAttendance}
            />
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
            onPublishMatch={handlePublishMatch}
            onStartMatch={handleStartMatch}
            onFinishMatch={handleFinishMatch}
            onCancelMatch={handleCancelMatch}
          />
        )}

        {activeTab === 'moderator-mgmt' && session.role === 'admin' && (
          <ModeratorManager
            moderators={moderators}
            onUpdateModerators={setModerators}
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

      {/* Esports Footer matching reference design */}
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
