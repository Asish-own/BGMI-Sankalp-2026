import React, { useState, useEffect, useMemo } from 'react';
import { Gamepad2, Key, MapPin, Users, Copy, Check, Radio, Flame, Sparkles, Play, ShieldAlert } from 'lucide-react';

// Play futuristic countdown beep sound using HTML5 Web Audio API
const playBeep = (freq = 600, duration = 0.15) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context fallback if blocked
  }
};

export default function PublicMatchView({ activeMatch, onStartMatch }) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Sort participating teams by slot number ascending
  const sortedTeams = useMemo(() => {
    if (!activeMatch?.participatingTeams) return [];
    return [...activeMatch.participatingTeams].sort((a, b) => (a.slotNumber || 0) - (b.slotNumber || 0));
  }, [activeMatch]);

  // 10-Second Countdown State
  const [countdown, setCountdown] = useState(null);
  const [isLiveCountdownActive, setIsLiveCountdownActive] = useState(false);

  // Synchronize with match status
  useEffect(() => {
    if (activeMatch && activeMatch.status === 'LIVE' && !isLiveCountdownActive && countdown === null) {
      setIsLiveCountdownActive(true);
      setCountdown(10);
      playBeep(800, 0.2);
    }
  }, [activeMatch]);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        const nextVal = countdown - 1;
        setCountdown(nextVal);
        if (nextVal > 0) {
          playBeep(700 + (10 - nextVal) * 40, 0.15);
        } else {
          playBeep(1200, 0.5);
        }
      }, 1000);
    } else if (countdown === 0) {
      timer = setTimeout(() => {
        setCountdown(null);
        setIsLiveCountdownActive(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  // If no match or match is in DRAFT state
  if (!activeMatch || activeMatch.status === 'DRAFT') {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center glass-panel p-12 rounded-3xl border border-slate-800 space-y-4 hud-border">
        <Gamepad2 className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
        <h2 className="font-display font-black text-2xl text-white tracking-wide">
          {activeMatch?.status === 'DRAFT' ? 'MATCH SETUP IN PROGRESS BY ADMIN' : 'NO ACTIVE MATCH PUBLISHED'}
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          {activeMatch?.status === 'DRAFT'
            ? 'Tournament Admin is configuring room slots and credentials. Room details will be revealed live universally as soon as published!'
            : 'Match credentials and slot numbers will appear here live once the tournament admin creates and publishes a room.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-8 relative">
      
      {/* 10-SECOND LIVE COUNTDOWN OVERLAY */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-6 animate-countdown">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-extrabold text-sm uppercase tracking-widest animate-pulse">
              <Radio className="w-4 h-4" /> LIVE MATCH STARTING
            </div>

            {countdown > 0 ? (
              <div>
                <div className="font-display font-black text-9xl sm:text-[180px] text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-500 to-orange-600 drop-shadow-[0_0_50px_rgba(245,158,11,0.6)]">
                  {countdown}
                </div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-white tracking-widest mt-4">
                  GET READY SURVIVORS!
                </div>
              </div>
            ) : (
              <div>
                <div className="font-display font-black text-6xl sm:text-8xl text-emerald-400 tracking-wider animate-bounce drop-shadow-[0_0_60px_rgba(52,211,153,0.8)]">
                  🚀 MATCH IN PROGRESS!
                </div>
                <p className="text-slate-300 text-lg font-bold mt-4">Good luck and have fun!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Match Header Banner */}
      <div className="relative overflow-hidden glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 hud-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
                Official Live Room
              </span>
              {activeMatch.status === 'LIVE' && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black rounded-full uppercase tracking-widest animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> LIVE IN PROGRESS
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
              {activeMatch.name}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-slate-300 text-sm">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Map: <strong className="text-amber-400 font-bold">{activeMatch.map}</strong></span>
              <span className="text-slate-600">•</span>
              <span>{activeMatch.participatingTeams?.length || 0} Teams Participating</span>
            </div>
          </div>

          {/* Room ID & Password Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            
            {/* Room ID Card */}
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ROOM ID</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono font-black text-xl text-white tracking-wider">
                  {activeMatch.roomId}
                </span>
                <button
                  onClick={() => copyToClipboard(activeMatch.roomId, 'id')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-black transition"
                  title="Copy Room ID"
                >
                  {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Room Password Card */}
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ROOM PASSWORD</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono font-black text-xl text-amber-400 tracking-wider">
                  {activeMatch.roomPassword}
                </span>
                <button
                  onClick={() => copyToClipboard(activeMatch.roomPassword, 'pass')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-black transition"
                  title="Copy Password"
                >
                  {copiedPass ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SLOT NUMBERS BY TEAM LEADER NAME SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white tracking-wide flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" /> OFFICIAL SLOT ARRANGEMENT BY TEAM LEADER
            </h2>
            <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Join exact slot number in BGMI custom room
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Slot 1 Reserved */}
            <div className="p-4 bg-[#0a0d14] rounded-2xl border border-slate-800/80 opacity-75 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 font-display font-black text-base flex items-center justify-center">
                  #1
                </div>
                <div>
                  <div className="font-bold text-slate-300 text-sm">Caster / Spectator</div>
                  <div className="text-[11px] text-slate-500">Tournament Host</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">RESERVED</span>
            </div>

            {/* Participating Teams Slots */}
            {sortedTeams.map((pt) => (
              <div 
                key={pt.teamId}
                className="p-4 bg-[#0d121c] rounded-2xl border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-black font-display font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                    #{pt.slotNumber}
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-white text-base group-hover:text-amber-400 transition">
                      {pt.teamName}
                    </div>
                    <div className="text-xs text-slate-400">
                      Leader: <strong className="text-amber-300">{pt.leaderName}</strong> ({pt.leaderYear} Year)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-extrabold uppercase text-slate-500">JOIN SLOT</div>
                  <div className="font-mono font-bold text-amber-400 text-sm">SLOT {pt.slotNumber}</div>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}
