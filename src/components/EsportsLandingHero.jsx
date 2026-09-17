import React from 'react';
import { Trophy, Shield, Flame, Sparkles, Swords, Gamepad2, Award, ArrowRight, Zap, CheckCircle2, Users } from 'lucide-react';

export default function EsportsLandingHero({ onRegisterClick, onViewStandingsClick, activeMatch, teamsCount }) {
  return (
    <div className="space-y-16 pb-12 overflow-hidden">
      
      {/* HERO BANNER SECTION */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e1626] via-[#090e18] to-[#070a10] border border-emerald-500/30 shadow-2xl hud-border">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Character Graphic */}
          <div className="hidden lg:block lg:col-span-3 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-2xl group-hover:bg-emerald-500/30 transition"></div>
              <img
                src="/hero_warrior.jpg"
                alt="BGMI Cyber Warrior"
                className="relative z-10 w-full h-80 object-cover rounded-3xl border border-emerald-500/40 shadow-2xl transform -rotate-2 group-hover:rotate-0 transition duration-500"
              />
            </div>
          </div>

          {/* Center Hero Content Box */}
          <div className="lg:col-span-6 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-widest animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Welcome to BGMI Club Esports
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-wider leading-tight">
              SHAPING THE FUTURE OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 text-shadow-neon">
                ESPORTS BATTLEGROUNDS
              </span>
            </h1>

            {/* Sub-Card Box */}
            <div className="bg-[#0b101a]/90 p-6 sm:p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4 max-w-xl mx-auto">
              <h2 className="font-display font-black text-xl text-amber-400 tracking-wide uppercase flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Join The Big Tournaments
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Compete in official BGMI Survival Squad matches with verified attendance, randomized room slot numbers, and automated tie-breaker leaderboard scoring.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-display font-black text-sm uppercase tracking-wider transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 scale-105"
                >
                  <Gamepad2 className="w-4 h-4" /> Register Squad Now
                </button>
                <button
                  onClick={onViewStandingsClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" /> View Standings
                </button>
              </div>
            </div>

          </div>

          {/* Right Hero Character Graphic */}
          <div className="hidden lg:block lg:col-span-3 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-2xl group-hover:bg-amber-500/30 transition"></div>
              <img
                src="/hero_assassin.jpg"
                alt="BGMI Cyber Assassin"
                className="relative z-10 w-full h-80 object-cover rounded-3xl border border-amber-500/40 shadow-2xl transform rotate-2 group-hover:rotate-0 transition duration-500"
              />
            </div>
          </div>

        </div>

      </section>

      {/* TICKER MARQUEE BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 py-3 text-black font-display font-black text-xs sm:text-sm tracking-widest uppercase overflow-hidden shadow-lg">
        <div className="flex items-center justify-around whitespace-nowrap animate-pulse">
          <span>✦ GAMING SPHERE</span>
          <span>✦ ACTION-PACKED SURVIVAL</span>
          <span>✦ 25-SLOT BGMI ROOMS</span>
          <span>✦ KILL = 2 PTS</span>
          <span>✦ WINNER = 6 PTS</span>
          <span>✦ STRICT TIE-BREAKER STANDINGS</span>
        </div>
      </div>

      {/* FEATURED SECTION: "FORGING LEGENDS IN THE GAMING UNIVERSE" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="w-full h-80 rounded-3xl overflow-hidden border border-emerald-500/30 relative group">
              <img
                src="/hero_warrior.jpg"
                alt="Gaming Universe Legend"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-slate-800 text-xs">
                <span className="font-extrabold text-emerald-400 uppercase">PRO LEAGUE HUB</span>
                <p className="text-white font-bold mt-0.5">Top-tier battlegrounds infrastructure</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              ✦ Battlegrounds Ecosystem
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
              FORGING LEGENDS IN THE <span className="text-emerald-400">GAMING UNIVERSE</span>
            </h2>

            <div className="space-y-4">
              
              <div className="p-4 bg-[#0c1018] rounded-2xl border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Instant Custom Room Credentials</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Room IDs and Passwords published live to registered teams with assigned slot numbers.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#0c1018] rounded-2xl border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Moderator Attendance & Verification</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Event day attendance checklist managed by Team Leader Name to ensure 100% active lobbies.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#0c1018] rounded-2xl border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Strict Tie-Breaker Scoring Engine</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Formula: Position Bonus + (Kills × 2). Resolves ties via Total Kills, WWCDs, and Best Match Scores.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* UPCOMING TOURNAMENTS MATCH SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Active Battle Maps
            </div>
            <h2 className="font-display font-black text-3xl text-white tracking-wide">
              OUR FEATURED <span className="text-amber-400">TOURNAMENT MATCHES</span>
            </h2>
          </div>

          <button
            onClick={onRegisterClick}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-md self-start sm:self-auto"
          >
            + Register Your Team
          </button>
        </div>

        {/* Versus Match Cards Matching Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Erangel */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 hover:border-emerald-500/40 transition group">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                MAP: ERANGEL
              </span>
              <span className="text-xs font-bold text-amber-400">SLOTS: 25 TEAMS</span>
            </div>

            <div className="flex items-center justify-around py-2">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-display font-black text-xl mx-auto shadow-md">
                  APEX
                </div>
                <span className="text-xs font-bold text-white mt-2 block">Apex Predators</span>
                <span className="text-[10px] text-slate-400">1st Year Leader</span>
              </div>

              <div className="font-display font-black text-2xl text-red-500 animate-pulse">VS</div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-display font-black text-xl mx-auto shadow-md">
                  SOUL
                </div>
                <span className="text-xs font-bold text-white mt-2 block">Soul Destroyers</span>
                <span className="text-[10px] text-slate-400">2nd Year Leader</span>
              </div>
            </div>

            <div className="p-3 bg-[#0c1018] rounded-2xl border border-slate-800 text-xs flex justify-between">
              <span className="text-slate-400">Survival Format:</span>
              <strong className="text-white">Squad TPP Custom Room</strong>
            </div>
          </div>

          {/* Card 2: Miramar */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 hover:border-amber-500/40 transition group">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                MAP: MIRAMAR
              </span>
              <span className="text-xs font-bold text-amber-400">SLOTS: 25 TEAMS</span>
            </div>

            <div className="flex items-center justify-around py-2">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-display font-black text-xl mx-auto shadow-md">
                  GOD
                </div>
                <span className="text-xs font-bold text-white mt-2 block">GodLike Titans</span>
                <span className="text-[10px] text-slate-400">2nd Year Leader</span>
              </div>

              <div className="font-display font-black text-2xl text-red-500 animate-pulse">VS</div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-display font-black text-xl mx-auto shadow-md">
                  CYBER
                </div>
                <span className="text-xs font-bold text-white mt-2 block">Cyber Strikers</span>
                <span className="text-[10px] text-slate-400">1st Year Leader</span>
              </div>
            </div>

            <div className="p-3 bg-[#0c1018] rounded-2xl border border-slate-800 text-xs flex justify-between">
              <span className="text-slate-400">Survival Format:</span>
              <strong className="text-white">Desert Sniping Battle</strong>
            </div>
          </div>

          {/* Card 3: Sanhok */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 hover:border-cyan-500/40 transition group">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
                MAP: SANHOK
              </span>
              <span className="text-xs font-bold text-amber-400">SLOTS: 25 TEAMS</span>
            </div>

            <div className="flex items-center justify-around py-2">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-display font-black text-xl mx-auto shadow-md">
                  SHD
                </div>
                <span className="text-xs font-bold text-white mt-2 block">Shadow Esports</span>
                <span className="text-[10px] text-slate-400">2nd Year Leader</span>
              </div>

              <div className="font-display font-black text-2xl text-red-500 animate-pulse">VS</div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-display font-black text-xl mx-auto shadow-md">
                  INF
                </div>
                <span className="text-xs font-bold text-white mt-2 block">Inferno Elites</span>
                <span className="text-[10px] text-slate-400">1st Year Leader</span>
              </div>
            </div>

            <div className="p-3 bg-[#0c1018] rounded-2xl border border-slate-800 text-xs flex justify-between">
              <span className="text-slate-400">Survival Format:</span>
              <strong className="text-white">Jungle Rush Action</strong>
            </div>
          </div>

        </div>
      </section>

      {/* JOIN COMMUNITY PRO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0d1624] to-slate-900 p-8 sm:p-12 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 relative z-10 max-w-xl">
            <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
              ✦ Ready for Championship Glory?
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-wide">
              JOIN CLUB ESPORTS TO BECOME THE NEXT <span className="text-emerald-400">CHAMPION!</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Register your 4-player squad today and get assigned to custom match room slots.
            </p>
          </div>

          <button
            onClick={onRegisterClick}
            className="relative z-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-display font-black text-base uppercase tracking-wider transition shadow-2xl shadow-emerald-500/30 flex-shrink-0"
          >
            Register Squad Now →
          </button>
        </div>
      </section>

    </div>
  );
}
