import React from 'react';
import { Trophy, Shield, Flame, Sparkles, Gamepad2 } from 'lucide-react';

export default function EsportsLandingHero({ onRegisterClick, onViewStandingsClick, activeMatch, teamsCount }) {
  return (
    <div className="space-y-12 pb-6 overflow-hidden">
      
      {/* HERO BANNER SECTION */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e1626] via-[#090e18] to-[#070a10] border border-amber-500/30 shadow-2xl hud-border">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Graphic */}
          <div className="hidden lg:block lg:col-span-3 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-2xl group-hover:bg-amber-500/30 transition"></div>
              <img
                src="/logo.jpg"
                alt="Assult Survivors BGMI"
                className="relative z-10 w-full h-80 object-cover rounded-3xl border border-amber-500/40 shadow-2xl transform -rotate-2 group-hover:rotate-0 transition duration-500"
              />
            </div>
          </div>

          {/* Center Hero Content Box */}
          <div className="lg:col-span-6 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-widest animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" /> PRESENTED BY DATA SCIENCE CLUB
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-wider leading-tight">
              ASSULT SURVIVORS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 text-shadow-neon">
                BGMI TOURNAMENT
              </span>
            </h1>

            {/* Sub-Card Box */}
            <div className="bg-[#0b101a]/90 p-6 sm:p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4 max-w-xl mx-auto">
              <h2 className="font-display font-black text-xl text-amber-400 tracking-wide uppercase flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> BATTLEGROUNDS CHAMPIONSHIP
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Compete in official BGMI Survival Squad matches with verified attendance, randomized room slot numbers, and automated tie-breaker leaderboard scoring.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 scale-105"
                >
                  <Gamepad2 className="w-4 h-4" /> Register Squad Now
                </button>
                <button
                  onClick={onViewStandingsClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-display font-bold text-sm uppercase tracking-wider transition border border-slate-700 flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-400" /> View Standings
                </button>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic */}
          <div className="hidden lg:block lg:col-span-3 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/20 rounded-3xl blur-2xl group-hover:bg-orange-500/30 transition"></div>
              <img
                src="/hero_warrior.jpg"
                alt="BGMI Warrior"
                className="relative z-10 w-full h-80 object-cover rounded-3xl border border-amber-500/40 shadow-2xl transform rotate-2 group-hover:rotate-0 transition duration-500"
              />
            </div>
          </div>

        </div>

      </section>

      {/* TICKER MARQUEE BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3 text-black font-display font-black text-xs sm:text-sm tracking-widest uppercase overflow-hidden shadow-lg">
        <div className="flex items-center justify-around whitespace-nowrap animate-pulse">
          <span>✦ ASSULT SURVIVORS BGMI</span>
          <span>✦ PRESENTED BY DATA SCIENCE CLUB</span>
          <span>✦ 25-SLOT CUSTOM ROOMS</span>
          <span>✦ KILL = 2 PTS</span>
          <span>✦ WINNER = 6 PTS</span>
          <span>✦ STRICT TIE-BREAKER STANDINGS</span>
        </div>
      </div>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#0d1624] to-slate-900 p-8 sm:p-12 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 relative z-10 max-w-xl">
            <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
              ✦ Ready for Championship Glory?
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-wide">
              BECOME THE NEXT <span className="text-amber-400">ASSULT SURVIVOR!</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Presented by Data Science Club. Register your 4-player squad today and get assigned to custom match room slots.
            </p>
          </div>

          <button
            onClick={onRegisterClick}
            className="relative z-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-base uppercase tracking-wider transition shadow-2xl shadow-amber-500/30 flex-shrink-0"
          >
            Register Squad Now →
          </button>
        </div>
      </section>

    </div>
  );
}
