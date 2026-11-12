import React, { useState } from 'react';
import { User, Phone, Hash, Shield, Users, CheckCircle, AlertCircle, Sparkles, GraduationCap, BookOpen } from 'lucide-react';

const STREAMS = ['BTECH', 'BSC', 'BCA', 'Others'];
const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function RegistrationForm({ onAddTeam, onViewTeams }) {
  const [teamName, setTeamName] = useState('');
  
  // Leader details
  const [leaderName, setLeaderName] = useState('');
  const [leaderStream, setLeaderStream] = useState('BTECH');
  const [customStream, setCustomStream] = useState('');
  const [leaderYear, setLeaderYear] = useState('1st Year');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderBgmiId, setLeaderBgmiId] = useState('');

  // 3 Squad members (Leader + 3 Members = 4 Total Squad)
  const [members, setMembers] = useState([
    { name: '', bgmiId: '' },
    { name: '', bgmiId: '' },
    { name: '', bgmiId: '' }
  ]);

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!teamName.trim()) {
      setError('Please enter a unique Team Name.');
      return;
    }
    if (!leaderName.trim()) {
      setError('Please enter the Team Leader\'s Full Name.');
      return;
    }
    if (leaderStream === 'Others' && !customStream.trim()) {
      setError('Please specify your Stream / Course name.');
      return;
    }
    if (!leaderYear) {
      setError('Please select an Academic Year.');
      return;
    }
    if (!leaderPhone.trim() || leaderPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit Phone Number for the Team Leader.');
      return;
    }
    if (!leaderBgmiId.trim()) {
      setError('Please enter the Team Leader\'s BGMI Character ID.');
      return;
    }

    // Validate 3 squad members
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) {
        setError(`Please enter the full name for Player ${i + 2}.`);
        return;
      }
      if (!members[i].bgmiId.trim()) {
        setError(`Please enter the BGMI ID for Player ${i + 2}.`);
        return;
      }
    }

    const finalStream = leaderStream === 'Others' ? customStream.trim() : leaderStream;

    const newTeam = {
      id: 'team-' + Date.now(),
      teamName: teamName.trim(),
      leaderName: leaderName.trim(),
      leaderStream: finalStream,
      leaderYear: leaderYear,
      leaderPhone: leaderPhone.trim(),
      leaderBgmiId: leaderBgmiId.trim(),
      leaderIgn: leaderBgmiId.trim(),
      members: members.map((m) => ({
        name: m.name.trim(),
        bgmiId: m.bgmiId.trim(),
        ign: m.bgmiId.trim()
      })),
      registeredAt: new Date().toISOString()
    };

    onAddTeam(newTeam);
    setSubmitted(true);
  };

  const resetForm = () => {
    setTeamName('');
    setLeaderName('');
    setLeaderStream('BTECH');
    setCustomStream('');
    setLeaderYear('1st Year');
    setLeaderPhone('');
    setLeaderBgmiId('');
    setMembers([
      { name: '', bgmiId: '' },
      { name: '', bgmiId: '' },
      { name: '', bgmiId: '' }
    ]);
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    const finalStream = leaderStream === 'Others' ? customStream.trim() : leaderStream;
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 glass-panel rounded-3xl border border-amber-500/30 text-center shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 animate-bounce">
          <CheckCircle className="w-10 h-10 text-black" />
        </div>
        <h2 className="font-display font-extrabold text-3xl text-white mb-2 tracking-wide">
          REGISTRATION CONFIRMED! 🎮
        </h2>
        <p className="text-slate-300 mb-2 text-base max-w-md mx-auto">
          Team <span className="text-amber-400 font-bold">{teamName}</span> has been successfully registered!
        </p>
        <p className="text-slate-400 text-xs mb-6">
          Leader: <strong className="text-white">{leaderName}</strong> ({finalStream} - {leaderYear})
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition border border-slate-700"
          >
            Register Another Team
          </button>
          <button
            onClick={onViewTeams}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold transition shadow-lg shadow-amber-500/20"
          >
            View All Registered Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#161f30] to-slate-900 p-8 border border-slate-800 shadow-xl mb-8 hud-border">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Assult Survivors • Data Science Club
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
              SQUAD <span className="text-amber-400">REGISTRATION</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Register your 4-player BGMI squad for Assult Survivors presented by Data Science Club.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#0d121c] p-4 rounded-2xl border border-slate-800">
            <Users className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Squad Composition</div>
              <div className="text-sm font-bold text-white">1 Leader + 3 Players</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        
        {/* Section 1: Team & Leader Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-lg text-white tracking-wide">
              1. TEAM & LEADER INFORMATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Team Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Team Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Soul Destroyers"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>

            {/* Leader Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" /> Team Leader Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>

            {/* Stream Selection */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Stream / Course *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STREAMS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setLeaderStream(s)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                      leaderStream === s
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-[#0d121c] text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Custom stream input if 'Others' is selected */}
              {leaderStream === 'Others' && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Enter your Stream (e.g. BBA, B.Com, MCA, Diploma...)"
                    value={customStream}
                    onChange={(e) => setCustomStream(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0d121c] border border-amber-500/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-sm"
                    required
                  />
                </div>
              )}
            </div>

            {/* Academic Year Selection */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Academic Year *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACADEMIC_YEARS.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setLeaderYear(yr)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                      leaderYear === yr
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-[#0d121c] text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> Team Leader Phone Number *
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={leaderPhone}
                onChange={(e) => setLeaderPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>

            {/* Leader BGMI ID */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" /> Leader BGMI ID *
              </label>
              <input
                type="text"
                placeholder="BGMI Character ID (e.g. 5124893012)"
                value={leaderBgmiId}
                onChange={(e) => setLeaderBgmiId(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>

          </div>
        </div>

        {/* Section 2: Other 3 Players Info */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-lg text-white tracking-wide">
                2. TEAM INFO (OTHER 3 PLAYERS)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">3 Squad Players Required</span>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl bg-[#0d121c] border border-slate-800 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                    PLAYER {index + 2} INFO
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                    Player {index + 2} of 4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Player Name *</label>
                    <input
                      type="text"
                      placeholder={`Player ${index + 2} Name`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#121824] border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">BGMI ID *</label>
                    <input
                      type="text"
                      placeholder={`Player ${index + 2} BGMI Character ID`}
                      value={member.bgmiId}
                      onChange={(e) => handleMemberChange(index, 'bgmiId', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#121824] border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/20"
          >
            Confirm & Register Squad
          </button>
        </div>

      </form>
    </div>
  );
}
