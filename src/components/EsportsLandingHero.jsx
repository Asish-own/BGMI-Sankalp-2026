import React from 'react';
import { Radio } from 'lucide-react';

export default function EsportsLandingHero({ onRegisterClick, onViewStandingsClick, activeMatch, teamsCount }) {
  return (
    <div className="space-y-6 pb-2 overflow-hidden w-full">
      
      {/* CINEMATIC HERO SECTION - BGMI VIDEO AS ABSOLUTE PRIORITY */}
      <section className="relative min-h-[65vh] sm:min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12 rounded-2xl sm:rounded-3xl border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.25)] hud-border overflow-hidden bg-black/20">
        
        {/* BGMI Gameplay Video Stream - 100% Crisp & Fully Visible */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            src="/zLF7ZVlv.mp4"
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            className="w-full h-full object-cover scale-100 filter brightness-95 contrast-105 saturate-110"
          />
          {/* Minimal Bottom Vignette to seamlessly blend into page background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/30"></div>
          <div className="absolute inset-0 bg-black/15"></div>
        </div>

        {/* Ambient Subtle Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none z-0"></div>

        {/* Hero Title & Presenter Only (Video is Unobstructed) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          
          {/* Live Tactical Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/60 text-amber-400 text-xs sm:text-sm font-black uppercase tracking-widest shadow-2xl shadow-black/80">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
            <span className="tracking-widest">PRESENTED BY DATA SCIENCE CLUB</span>
          </div>

          {/* Glowing Hero Title */}
          <h1 className="font-display font-black text-3xl sm:text-6xl lg:text-7xl text-white tracking-wider leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            ASSULT SURVIVORS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 text-shadow-neon filter drop-shadow-[0_0_35px_rgba(245,158,11,0.85)]">
              BGMI TOURNAMENT
            </span>
          </h1>

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
          {/* Track 2 */}
          <span className="flex items-center gap-8 sm:gap-12" aria-hidden="true">
            <span>✦ ASSULT SURVIVORS BGMI</span>
            <span>✦ PRESENTED BY DATA SCIENCE CLUB</span>
            <span>✦ 25-SLOT CUSTOM ROOMS</span>
            <span>✦ KILL = 2 PTS</span>
            <span>✦ WINNER = 6 PTS</span>
            <span>✦ STRICT TIE-BREAKER STANDINGS</span>
          </span>
          {/* Track 3 */}
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
