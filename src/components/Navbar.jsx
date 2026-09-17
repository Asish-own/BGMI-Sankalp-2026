import React from 'react';
import { 
  Trophy, 
  UserPlus, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Gamepad2, 
  RotateCcw,
  UserCheck,
  ShieldAlert,
  Settings,
  Lock,
  LogOut,
  Home
} from 'lucide-react';
import { resetDemoData, DEFAULT_PERMISSIONS } from '../utils/storage';

export default function Navbar({
  session,
  activeTab,
  setActiveTab,
  teamsCount,
  activeMatch,
  onLogout
}) {
  const isUser = session.role === 'user';
  const isModerator = session.role === 'moderator';
  const isAdmin = session.role === 'admin';
  const perms = session.moderatorObj?.permissions || DEFAULT_PERMISSIONS;

  // Clean User Navigation Items matching reference design
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, show: true },
    { id: 'register', label: 'Register Squad', icon: UserPlus, show: true },
    { id: 'teams', label: 'Teams & Stats', icon: Users, badge: teamsCount, show: true },
    { id: 'event', label: 'Event Day', icon: Calendar, show: true },
    { id: 'public-match', label: 'Match Room', icon: Gamepad2, pulse: !!activeMatch, show: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, show: true },
    
    // Admin / Moderator Only Tabs (Hidden for public users)
    { id: 'penalties', label: 'Illegal Moves', icon: ShieldAlert, show: isAdmin || (isModerator && perms.disqualifyTeams) },
    { id: 'admin', label: 'Admin Hub', icon: ShieldCheck, highlight: true, show: isAdmin || (isModerator && (perms.matchSetup || perms.manageLobbies)) },
    { id: 'moderator-mgmt', label: 'Moderator Accounts', icon: Settings, show: isAdmin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c1019]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-wider text-white">
                  BGMI <span className="text-emerald-400">CLUB</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  ESPORTS HUBS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Battlegrounds Tournament Portal</p>
            </div>
          </div>

          {/* Dynamic Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#131926] p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold shadow-md shadow-emerald-500/20 scale-[1.02]'
                      : item.highlight
                      ? 'text-amber-400 hover:bg-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : ''}`} />
                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-300'
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
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('register')}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition scale-105"
            >
              JOIN NOW
            </button>

            {!isUser && (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 ${
                  isAdmin
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  <span className="uppercase tracking-wider">{session.role} MODE</span>
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

        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {navItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
