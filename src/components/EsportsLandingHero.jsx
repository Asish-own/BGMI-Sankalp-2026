import React, { useState, useEffect, useRef } from 'react';
import { Radio, Zap, ShieldAlert, Cpu } from 'lucide-react';
import { loadVideoOfflineBlob, getCachedBlobUrl, isVideoInMemory } from '../utils/videoCache';

export default function EsportsLandingHero({
  onRegisterClick,
  onViewStandingsClick,
  activeMatch,
  teamsCount,
  onVideoReady
}) {
  const [videoSrc, setVideoSrc] = useState(() => getCachedBlobUrl() || '');
  const [videoReady, setVideoReady] = useState(() => isVideoInMemory());
  const [progress, setProgress] = useState(() => (isVideoInMemory() ? 100 : 0));
  const videoRef = useRef(null);

  // Progressive Loading: Skeleton First -> Background Video -> Reveal Rest
  useEffect(() => {
    let isMounted = true;

    async function initializeVideoFeed() {
      try {
        const sourceUrl = await loadVideoOfflineBlob((percent) => {
          if (isMounted) setProgress(percent);
        });

        if (isMounted) {
          setVideoSrc(sourceUrl);
        }
      } catch (err) {
        console.warn('Video feed load exception, using fallback:', err);
        if (isMounted) {
          setVideoSrc('/zLF7ZVlv.mp4');
        }
      }
    }

    if (!isVideoInMemory()) {
      initializeVideoFeed();
    } else {
      setVideoSrc(getCachedBlobUrl());
      setVideoReady(true);
      if (onVideoReady) onVideoReady();
    }

    // Safety timeout: ensure page unlocks within 4.5 seconds even on slow networks
    const fallbackTimer = setTimeout(() => {
      if (isMounted && !videoReady) {
        setVideoReady(true);
        if (onVideoReady) onVideoReady();
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  // When video data is ready, trigger continuous playback
  const handleCanPlay = () => {
    if (!videoReady) {
      setVideoReady(true);
      if (onVideoReady) onVideoReady();
    }
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Continuous offline playback handlers
  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoError = () => {
    if (videoRef.current && videoSrc) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoPause = () => {
    // Keep continuous loop playing unless intentionally paused
    if (videoReady && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Keep alive loop monitor: if network drops or browser pauses video, immediately resume
  useEffect(() => {
    const keepAlive = setInterval(() => {
      if (videoRef.current && videoReady && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }, 2000);

    const handleOffline = () => {
      console.log('Network offline: continuous loop running from memory blob.');
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('offline', handleOffline);
    return () => {
      clearInterval(keepAlive);
      window.removeEventListener('offline', handleOffline);
    };
  }, [videoReady]);

  return (
    <div className="space-y-6 pb-2 overflow-hidden w-full select-none">
      
      {/* CINEMATIC HERO SECTION */}
      <section className="relative min-h-[65vh] sm:min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12 rounded-2xl sm:rounded-3xl border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.25)] hud-border overflow-hidden bg-black/40">
        
        {/* BGMI In-Memory Blob Video Stream (Continuous loop even offline) */}
        {videoSrc && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              preload="auto"
              onCanPlay={handleCanPlay}
              onLoadedData={handleCanPlay}
              onEnded={handleVideoEnded}
              onError={handleVideoError}
              onPause={handleVideoPause}
              className={`w-full h-full object-cover scale-100 filter brightness-95 contrast-105 saturate-110 transition-opacity duration-700 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Bottom Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/30"></div>
            <div className="absolute inset-0 bg-black/15"></div>
          </div>
        )}

        {/* Ambient Subtle Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none z-0"></div>

        {/* STAGE 1: TACTICAL SKELETON LOADER (Visible first before video is ready) */}
        {!videoReady && (
          <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-pulse">
            {/* Scanline sweep line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent animate-scanline pointer-events-none"></div>

            {/* Skeleton Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-500/60 text-xs sm:text-sm font-mono tracking-widest animate-tactical-shimmer">
              <Cpu className="w-3.5 h-3.5 animate-spin text-amber-400 flex-shrink-0" />
              <span>INITIALIZING SYSTEM FEED...</span>
            </div>

            {/* Skeleton Title Placeholder */}
            <div className="space-y-3 sm:space-y-4">
              <div className="h-10 sm:h-16 w-3/4 max-w-lg mx-auto rounded-2xl bg-slate-800/80 animate-tactical-shimmer"></div>
              <div className="h-8 sm:h-14 w-2/3 max-w-md mx-auto rounded-2xl bg-amber-500/20 animate-tactical-shimmer border border-amber-500/20"></div>
            </div>

            {/* Tactical Stream Progress Bar */}
            <div className="max-w-xs sm:max-w-sm mx-auto space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  BUFFERING BGMI FEED
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-amber-500/30">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(5, progress)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: THE REST (Hero Title & Presenter, Revealed once video is ready) */}
        {videoReady && (
          <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-cyber-reveal">
            
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
        )}

      </section>

      {/* CONTINUOUS MOVING TICKER MARQUEE (Skeleton while loading, Full Marquee once ready) */}
      {!videoReady ? (
        <div className="w-full bg-amber-500/10 py-2.5 sm:py-3 border-y border-amber-500/20 text-center animate-pulse flex items-center justify-center">
          <span className="font-mono text-xs sm:text-sm text-amber-400/70 tracking-widest uppercase">
            ✦ LOADING TOURNAMENT BROADCAST FEED ✦ 25-SLOT CUSTOM ROOMS ✦ DATA SCIENCE CLUB ✦
          </span>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 py-2.5 sm:py-3 text-black font-display font-black text-xs sm:text-sm tracking-widest uppercase overflow-hidden shadow-2xl border-y border-amber-400/40 select-none animate-cyber-reveal">
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
      )}

      {/* CALL TO ACTION BANNER (Skeleton while loading, interactive once ready) */}
      {!videoReady ? (
        <section className="w-full px-2 sm:px-4">
          <div className="rounded-2xl sm:rounded-3xl bg-[#0d1624]/60 p-6 sm:p-10 border border-slate-800 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="h-3 w-40 bg-slate-800 rounded"></div>
              <div className="h-7 w-72 sm:w-96 bg-slate-800 rounded-xl"></div>
              <div className="h-4 w-60 sm:w-80 bg-slate-800/60 rounded"></div>
            </div>
            <div className="h-12 w-48 bg-slate-800 rounded-xl"></div>
          </div>
        </section>
      ) : (
        <section className="w-full px-2 sm:px-4 animate-cyber-reveal">
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
      )}

    </div>
  );
}
