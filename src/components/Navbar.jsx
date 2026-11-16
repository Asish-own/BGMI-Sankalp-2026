import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  UserPlus, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Gamepad2, 
  UserCheck, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Home, 
  ExternalLink,
  Menu,
  X,
  Radio,
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { DEFAULT_PERMISSIONS } from '../utils/storage';

export default function Navbar({
  session,
  activeTab,
  setActiveTab,
  teamsCount,
  activeMatch,
  onLogout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isUser = session.role === 'user';
  const isModerator = session.role === 'moderator';
  const isAdmin = session.role === 'admin';
  const perms = session.moderatorObj?.permissions || DEFAULT_PERMISSIONS;

  // Close menu on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menu on resize to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // All navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, show: true },
    { id: 'register', label: 'Register Squad', icon: UserPlus, highlight: true, show: true },
    { id: 'teams', label: 'Teams & Stats', icon: Users, badge: teamsCount, show: true },
    { id: 'public-match', label: 'Match Room', icon: Gamepad2, pulse: activeMatch && activeMatch.status !== 'DRAFT', show: true },
    { id: 'event', label: 'Event Day', icon: Calendar, show: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, show: true },
    
    // Admin / Moderator Only Tabs
    { id: 'admin', label: 'Admin Hub', icon: ShieldCheck, staff: true, show: isAdmin || (isModerator && (perms.matchSetup || perms.manageLobbies)) },
    { id: 'penalties', label: 'Illegal Moves', icon: ShieldAlert, staff: true, show: isAdmin || (isModerator && perms.disqualifyTeams) },
    { id: 'moderator-mgmt', label: 'Moderator Accounts', icon: Settings, staff: true, show: isAdmin },
  ];

  const handleNavSelect = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Minimize menu on option select
  };

  const isMatchLive = activeMatch && activeMatch.status !== 'DRAFT';

  return (
    <header className="sticky top-0 z-50 bg-[#070a10]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* BRAND & LOGO (Mobile-First Compact Sizing) */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none active:scale-95 transition"
            onClick={() => handleNavSelect('home')}
          >
            <img
              src="/logo.jpg"
              alt="Assult Survivors BGMI Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover border border-amber-500/40 shadow-md shadow-amber-500/20 flex-shrink-0"
            />
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm sm:text-lg tracking-wider text-white">
                  ASSULT <span className="text-amber-400">SURVIVORS</span>
                </span>
                <span className="px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md">
                  BGMI
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-400 font-semibold tracking-wide">
                DSC • <strong className="text-amber-400">NIST UNIVERSITY</strong>
              </p>
            </div>
          </div>

          {/* DESKTOP NAVIGATION (Hidden on mobile < 1024px) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#101622] p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.filter(item => item.show && !item.staff).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavSelect(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : ''}`} />
                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-black/25 text-black' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.pulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}

            {/* Desktop Staff Hub Tabs */}
            {!isUser && navItems.filter(item => item.show && item.staff).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavSelect(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition ${
                    isActive
                      ? 'bg-orange-500 text-black shadow-md'
                      : 'text-orange-400 hover:bg-orange-500/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* DESKTOP RIGHT BAR */}
          <div className="hidden lg:flex items-center gap-2.5">
            <a
              href="https://data-science-club-nist.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-[11px] font-bold tracking-wider transition"
              title="Official Data Science Club NIST Website"
            >
              <span>DSC NIST</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>

            <button
              onClick={() => handleNavSelect('register')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition scale-105 active:scale-95"
            >
              REGISTER SQUAD
            </button>

            {!isUser && (
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-black flex items-center gap-1.5 ${
                  isAdmin
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  <span className="uppercase tracking-wider">{session.role}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-xl transition"
                  title="Exit Staff Panel"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE PRIORITY OPTIONS & NAVBAR ICON (Screen < 1024px) */}
          <div className="lg:hidden flex items-center gap-2">
            
            {/* Priority Option 1: Live Match Room Pill (Contextual when room is live) */}
            {isMatchLive && (
              <button
                onClick={() => handleNavSelect('public-match')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition active:scale-95 border ${
                  activeTab === 'public-match'
                    ? 'bg-emerald-500 text-black border-emerald-400'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}
              >
                <Radio className="w-3 h-3 animate-pulse text-emerald-400 flex-shrink-0" />
                <span>Room Live</span>
              </button>
            )}

            {/* Priority Option 2: Register Squad Button (The #1 mobile priority) */}
            <button
              onClick={() => handleNavSelect('register')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-black uppercase tracking-wider transition shadow-md active:scale-95 ${
                activeTab === 'register'
                  ? 'bg-white text-black shadow-amber-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-amber-500/20'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>

            {/* Mobile Navbar Icon (Hamburger / Close Toggle) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Minimize Navigation Menu' : 'Maximize Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              className={`p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center ${
                isMobileMenuOpen
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                  : 'bg-[#111622] text-amber-400 border-amber-500/40 hover:bg-slate-800'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* MAXIMIZED MOBILE MENU DRAWER (Revealed when Navbar Icon is clicked) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-black/85 backdrop-blur-2xl z-50 overflow-y-auto animate-cyber-reveal border-b border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 pb-16">
            
            {/* Tactical Header Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              <span className="flex items-center gap-2 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                NAVIGATION PORTAL
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-bold"
              >
                <span>[CLOSE]</span>
              </button>
            </div>

            {/* Primary Navigation List */}
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 mb-1">
                Tournament Pages
              </div>

              {navItems.filter(item => item.show && !item.staff).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavSelect(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-lg shadow-amber-500/25 border border-amber-400'
                        : 'bg-[#101624] text-slate-200 border border-slate-800/90 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-amber-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="tracking-wide">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge !== undefined && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                          isActive ? 'bg-black/25 text-black' : 'bg-slate-800 text-amber-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.pulse && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                          LIVE
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-500'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Staff Only Section (if logged in) */}
            {!isUser && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
                  <span>Staff Panel ({session.role})</span>
                  <button onClick={onLogout} className="text-red-400 hover:underline flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Logout
                  </button>
                </div>

                {navItems.filter(item => item.show && item.staff).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavSelect(item.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-orange-500 text-black font-extrabold shadow-lg shadow-orange-500/25'
                          : 'bg-[#181a24] text-orange-300 border border-orange-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Official Data Science Club NIST Links */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="text-[10px] font-black uppercase text-amber-400 tracking-widest px-2 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Data Science Club • NIST University
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://data-science-club-nist.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0e1420] border border-slate-800 text-slate-300 hover:text-amber-400 font-semibold transition"
                >
                  <span>DSC Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <a
                  href="https://data-science-club-nist.vercel.app/sankalp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0e1420] border border-slate-800 text-slate-300 hover:text-amber-400 font-semibold transition"
                >
                  <span>Sankalp 2026</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <a
                  href="https://data-science-club-nist.vercel.app/team"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0e1420] border border-slate-800 text-slate-300 hover:text-amber-400 font-semibold transition"
                >
                  <span>Our Team</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <a
                  href="https://data-science-club-nist.vercel.app/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0e1420] border border-slate-800 text-slate-300 hover:text-amber-400 font-semibold transition"
                >
                  <span>Contact Desk</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Quick Dismiss Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider hover:text-white transition"
            >
              Minimize Menu ↑
            </button>

          </div>
        </div>
      )}

    </header>
  );
}
