import React, { useState } from 'react';
import { CheckCircle2, XCircle, Search, UserCheck, ShieldAlert, Sparkles, Filter, Users } from 'lucide-react';

export default function ModeratorAttendance({ teams = [], attendance = {}, onToggleAttendance, onMarkAll }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('ALL');

  const totalTeams = teams.length;
  const presentCount = teams.filter(t => attendance[t.id] === true).length;
  const absentCount = totalTeams - presentCount;

  // Filter teams by Team Leader name or Team name
  const filteredTeams = teams.filter(t => {
    const matchesSearch = 
      t.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'ALL' || t.leaderYear === filterYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="max-w-5xl mx-auto my-8 space-y-6">
      
      {/* Moderator Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#151c2a] to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" /> Event Day Moderator Portal
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
            TEAM <span className="text-emerald-400">ATTENDANCE CHECKLIST</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Moderators: Mark team attendance on event day by <strong className="text-white">Team Leader Name</strong>. Only present teams can be placed in match room slots.
          </p>
        </div>

        {/* Present Summary Counter */}
        <div className="flex items-center gap-3 bg-[#0c1018] p-4 rounded-2xl border border-slate-800">
          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-xs text-slate-400 font-bold uppercase">Present</div>
            <div className="font-display font-black text-2xl text-emerald-400">{presentCount}</div>
          </div>
          <div className="text-center px-3">
            <div className="text-xs text-slate-400 font-bold uppercase">Absent</div>
            <div className="font-display font-black text-2xl text-red-400">{absentCount}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111723] p-4 rounded-2xl border border-slate-800">
        
        {/* Search by Leader Name */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Team Leader Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0b0e14] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
          />
        </div>

        {/* Batch Actions & Year Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onMarkAll(true)}
            className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={() => onMarkAll(false)}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold rounded-xl transition"
          >
            ✕ Mark All Absent
          </button>
        </div>

      </div>

      {/* Attendance Checklist Table/List */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0e1420] text-slate-400 text-xs font-extrabold uppercase tracking-wider border-b border-slate-800">
                <th className="py-4 px-6">Team Leader Name</th>
                <th className="py-4 px-6">Year</th>
                <th className="py-4 px-6">Team Name</th>
                <th className="py-4 px-6">Leader Phone / BGMI ID</th>
                <th className="py-4 px-6 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No teams matching leader search query.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => {
                  const isPresent = attendance[team.id] === true;
                  return (
                    <tr 
                      key={team.id}
                      className={`transition ${
                        isPresent ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-red-500/5 hover:bg-red-500/10'
                      }`}
                    >
                      {/* Leader Name */}
                      <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-extrabold text-xs">
                          {team.leaderName.charAt(0)}
                        </span>
                        <div>
                          <div className="text-white font-bold">{team.leaderName}</div>
                          <div className="text-[10px] text-slate-400">IGN: {team.leaderIgn || 'N/A'}</div>
                        </div>
                      </td>

                      {/* Year */}
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                          team.leaderYear === '1st' 
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                        }`}>
                          {team.leaderYear} Year
                        </span>
                      </td>

                      {/* Team Name */}
                      <td className="py-4 px-6 font-display font-extrabold text-amber-400">
                        {team.teamName}
                      </td>

                      {/* Phone & BGMI ID */}
                      <td className="py-4 px-6 font-mono text-xs text-slate-300">
                        <div>{team.leaderPhone}</div>
                        <div className="text-[11px] text-slate-400">ID: {team.leaderBgmiId}</div>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => onToggleAttendance(team.id)}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md ${
                            isPresent
                              ? 'bg-emerald-500 text-black shadow-emerald-500/20 scale-105'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                          }`}
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> PRESENT
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" /> ABSENT
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
