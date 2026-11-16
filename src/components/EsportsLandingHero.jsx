import React from 'react';
import { Trophy, Shield, Flame, Sparkles, Gamepad2, Radio } from 'lucide-react';

export default function EsportsLandingHero({ onRegisterClick, onViewStandingsClick, activeMatch, teamsCount }) {
  return (
    <div className="space-y-8 pb-4 overflow-hidden w-full">
      
      {/* IMMERSIVE HERO BANNER SECTION WITH BGMI GAMEPLAY VIDEO BACKGROUND */}
      <section className="relative min-h-[82vh] sm:min-h-[78vh] flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12 rounded-2xl sm:rounded-3xl border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] hud-border overflow-hidden bg-transparent">
        
        {/* BGMI Background Video Stream - Fully Visible On All Devices */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            src="/zLF7ZVlv.mp4"
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            className="w-full h-full object-cover scale-105 filter brightness-85 contrast-115 saturate-110"
          />
          {/* Transparent Vignette Gradients for Text Legibility while keeping video clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-black/40 to-black/55"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
          {/* Subtle Cyber Grid Lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>
        </div>

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/20 rounded-full blur-[130px] pointer-events-none z-0"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Hero Interactive Content (Centered with NO Images In Front of Video) */}
        <div className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          
          {/* Live Tactical Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/60 text-amber-400 text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-500/15">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
            <span className="truncate">PRESENTED BY DATA SCIENCE CLUB</span>
          </div>

          {/* Glowing Hero Title */}
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-wider leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            ASSULT SURVIVORS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 text-shadow-neon filter drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]">
              BGMI TOURNAMENT
            </span>
          </h1>

          {/* Futuristic Sub-Card Box */}
          <div className="bg-[#0b101a]/85 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-4 max-w-xl mx-auto hud-border">
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse flex-shrink-0" />
              <h2 className="font-display font-black text-lg sm:text-xl text-amber-400 tracking-wide uppercase">
                BATTLEGROUNDS CHAMPIONSHIP
              </h2>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
              Compete in official BGMI Survival Squad matches with verified attendance, randomized room slot numbers, and automated tie-breaker leaderboard scoring.
            </p>

            {/* Mobile-First Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-black font-display font-black text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <Gamepad2 className="w-4 h-4" /> Register Squad Now
              </button>
              <button
                onClick={onViewStandingsClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-2xl bg-black/70 hover:bg-slate-900 text-white font-display font-bold text-sm uppercase tracking-wider transition border border-slate-700 hover:border-amber-400 flex items-center justify-center gap-2 active:scale-95"
              >
                <Trophy className="w-4 h-4 text-amber-400" /> View Standings
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* CONTINUOUS MOVING TICKER MARQUEE */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 py-2.5 sm:py-3 text-black font-display font-black text-xs sm:text-sm tracking-widest uppercase overflow-hidden shadow-2xl border-y border-amber-400/40 select-none">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-8 sm:gap-12">
          {/* Track 1 */}
          <span className="flex items-center gap-8 sm:gap-12">
            <span>✦ ASSULT SURVIVORS BGMI</span>
            <span>✦ PRESENTED BY DATA SCIENCE CLUB</span>
            <span>✦ 25-SLOT CUSTOM ROOMS</span>
            <span>✦ KILL = 2 PTS</span>
            <span>✦ WINNER = 6 PTS</span>
            <span>✦ STRICT TIE-BREAKER STANDINGS</span>
          </span>
          {/* Track 2 (Repeated for seamless continuous loop) */}
          <span className="flex items-center gap-8 sm:gap-12" aria-hidden="true">
            <span>✦ ASSULT SURVIVORS BGMI</span>
            <span>✦ PRESENTED BY DATA SCIENCE CLUB</span>
            <span>✦ 25-SLOT CUSTOM ROOMS</span>
            <span>✦ KILL = 2 PTS</span>
            <span>✦ WINNER = 6 PTS</span>
            <span>✦ STRICT TIE-BREAKER STANDINGS</span>
          </span>
          {/* Track 3 (For wide screens) */}
          <span className="flex items-center gap-8 sm:gap-12" aria-hidden="true">
            <span>✦ ASSULT SURVIVORS BGMI</span>
            <span>✦ PRESENTED BY DATA SCIENCE CLUB</span>
            <span>✦ 25-SLOT CUSTOM ROOMS</span>
            <span>✦ KILL = 2 PTS</span>
            <span>✦ WINNER = 6 PTS</span>
            <span>✦ STRICT TIE-BREAKER STANDINGS</span>
          </span>
        </div>
      </div>

      {/* CALL TO ACTION BANNER */}
      <section className="w-full px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#0d1624] to-slate-900 p-6 sm:p-10 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hud-border">
          <div className="space-y-2 relative z-10 max-w-xl">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase text-amber-400 tracking-wider">
              ✦ Ready for Championship Glory?
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-wide">
              BECOME THE NEXT <span className="text-amber-400 text-shadow-neon">ASSULT SURVIVOR!</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Presented by Data Science Club. Register your 4-player squad today and get assigned to custom match room slots.
            </p>
          </div>

          <button
            onClick={onRegisterClick}
            className="relative z-10 w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-sm sm:text-base uppercase tracking-wider transition shadow-2xl shadow-amber-500/30 flex-shrink-0 active:scale-95 text-center"
          >
            Register Squad Now →
          </button>
        </div>
      </section>

    </div>
  );
}
