import React, { useState } from 'react';
import { User, Phone, Hash, Shield, Users, CheckCircle, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

export default function RegistrationForm({ onAddTeam, onViewTeams }) {
  const [teamName, setTeamName] = useState('');
  
  // Leader details
  const [leaderName, setLeaderName] = useState('');
  const [leaderYear, setLeaderYear] = useState('1st');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderBgmiId, setLeaderBgmiId] = useState('');
  const [leaderIgn, setLeaderIgn] = useState('');

  // 3 Squad members (Leader + 3 Members = 4 Total)
  const [members, setMembers] = useState([
    { name: '', bgmiId: '', ign: '' },
    { name: '', bgmiId: '', ign: '' },
    { name: '', bgmiId: '', ign: '' }
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
      setError('Please enter the Team Leader\'s Name.');
      return;
    }
    if (!leaderPhone.trim() || leaderPhone.length < 10) {
      setError('Please enter a valid 10-digit Phone Number for the Team Leader.');
      return;
    }
    if (!leaderBgmiId.trim()) {
      setError('Please enter the Leader\'s BGMI Character ID / IGN.');
      return;
    }

    // Validate 3 squad members
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) {
        setError(`Please enter the name for Member ${i + 2}.`);
        return;
      }
      if (!members[i].bgmiId.trim()) {
        setError(`Please enter the BGMI ID / IGN for Member ${i + 2}.`);
        return;
      }
    }

    const newTeam = {
      id: 'team-' + Date.now(),
      teamName: teamName.trim(),
      leaderName: leaderName.trim(),
      leaderYear: leaderYear,
      leaderPhone: leaderPhone.trim(),
      leaderBgmiId: leaderBgmiId.trim(),
      leaderIgn: leaderIgn.trim() || leaderName.trim(),
      members: members.map((m, idx) => ({
        name: m.name.trim(),
        bgmiId: m.bgmiId.trim(),
        ign: m.ign.trim() || m.name.trim()
      })),
      registeredAt: new Date().toISOString()
    };

    onAddTeam(newTeam);
    setSubmitted(true);
  };

  const resetForm = () => {
    setTeamName('');
    setLeaderName('');
    setLeaderYear('1st');
    setLeaderPhone('');
    setLeaderBgmiId('');
    setLeaderIgn('');
    setMembers([
      { name: '', bgmiId: '', ign: '' },
      { name: '', bgmiId: '', ign: '' },
      { name: '', bgmiId: '', ign: '' }
    ]);
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 glass-panel rounded-3xl border border-amber-500/30 text-center shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 animate-bounce">
          <CheckCircle className="w-10 h-10 text-black" />
        </div>
        <h2 className="font-display font-extrabold text-3xl text-white mb-2 tracking-wide">
          REGISTRATION CONFIRMED! 🎮
        </h2>
        <p className="text-slate-300 mb-6 text-base max-w-md mx-auto">
          Team <span className="text-amber-400 font-bold">{teamName}</span> (Led by {leaderName} - {leaderYear} Year) has been successfully registered with all 4 squad members!
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#161f30] to-slate-900 p-8 border border-slate-800 shadow-xl mb-8">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Club Tournament Portal
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
              SQUAD <span className="text-amber-400">REGISTRATION</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Register your 4-player BGMI squad. Team Leaders can be in <span className="text-amber-400 font-semibold">1st Year</span> or <span className="text-amber-400 font-semibold">2nd Year</span>. Ensure accurate BGMI ID for match room invites.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#0d121c] p-4 rounded-2xl border border-slate-800">
            <Users className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Squad Rule</div>
              <div className="text-sm font-bold text-white">1 Leader + 3 Members</div>
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
                <User className="w-3.5 h-3.5 text-amber-400" /> Team Leader Full Name *
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

            {/* Leader Year */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Leader Academic Year *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLeaderYear('1st')}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm border transition flex items-center justify-center gap-2 ${
                    leaderYear === '1st'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-[#0d121c] text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <UserCheck className="w-4 h-4" /> 1st Year
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderYear('2nd')}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm border transition flex items-center justify-center gap-2 ${
                    leaderYear === '2nd'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-[#0d121c] text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <UserCheck className="w-4 h-4" /> 2nd Year
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> Leader Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={leaderPhone}
                onChange={(e) => setLeaderPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>

            {/* BGMI Character ID / IGN */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" /> Leader BGMI Character ID / In-Game Name (IGN) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="BGMI Character ID (e.g. 5124893012)"
                  value={leaderBgmiId}
                  onChange={(e) => setLeaderBgmiId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  required
                />
                <input
                  type="text"
                  placeholder="In-Game Name (IGN) (e.g. APEX_Aarav)"
                  value={leaderIgn}
                  onChange={(e) => setLeaderIgn(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: 3 Additional Squad Members */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-lg text-white tracking-wide">
                2. SQUAD MEMBERS (3 REQUIRED)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Total Squad = 4 Players</span>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl bg-[#0d121c] border border-slate-800 space-y-3 relative group hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                    MEMBER {index + 2} DETAILS
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                    Player {index + 2} of 4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      placeholder={`Member ${index + 2} Name`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#121824] border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">BGMI Character ID / IGN *</label>
                    <input
                      type="text"
                      placeholder={`Member ${index + 2} BGMI ID or IGN`}
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
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-lg tracking-wider uppercase transition-all duration-200 shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99]"
          >
            🔥 Complete Squad Registration
          </button>
        </div>

      </form>
    </div>
  );
}
