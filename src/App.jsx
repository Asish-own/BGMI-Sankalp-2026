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
import AboutEventOrganizer from './components/AboutEventOrganizer';
import { ExternalLink, MapPin, Mail, Sparkles, Shield, Trophy } from 'lucide-react';

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
  fetchEventVenueCloud,
  saveEventVenue,
  DEFAULT_VENUE,
  STORAGE_KEYS,
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
import { isVideoInMemory } from './utils/videoCache';

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
  const [eventVenue, setEventVenue] = useState(() => localStorage.getItem(STORAGE_KEYS.EVENT_VENUE) || DEFAULT_VENUE);
  const [isSiteReady, setIsSiteReady] = useState(() => isVideoInMemory());

  const isUser = session.role === 'user';
  const isAdmin = session.role === 'admin';
  const perms = session.moderatorObj?.permissions || DEFAULT_PERMISSIONS;
  const canVerifyAttendance = isAdmin || (session.role === 'moderator' && perms.verifyTeams);

  // Universal Sync Loader from Supabase Cloud / Local
  const reloadUniversalData = useCallback(async () => {
    try {
      const [cloudTeams, cloudAttendance, cloudMatchesRes, cloudPenalties, cloudMods, cloudEventDate, cloudVenue] = await Promise.all([
        fetchTeamsCloud(),
        fetchAttendanceCloud(),
        fetchMatchesCloud(),
        fetchPenaltiesCloud(),
        fetchModeratorsCloud(),
        fetchEventDateCloud(),
        fetchEventVenueCloud()
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
      if (cloudVenue) setEventVenue(cloudVenue);
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
  const handleUpdateEventConfig = async (newDateIso, newVenue) => {
    if (newDateIso) {
      setEventDateIso(newDateIso);
      await saveEventDate(newDateIso);
    }
    if (newVenue) {
      setEventVenue(newVenue);
      await saveEventVenue(newVenue);
    }
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
      <main className="flex-grow px-2 sm:px-6 lg:px-8 py-3 sm:py-6 w-full">
        {activeTab === 'home' && (
          <div className="space-y-8 sm:space-y-12 max-w-7xl mx-auto w-full">
            <EsportsLandingHero
              onRegisterClick={() => setActiveTab('register')}
              onViewStandingsClick={() => setActiveTab('leaderboard')}
              activeMatch={activeMatch}
              teamsCount={teams.length}
              onVideoReady={() => setIsSiteReady(true)}
            />
            <div className="px-1 sm:px-4 lg:px-6">
              <EventCountdown
                eventDateIso={eventDateIso}
                eventVenue={eventVenue}
                isAdmin={isAdmin}
                onUpdateEventConfig={handleUpdateEventConfig}
                isSiteReady={isSiteReady}
              />
            </div>
            {isSiteReady && (
              <div className="px-1 sm:px-4 lg:px-6 animate-cyber-reveal">
                <AboutEventOrganizer />
              </div>
            )}
          </div>
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
            attendance={attendance}
            onUpdateTeam={handleUpdateTeam}
            onNavigateToRegister={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'event' && (
          <div className="space-y-8 max-w-7xl mx-auto">
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

      {/* Esports & Club Official Footer */}
      <footer className="border-t border-slate-900 bg-[#04060a] py-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Event & Organizer Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Assult Survivors BGMI Logo"
                className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-lg shadow-amber-500/20"
              />
              <div>
                <span className="font-display font-black text-xl text-white tracking-wide block">
                  ASSULT <span className="text-amber-400">SURVIVORS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  DATA SCIENCE CLUB • <span className="text-amber-400">NIST UNIVERSITY</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official campus Battlegrounds Mobile India championship conducted by the <strong>Data Science Club (DSC)</strong> at NIST University, Berhampur, Odisha as part of <strong>SANKALP 2026</strong>.
            </p>
            <div className="text-[11px] text-amber-400/90 font-mono tracking-wider">
              ✦ Learn. Build. Present. Compete.
            </div>
          </div>

          {/* Col 2: Tournament Hub */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Tournament Hub</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition">Home Landing</button></li>
              <li><button onClick={() => setActiveTab('register')} className="hover:text-amber-400 transition">Squad Registration</button></li>
              <li><button onClick={() => setActiveTab('teams')} className="hover:text-amber-400 transition">Registered Squads & Stats</button></li>
              <li><button onClick={() => setActiveTab('event')} className="hover:text-amber-400 transition">Event Day Verification</button></li>
              <li><button onClick={() => setActiveTab('public-match')} className="hover:text-amber-400 transition">Match Room & Slots</button></li>
              <li><button onClick={() => setActiveTab('leaderboard')} className="hover:text-amber-400 transition">Official Leaderboard</button></li>
            </ul>
          </div>

          {/* Col 3: Data Science Club NIST Links */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Data Science Club NIST</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://data-science-club-nist.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1.5"
                >
                  <span>Official DSC NIST Portal</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://data-science-club-nist.vercel.app/sankalp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1.5"
                >
                  <span>Sankalp 2026 Tech Fest</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://data-science-club-nist.vercel.app/team"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1.5"
                >
                  <span>Our Student Team</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://data-science-club-nist.vercel.app/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1.5"
                >
                  <span>Technical Projects</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://data-science-club-nist.vercel.app/achievements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1.5"
                >
                  <span>Club Achievements</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://data-science-club-nist.vercel.app/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1.5"
                >
                  <span>Contact Organizer Desk</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Venue Details */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Tournament Desk</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>NIST University Campus, Palur Hills, Berhampur, Odisha 761008</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:data.science.club@nist.edu" className="text-slate-300 hover:text-amber-400 font-mono">
                  data.science.club@nist.edu
                </a>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-500">
              Strict scoring formula: Kill = 2 Pts • WWCD = 6 Pts • 2nd = 4 Pts • 3rd = 2 Pts • 4th/5th = 1 Pt.
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© 2026 Data Science Club, NIST University. All rights reserved. • Official Student Organization</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-amber-400/80 font-semibold">Sankalp 2026 Tech Fest</span>
            <span>•</span>
            <span>Assult Survivors BGMI</span>
            <span>•</span>
            <a
              href="https://data-science-club-nist.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              DSC NIST
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
