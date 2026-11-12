import React, { useState, useEffect } from 'react';
import { Calendar, Flame, MapPin, Settings2, CheckCircle2, Clock } from 'lucide-react';
import { getDefaultEventDate, DEFAULT_VENUE } from '../utils/storage';

export default function EventCountdown({
  eventDateIso,
  eventVenue = DEFAULT_VENUE,
  isAdmin = false,
  onUpdateEventConfig
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventDay: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [inputVenue, setInputVenue] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const targetDateStr = eventDateIso || getDefaultEventDate();
  const currentVenue = eventVenue || DEFAULT_VENUE;

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEventDay: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isEventDay: false });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  const handleOpenEdit = () => {
    // Format targetDateStr for datetime-local input (YYYY-MM-DDTHH:mm)
    try {
      const d = new Date(targetDateStr);
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      setInputDate(localISOTime);
    } catch (e) {
      setInputDate('');
    }
    setInputVenue(currentVenue);
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (onUpdateEventConfig) {
      const newIso = inputDate ? new Date(inputDate).toISOString() : targetDateStr;
      const newVenue = inputVenue.trim() || currentVenue;
      await onUpdateEventConfig(newIso, newVenue);
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(false);
      }, 1000);
    }
  };

  const formattedDate = new Date(targetDateStr).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="relative overflow-hidden glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/40 shadow-2xl hud-border">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center space-y-6">
        
        {/* Header Badge & Admin Edit Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4 animate-bounce text-orange-400" /> TOURNAMENT MATCH DAY COUNTDOWN
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-extrabold uppercase tracking-wider transition shadow-md ml-auto"
            >
              <Settings2 className="w-3.5 h-3.5" /> Admin: Change Date, Time & Venue
            </button>
          )}
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-wider">
          THE BATTLE BEGINS IN
        </h2>

        {/* Countdown Timer Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
          {/* Days */}
          <div className="bg-[#0b0e14]/90 p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-amber-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-amber-400 group-hover:scale-105 transition">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">DAYS</div>
          </div>

          {/* Hours */}
          <div className="bg-[#0b0e14]/90 p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-amber-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-amber-400 group-hover:scale-105 transition">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">HOURS</div>
          </div>

          {/* Minutes */}
          <div className="bg-[#0b0e14]/90 p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-amber-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-amber-400 group-hover:scale-105 transition">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">MINUTES</div>
          </div>

          {/* Seconds */}
          <div className="bg-[#0b0e14]/90 p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-orange-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-orange-500 group-hover:scale-105 transition">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">SECONDS</div>
          </div>
        </div>

        {/* Live Status or Date & Venue Schedule Details */}
        {timeLeft.isEventDay ? (
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-black uppercase tracking-widest animate-pulse">
            🚀 TODAY IS MATCH DAY! JOIN YOUR ASSIGNED SLOT IN MATCH ROOM TAB
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-slate-800/80">
            {/* Date & Time */}
            <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium">
              <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Event Date & Time: <strong className="text-white font-bold">{formattedDate}</strong>
              </span>
            </div>

            {/* Venue Display */}
            <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
              <span>
                Tournament Venue: <strong className="text-emerald-400 font-bold">{currentVenue}</strong>
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Admin Schedule & Venue Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 relative"
          >
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-lg text-white">
                UPDATE EVENT SCHEDULE & VENUE
              </h3>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Schedule & Venue Saved Successfully!
              </div>
            )}

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Tournament Venue *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campus Main Auditorium & Esports Arena"
                  value={inputVenue}
                  onChange={(e) => setInputVenue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                Save Schedule & Venue
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
