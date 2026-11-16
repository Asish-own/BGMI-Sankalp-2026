import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info
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
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);

  const isUser = session.role === 'user';
  const isModerator = session.role === 'moderator';
  const isAdmin = session.role === 'admin';
  const perms = session.moderatorObj?.permissions || DEFAULT_PERMISSIONS;

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close menus on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsStaffDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on resize to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close staff dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#staff-dropdown-container')) {
        setIsStaffDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Desktop Center Navigation Tabs (Clean & Focused)
  const desktopNavTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'teams', label: 'Squads & Stats', icon: Users, badge: teamsCount },
    { id: 'public-match', label: 'Match Room', icon: Gamepad2, pulse: activeMatch && activeMatch.status !== 'DRAFT' },
    { id: 'leaderboard', label: 'Standings', icon: Trophy },
    { id: 'event', label: 'Event Day', icon: Calendar },
    { id: 'about', label: 'About Us', icon: Info },
  ];

  // Mobile drawer comprehensive navigation list
  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'register', label: 'Register Squad', icon: UserPlus, highlight: true },
    { id: 'teams', label: 'Squads & Stats', icon: Users, badge: teamsCount },
    { id: 'public-match', label: 'Match Room', icon: Gamepad2, pulse: activeMatch && activeMatch.status !== 'DRAFT' },
    { id: 'leaderboard', label: 'Official Leaderboard', icon: Trophy },
    { id: 'event', label: 'Event Day Attendance', icon: Calendar },
    { id: 'about', label: 'About Us (Organizer & Fest)', icon: Info },
  ];

  // Staff Hub Items
  const staffTabs = [
    { id: 'admin', label: 'Admin Match Control', icon: ShieldCheck, show: isAdmin || (isModerator && (perms.matchSetup || perms.manageLobbies)) },
    { id: 'penalties', label: 'Illegal Moves / Disqualify', icon: ShieldAlert, show: isAdmin || (isModerator && perms.disqualifyTeams) },
    { id: 'moderator-mgmt', label: 'Moderator Accounts', icon: Settings, show: isAdmin },
  ].filter(t => t.show);

  const handleNavSelect = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setIsStaffDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#06080e]/95 backdrop-blur-xl border-b border-amber-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)] w-full select-none">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-2">
            
            {/* BRAND & LOGO (Left - Compact on Phone, Prevents Overflow) */}
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group active:scale-95 transition min-w-0"
              onClick={() => handleNavSelect('home')}
            >
              <div className="relative flex-shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Assult Survivors BGMI Logo"
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl object-cover border border-amber-500/40 shadow-md shadow-amber-500/20 group-hover:border-amber-400 transition"
                />
                <div className="absolute -inset-0.5 bg-amber-500/20 rounded-lg sm:rounded-xl blur-sm -z-10 group-hover:bg-amber-500/40 transition"></div>
              </div>
              
              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-display font-black text-sm sm:text-lg tracking-wider text-white group-hover:text-amber-300 transition truncate">
                    ASSULT <span className="text-amber-400">SURVIVORS</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded flex-shrink-0">
                    BGMI
                  </span>
                </div>
                <p className="text-[9px] sm:text-[11px] text-slate-400 font-semibold tracking-wide truncate flex items-center gap-1">
                  <span>DSC</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400/90 font-bold">NIST UNIVERSITY</span>
                </p>
              </div>
            </div>

            {/* DESKTOP CENTER NAVIGATION TABS (Visible on PC >= 1024px) */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-[#0e1420]/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
              {desktopNavTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavSelect(tab.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>

                    {tab.badge !== undefined && (
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-black ${
                        isActive ? 'bg-amber-400 text-black' : 'bg-slate-800 text-amber-400 border border-slate-700'
                      }`}>
                        {tab.badge}
                      </span>
                    )}

                    {tab.pulse && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* DESKTOP RIGHT ACTION BAR (Visible on PC >= 1024px) */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              
              {/* DSC NIST Official External Link */}
              <a
                href="https://data-science-club-nist.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-[11px] font-bold tracking-wider transition"
                title="Official Data Science Club NIST Website"
              >
                <span>DSC NIST</span>
                <ExternalLink className="w-3 h-3 text-amber-400/80" />
              </a>

              {/* Staff Dropdown Menu (Only shown when Admin/Moderator is authenticated) */}
              {!isUser && (
                <div className="relative" id="staff-dropdown-container">
                  <button
                    onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition shadow-sm ${
                      isAdmin
                        ? 'bg-orange-500/15 text-orange-400 border-orange-500/40 hover:bg-orange-500/25'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25'
                    }`}
                  >
                    {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    <span>{session.role} HUB</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStaffDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isStaffDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0c1018]/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl p-2 space-y-1 z-50 animate-cyber-reveal">
                      <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-500 font-bold border-b border-slate-800/80 mb-1">
                        Staff Controls
                      </div>

                      {staffTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleNavSelect(tab.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                              isActive
                                ? 'bg-amber-500 text-black font-extrabold shadow-md'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}

                      <div className="pt-1 border-t border-slate-800/80 mt-1">
                        <button
                          onClick={() => {
                            onLogout();
                            setIsStaffDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Exit Staff Session</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Action Button: Dedicated Register Squad Button */}
              <button
                onClick={() => handleNavSelect('register')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-black uppercase tracking-wider transition shadow-lg active:scale-95 ${
                  activeTab === 'register'
                    ? 'bg-white text-black shadow-amber-500/40 border border-white'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/25'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Squad</span>
              </button>

            </div>

            {/* PHONE RIGHT: ONLY NAVBAR ICON (NO REGISTER CTA) */}
            <div className="lg:hidden flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(prev => !prev);
                }}
                aria-label={isMobileMenuOpen ? 'Minimize Navigation Menu' : 'Maximize Navigation Menu'}
                aria-expanded={isMobileMenuOpen}
                className={`p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center cursor-pointer select-none ${
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
      </header>

      {/* REACT PORTAL: MAXIMIZED MOBILE MENU DRAWER (Mounted to document.body) */}
      {typeof document !== 'undefined' && isMobileMenuOpen && createPortal(
        <div 
          className="lg:hidden fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col justify-start"
          style={{ top: '56px', height: 'calc(100dvh - 56px)' }}
        >
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6 pb-24">
            
            {/* Header Status Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              <span className="flex items-center gap-2 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                NAVIGATION PORTAL
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-bold p-1"
              >
                <span>[CLOSE ✕]</span>
              </button>
            </div>

            {/* Mobile Tournament Pages */}
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 mb-1">
                Tournament Pages
              </div>

              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavSelect(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                      item.highlight && !isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40 shadow-md shadow-amber-500/10'
                        : isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-lg shadow-amber-500/25 border border-amber-400'
                        : 'bg-[#101624] text-slate-200 border border-slate-800/90 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isActive 
                          ? 'bg-black/20 text-black' 
                          : item.highlight 
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-amber-400'
                      }`}>
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

            {/* Staff Section (Mobile) */}
            {!isUser && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
                  <span>Staff Panel ({session.role})</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="text-red-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <LogOut className="w-3 h-3" /> Logout
                  </button>
                </div>

                {staffTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleNavSelect(tab.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-orange-500 text-black font-extrabold shadow-lg shadow-orange-500/25'
                          : 'bg-[#181a24] text-orange-300 border border-orange-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Data Science Club NIST Links */}
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
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider hover:text-white transition active:scale-95"
            >
              Minimize Menu ↑
            </button>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
