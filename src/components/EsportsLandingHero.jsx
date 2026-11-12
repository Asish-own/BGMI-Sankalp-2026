import React from 'react';
import { Trophy, Shield, Flame, Sparkles, Gamepad2, Radio } from 'lucide-react';

export default function EsportsLandingHero({ onRegisterClick, onViewStandingsClick, activeMatch, teamsCount }) {
  return (
    <div className="space-y-10 pb-4 overflow-hidden">
      
      {/* HERO BANNER SECTION WITH BGMI GAMEPLAY VIDEO BACKGROUND */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] hud-border overflow-hidden bg-black/40">
        
        {/* BGMI Background Video Stream */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            src="/zLF7ZVlv.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 filter brightness-70 contrast-125 saturate-110"
          />
          {/* Gaming Cyber Vignette Gradients for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-black/55 to-black/75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
          {/* Subtle Cyber Grid Lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40"></div>
        </div>

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/20 rounded-full blur-[130px] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-500/15 rounded-full blur-[130px] pointer-events-none z-0"></div>

        {/* Hero Interactive Content Overlay */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Graphic Card */}
          <div className="hidden lg:block lg:col-span-3 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/25 rounded-3xl blur-2xl group-hover:bg-amber-500/40 transition duration-500"></div>
              <img
                src="/logo.jpg"
                alt="Assult Survivors BGMI"
                className="relative z-10 w-full h-80 object-cover rounded-3xl border-2 border-amber-500/50 shadow-2xl transform -rotate-2 group-hover:rotate-0 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 z-20 py-1 px-3 bg-black/80 backdrop-blur-md rounded-xl border border-amber-500/30 text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
                OFFICIAL TOURNAMENT EMBLEM
              </div>
            </div>
          </div>

          {/* Center Hero Content Box */}
          <div className="lg:col-span-6 text-center space-y-6">
            
            {/* Live Tactical Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/50 text-amber-400 text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/10">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>PRESENTED BY DATA SCIENCE CLUB</span>
            </div>

            {/* Glowing Hero Title */}
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-wider leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
              ASSULT SURVIVORS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 text-shadow-neon filter drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                BGMI TOURNAMENT
              </span>
            </h1>

            {/* Futuristic Sub-Card Box */}
            <div className="bg-[#0b101a]/85 p-6 sm:p-8 rounded-3xl border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-4 max-w-xl mx-auto hud-border">
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                <h2 className="font-display font-black text-xl text-amber-400 tracking-wide uppercase">
                  BATTLEGROUNDS CHAMPIONSHIP
                </h2>
              </div>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                Compete in official BGMI Survival Squad matches with verified attendance, randomized room slot numbers, and automated tie-breaker leaderboard scoring.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-black font-display font-black text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 scale-105 active:scale-95"
                >
                  <Gamepad2 className="w-4 h-4" /> Register Squad Now
                </button>
                <button
                  onClick={onViewStandingsClick}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-black/60 hover:bg-slate-900 text-white font-display font-bold text-sm uppercase tracking-wider transition border border-slate-700/80 hover:border-amber-400 flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-400" /> View Standings
                </button>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic Card */}
          <div className="hidden lg:block lg:col-span-3 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/25 rounded-3xl blur-2xl group-hover:bg-orange-500/40 transition duration-500"></div>
              <img
                src="/hero_warrior.jpg"
                alt="BGMI Cyber Warrior"
                className="relative z-10 w-full h-80 object-cover rounded-3xl border-2 border-orange-500/50 shadow-2xl transform rotate-2 group-hover:rotate-0 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 z-20 py-1 px-3 bg-black/80 backdrop-blur-md rounded-xl border border-orange-500/30 text-[10px] font-extrabold uppercase text-orange-400 tracking-wider">
                CUSTOM ROOM SLOTS • 25 SQUADS
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* TICKER MARQUEE BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3 text-black font-display font-black text-xs sm:text-sm tracking-widest uppercase overflow-hidden shadow-xl border-y border-amber-400/40">
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#0d1624] to-slate-900 p-8 sm:p-12 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 hud-border">
          <div className="space-y-3 relative z-10 max-w-xl">
            <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
              ✦ Ready for Championship Glory?
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-wide">
              BECOME THE NEXT <span className="text-amber-400 text-shadow-neon">ASSULT SURVIVOR!</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Presented by Data Science Club. Register your 4-player squad today and get assigned to custom match room slots.
            </p>
          </div>

          <button
            onClick={onRegisterClick}
            className="relative z-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-base uppercase tracking-wider transition shadow-2xl shadow-amber-500/30 flex-shrink-0 active:scale-95"
          >
            Register Squad Now →
          </button>
        </div>
      </section>

    </div>
  );
}
