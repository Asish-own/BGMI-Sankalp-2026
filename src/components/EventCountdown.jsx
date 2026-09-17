import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { getDefaultEventDate } from '../utils/storage';

export default function EventCountdown({ eventDateIso, onUpdateEventDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isEventDay: false });
  const [editingDate, setEditingDate] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');

  const targetDateStr = eventDateIso || getDefaultEventDate();

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

  const handleSaveDate = (e) => {
    e.preventDefault();
    if (customDateInput) {
      onUpdateEventDate(new Date(customDateInput).toISOString());
      setEditingDate(false);
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
    <div className="relative overflow-hidden glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/30 shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
          <Flame className="w-4 h-4 animate-bounce text-orange-400" /> TOURNAMENT MATCH DAY COUNTDOWN
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-wider">
          THE BATTLE BEGINS IN
        </h2>

        {/* Countdown Timer Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
          
          {/* Days */}
          <div className="bg-[#0b0e14] p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-amber-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-amber-400 group-hover:scale-105 transition">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">DAYS</div>
          </div>

          {/* Hours */}
          <div className="bg-[#0b0e14] p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-amber-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-amber-400 group-hover:scale-105 transition">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">HOURS</div>
          </div>

          {/* Minutes */}
          <div className="bg-[#0b0e14] p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-amber-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-amber-400 group-hover:scale-105 transition">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">MINUTES</div>
          </div>

          {/* Seconds */}
          <div className="bg-[#0b0e14] p-5 rounded-3xl border border-slate-800 shadow-inner group hover:border-amber-500/40 transition">
            <div className="font-display font-black text-4xl sm:text-6xl text-orange-500 group-hover:scale-105 transition">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">SECONDS</div>
          </div>

        </div>

        {/* Live Status Badge */}
        {timeLeft.isEventDay ? (
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-black uppercase tracking-widest animate-pulse">
            🚀 TODAY IS MATCH DAY! MODERATORS TAKE ATTENDANCE BELOW
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-medium">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Scheduled Match Date: <strong className="text-white">{formattedDate}</strong></span>
            
            <button
              onClick={() => setEditingDate(!editingDate)}
              className="text-amber-400 hover:underline font-bold ml-2 text-xs"
            >
              {editingDate ? 'Cancel' : '(Set Custom Date)'}
            </button>
          </div>
        )}

        {/* Date Picker Form Modal/Inline */}
        {editingDate && (
          <form onSubmit={handleSaveDate} className="max-w-md mx-auto p-4 bg-[#0c1019] rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
            <input
              type="datetime-local"
              onChange={(e) => setCustomDateInput(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition"
            >
              Update Date
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
