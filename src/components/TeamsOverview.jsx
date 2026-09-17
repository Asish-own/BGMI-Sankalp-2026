import React, { useState } from 'react';
import { Users, Search, Phone, Hash, Shield, GraduationCap, ChevronDown, ChevronUp, UserCheck, Sparkles, Filter, Edit, Save } from 'lucide-react';

export default function TeamsOverview({ session = { role: 'user' }, teams = [], onUpdateTeam, onNavigateToRegister }) {
  const isAdmin = session.role === 'admin';
  const canEdit = isAdmin || (session.role === 'moderator' && session.moderatorObj?.permissions?.editTeams);

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  // Edit Team Modal State
  const [editingTeam, setEditingTeam] = useState(null);

  // Compute Statistics
  const totalTeams = teams.length;
  const firstYearCount = teams.filter(t => t.leaderYear === '1st').length;
  const secondYearCount = teams.filter(t => t.leaderYear === '2nd').length;
  const totalPlayers = totalTeams * 4;

  const firstYearPercent = totalTeams > 0 ? Math.round((firstYearCount / totalTeams) * 100) : 0;
  const secondYearPercent = totalTeams > 0 ? Math.round((secondYearCount / totalTeams) * 100) : 0;

  // Filtered Teams List
  const filteredTeams = teams.filter(t => {
    const matchesSearch = 
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.leaderIgn && t.leaderIgn.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesYear = yearFilter === 'ALL' || t.leaderYear === yearFilter;
    return matchesSearch && matchesYear;
  });

  const toggleExpand = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const handleSaveTeamEdit = (e) => {
    e.preventDefault();
    if (!editingTeam) return;
    onUpdateTeam(editingTeam);
    setEditingTeam(null);
  };

  return (
    <div className="max-w-7xl mx-auto my-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#121927] to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl hud-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Club Directory & Roster Stats
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
            REGISTERED <span className="text-amber-400">SURVIVAL SQUADS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time year-wise registration stats and full 4-player squad rosters.
          </p>
        </div>

        <button
          onClick={onNavigateToRegister}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition self-start md:self-auto"
        >
          + Register New Squad
        </button>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Teams Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Registered Teams</div>
          <div className="font-display font-black text-4xl text-white mt-3 group-hover:text-amber-400 transition">
            {totalTeams}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">Ready for tournament matches</div>
        </div>

        {/* 1st Year Leaders Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">1st Year Leader Teams</div>
          <div className="font-display font-black text-4xl text-cyan-400 mt-3">
            {firstYearCount} <span className="text-sm text-slate-500 font-normal">({firstYearPercent}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${firstYearPercent}%` }}></div>
          </div>
        </div>

        {/* 2nd Year Leaders Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-orange-500/40 transition">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">2nd Year Leader Teams</div>
          <div className="font-display font-black text-4xl text-orange-400 mt-3">
            {secondYearCount} <span className="text-sm text-slate-500 font-normal">({secondYearPercent}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-orange-400 h-full rounded-full transition-all duration-500" style={{ width: `${secondYearPercent}%` }}></div>
          </div>
        </div>

        {/* Total Players Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="absolute right-3 top-3 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Active Players</div>
          <div className="font-display font-black text-4xl text-emerald-400 mt-3">
            {totalPlayers}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">4 Players per Squad</div>
        </div>

      </div>

      {/* Search & Year Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111723] p-4 rounded-2xl border border-slate-800">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by team or leader name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0b0e14] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {/* Year Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Year:
          </span>
          {['ALL', '1st', '2nd'].map((year) => (
            <button
              key={year}
              onClick={() => setYearFilter(year)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                yearFilter === year
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#0b0e14] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {year === 'ALL' ? 'All Years' : `${year} Year`}
            </button>
          ))}
        </div>

      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-white">No Teams Found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search query or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const isExpanded = expandedTeamId === team.id;
            return (
              <div
                key={team.id}
                className={`glass-panel rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'border-amber-500/50 shadow-xl shadow-amber-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Team Card Header */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
                          team.leaderYear === '1st'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        }`}>
                          {team.leaderYear} Year Leader
                        </span>
                      </div>
                      <h3 className="font-display font-black text-xl text-white tracking-wide">
                        {team.teamName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <button
                          onClick={() => setEditingTeam({ ...team })}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-black transition"
                          title="Edit Team Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-display font-bold text-amber-400">
                        #{team.id.replace('team-', '')}
                      </div>
                    </div>
                  </div>

                  {/* Leader Info Summary */}
                  <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-amber-400">👑 Leader:</span>
                      <span className="font-semibold text-white">{team.leaderName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> Phone:</span>
                      <span className="font-mono text-slate-200">{team.leaderPhone}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1"><Hash className="w-3 h-3 text-slate-500" /> BGMI ID / IGN:</span>
                      <span className="font-mono text-amber-400 font-bold">{team.leaderBgmiId} ({team.leaderIgn || 'N/A'})</span>
                    </div>
                  </div>

                  {/* Expand Squad Members Toggle */}
                  <button
                    onClick={() => toggleExpand(team.id)}
                    className="w-full flex items-center justify-between py-2 px-4 bg-slate-900/80 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition border border-slate-800"
                  >
                    <span>Squad Roster (4 Players)</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>

                {/* Expanded Roster Details */}
                {isExpanded && (
                  <div className="bg-[#0d121c] p-6 border-t border-slate-800 space-y-3 animate-fadeIn">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Complete 4-Player Roster
                    </div>

                    {/* Leader */}
                    <div className="p-3 bg-[#131926] rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-400">👑 {team.leaderName}</span>
                        <div className="text-[10px] text-slate-400">Team Leader • {team.leaderYear} Year</div>
                      </div>
                      <div className="text-right font-mono text-[11px] text-amber-300">
                        {team.leaderBgmiId}
                      </div>
                    </div>

                    {/* Member 2, 3, 4 */}
                    {team.members.map((m, idx) => (
                      <div key={idx} className="p-3 bg-[#131926] rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-white">Player {idx + 2}: {m.name}</span>
                          <div className="text-[10px] text-slate-400">IGN: {m.ign || m.name}</div>
                        </div>
                        <div className="text-right font-mono text-[11px] text-slate-300">
                          {m.bgmiId}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* EDIT TEAM MODAL */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveTeamEdit} className="glass-panel max-w-xl w-full p-6 rounded-3xl border border-amber-500/40 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-amber-400" /> EDIT SQUAD DETAILS
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Team Name</label>
                <input
                  type="text"
                  value={editingTeam.teamName}
                  onChange={(e) => setEditingTeam({ ...editingTeam, teamName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c1018] border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Leader Name</label>
                <input
                  type="text"
                  value={editingTeam.leaderName}
                  onChange={(e) => setEditingTeam({ ...editingTeam, leaderName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c1018] border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Leader Phone</label>
                <input
                  type="text"
                  value={editingTeam.leaderPhone}
                  onChange={(e) => setEditingTeam({ ...editingTeam, leaderPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c1018] border border-slate-700 rounded-xl text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Leader BGMI ID</label>
                <input
                  type="text"
                  value={editingTeam.leaderBgmiId}
                  onChange={(e) => setEditingTeam({ ...editingTeam, leaderBgmiId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c1018] border border-slate-700 rounded-xl text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 text-black font-extrabold rounded-xl text-xs uppercase shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
