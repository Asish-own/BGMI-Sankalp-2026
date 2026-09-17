import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Map, 
  Key, 
  Shuffle, 
  Play, 
  CheckCircle, 
  Trophy, 
  AlertCircle, 
  Eye, 
  Sparkles,
  Gamepad,
  Flame,
  Award,
  Swords,
  Lock,
  Filter,
  Users,
  CheckSquare,
  Square
} from 'lucide-react';
import { calculateMatchScore } from '../utils/scoring';

export const BGMI_MAPS = [
  { id: 'Erangel', name: 'Erangel', desc: 'Classic 8x8 Tactical Island', imageBg: 'from-amber-950 to-slate-900' },
  { id: 'Miramar', name: 'Miramar', desc: 'Desert Sniping Grounds', imageBg: 'from-yellow-950 to-amber-950' },
  { id: 'Sanhok', name: 'Sanhok', desc: 'Fast-Paced Jungle Action', imageBg: 'from-emerald-950 to-slate-900' },
  { id: 'Vikendi', name: 'Vikendi', desc: 'Snow Terrain Combat', imageBg: 'from-cyan-950 to-slate-900' },
  { id: 'Nusa', name: 'Nusa', desc: 'Compact 2x2 Resort Island', imageBg: 'from-orange-950 to-red-950' }
];

export default function AdminMatchControl({
  session = { role: 'admin' },
  teams = [],
  attendance = {},
  activeMatch,
  completedMatches = [],
  onCreateMatch,
  onPublishMatch,
  onStartMatch,
  onFinishMatch,
  onCancelMatch
}) {
  const isAdmin = session.role === 'admin';
  const perms = session.moderatorObj?.permissions || {
    matchSetup: true,
    manageLobbies: true,
    startMatch: true,
    endMatch: true,
    enterScores: true
  };

  const canSetup = isAdmin || perms.matchSetup;
  const canLobby = isAdmin || perms.manageLobbies;
  const canStart = isAdmin || perms.startMatch;
  const canEnd = isAdmin || perms.endMatch;
  const canScore = isAdmin || perms.enterScores;

  // Form State
  const [matchTitle, setMatchTitle] = useState('Match #' + (completedMatches.length + 1));
  const [selectedMap, setSelectedMap] = useState('Erangel');
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [isFinalRound, setIsFinalRound] = useState(false);
  const [slotAssignments, setSlotAssignments] = useState({});

  // Team Selection & Filter by Matches Played State
  const [matchesPlayedFilter, setMatchesPlayedFilter] = useState('ALL'); // 'ALL', '0', '1', '2+'
  const [selectedTeamIds, setSelectedTeamIds] = useState(() => {
    // Default select all present teams
    return teams.filter(t => attendance[t.id] === true).map(t => t.id);
  });

  // Score Entry Modal State
  const [showScoreEntry, setShowScoreEntry] = useState(false);
  const [matchResultsInput, setMatchResultsInput] = useState({});

  // Compute matches played per team
  const matchesPlayedMap = useMemo(() => {
    const map = {};
    teams.forEach(t => { map[t.id] = 0; });
    completedMatches.forEach(m => {
      if (m.results) {
        m.results.forEach(r => {
          if (map[r.teamId] !== undefined) {
            map[r.teamId] += 1;
          }
        });
      }
    });
    return map;
  }, [teams, completedMatches]);

  // Present teams
  const presentTeams = useMemo(() => {
    return teams.filter(t => attendance[t.id] === true);
  }, [teams, attendance]);

  // Filtered present teams by matches played
  const filteredPresentTeams = useMemo(() => {
    return presentTeams.filter(t => {
      const count = matchesPlayedMap[t.id] || 0;
      if (matchesPlayedFilter === '0') return count === 0;
      if (matchesPlayedFilter === '1') return count === 1;
      if (matchesPlayedFilter === '2+') return count >= 2;
      return true;
    });
  }, [presentTeams, matchesPlayedMap, matchesPlayedFilter]);

  // Teams selected for this match
  const selectedTeamsList = useMemo(() => {
    return presentTeams.filter(t => selectedTeamIds.includes(t.id));
  }, [presentTeams, selectedTeamIds]);

  // Toggle single team selection
  const handleToggleTeamSelect = (teamId) => {
    if (selectedTeamIds.includes(teamId)) {
      setSelectedTeamIds(selectedTeamIds.filter(id => id !== teamId));
    } else {
      setSelectedTeamIds([...selectedTeamIds, teamId]);
    }
  };

  // Quick Selection Helpers
  const handleSelectFiltered = () => {
    const filteredIds = filteredPresentTeams.map(t => t.id);
    const combined = Array.from(new Set([...selectedTeamIds, ...filteredIds]));
    setSelectedTeamIds(combined);
  };

  const handleSelectZeroMatchesOnly = () => {
    const zeroIds = presentTeams.filter(t => (matchesPlayedMap[t.id] || 0) === 0).map(t => t.id);
    setSelectedTeamIds(zeroIds);
  };

  const handleDeselectAll = () => {
    setSelectedTeamIds([]);
  };

  // Randomize Slot Assignments for Selected Teams
  const handleRandomizeSlots = () => {
    if (!canLobby) {
      alert('Permission Denied: Admin has not granted "Manage Lobbies" permission.');
      return;
    }
    if (selectedTeamsList.length === 0) {
      alert('Please select at least one participating team.');
      return;
    }

    const shuffled = [...selectedTeamsList].sort(() => Math.random() - 0.5);
    const newAssignments = {};

    shuffled.forEach((team, idx) => {
      newAssignments[team.id] = idx + 2;
    });

    setSlotAssignments(newAssignments);
  };

  // Create & Save Match Draft
  const handleCreateMatchSubmit = (e) => {
    e.preventDefault();
    if (!canSetup) {
      alert('Permission Denied: Admin has not granted "Match Setup" permission.');
      return;
    }

    if (!roomId.trim() || !roomPassword.trim()) {
      alert('Please enter Room ID and Room Password.');
      return;
    }

    if (selectedTeamsList.length === 0) {
      alert('No teams selected for this match! Please check team checkboxes below.');
      return;
    }

    let currentSlots = slotAssignments;
    if (Object.keys(currentSlots).length === 0) {
      const shuffled = [...selectedTeamsList].sort(() => Math.random() - 0.5);
      shuffled.forEach((team, idx) => {
        currentSlots[team.id] = idx + 2;
      });
      setSlotAssignments(currentSlots);
    }

    const matchData = {
      id: 'match-' + Date.now(),
      name: matchTitle.trim(),
      map: selectedMap,
      roomId: roomId.trim(),
      roomPassword: roomPassword.trim(),
      isFinalRound: isFinalRound,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      participatingTeams: selectedTeamsList.map(t => ({
        teamId: t.id,
        teamName: t.teamName,
        leaderName: t.leaderName,
        leaderYear: t.leaderYear,
        slotNumber: currentSlots[t.id] || 2
      }))
    };

    onCreateMatch(matchData);
  };

  // Open Score Entry Modal
  const handleOpenScoreEntry = () => {
    if (!canScore) {
      alert('Permission Denied: Admin has not granted "Enter Scores" permission.');
      return;
    }
    if (!activeMatch) return;
    const initialInputs = {};
    activeMatch.participatingTeams.forEach((team, idx) => {
      initialInputs[team.teamId] = {
        position: Math.min(idx + 1, 6),
        kills: 0
      };
    });
    setMatchResultsInput(initialInputs);
    setShowScoreEntry(true);
  };

  // Submit Final Match Results
  const handleSubmitScores = () => {
    if (!activeMatch) return;

    const finalResults = activeMatch.participatingTeams.map(team => {
      const input = matchResultsInput[team.teamId] || { position: 6, kills: 0 };
      const { positionBonus, killPoints, matchScore } = calculateMatchScore(input.position, input.kills);

      return {
        teamId: team.teamId,
        teamName: team.teamName,
        leaderName: team.leaderName,
        position: parseInt(input.position, 10),
        kills: parseInt(input.kills, 10),
        positionBonus,
        killPoints,
        matchScore
      };
    });

    onFinishMatch(finalResults);
    setShowScoreEntry(false);
  };

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#182030] to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hud-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Match Command & Custom Team Selection
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
            MATCH & LOBBY <span className="text-amber-400">CREATOR</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose participating teams, filter by matches played, shuffle slot numbers, and launch live matches.
          </p>
        </div>

        {/* Selected Teams Count */}
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <Gamepad className="w-8 h-8 text-amber-400" />
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">Selected for Match</div>
            <div className="font-display font-black text-2xl text-emerald-400">{selectedTeamsList.length} / {presentTeams.length} Teams</div>
          </div>
        </div>
      </div>

      {/* ACTIVE MATCH CONTROL CARD */}
      {activeMatch ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display font-black text-2xl text-white">
                  {activeMatch.name}
                </span>
                {activeMatch.isFinalRound && (
                  <span className="px-3 py-1 bg-amber-500 text-black font-extrabold text-xs rounded-full uppercase tracking-wider shadow-md">
                    🏆 FINAL ROUND
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider ${
                  activeMatch.status === 'LIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                    : activeMatch.status === 'PUBLISHED'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  Status: {activeMatch.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Map: <strong className="text-amber-400">{activeMatch.map}</strong> • Room ID: <strong className="text-white font-mono">{activeMatch.roomId}</strong> • Password: <strong className="text-amber-400 font-mono">{activeMatch.roomPassword}</strong>
              </p>
            </div>

            {/* Action Flow Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {activeMatch.status === 'DRAFT' && (
                <button
                  onClick={onPublishMatch}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Publish Room & Slots
                </button>
              )}

              {activeMatch.status === 'PUBLISHED' && (
                <button
                  onClick={() => {
                    if (!canStart) {
                      alert('Permission Denied: Admin has not granted "Start Match" permission.');
                      return;
                    }
                    onStartMatch();
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/20 transition flex items-center gap-2 animate-pulse"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Game (10s Countdown)
                </button>
              )}

              {(activeMatch.status === 'LIVE' || activeMatch.status === 'PUBLISHED') && (
                <button
                  onClick={handleOpenScoreEntry}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 transition flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" /> End Match & Enter Scores
                </button>
              )}

              <button
                onClick={onCancelMatch}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 text-xs font-bold transition"
              >
                Cancel Match
              </button>
            </div>
          </div>

          {/* Slot Allocation List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white tracking-wide flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-amber-400" /> Room Slot Allocations ({activeMatch.participatingTeams?.length} Teams)
              </h3>
              <span className="text-xs text-slate-400 font-medium">Slot 1 Reserved for Spectator</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMatch.participatingTeams.map((pt) => (
                <div 
                  key={pt.teamId}
                  className="p-4 bg-[#0d121c] rounded-2xl border border-slate-800 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 font-display font-black text-lg text-amber-400 flex items-center justify-center">
                      #{pt.slotNumber}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{pt.teamName}</div>
                      <div className="text-xs text-slate-400">Leader: <strong className="text-slate-300">{pt.leaderName}</strong> ({pt.leaderYear} Year)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Slot {pt.slotNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* CREATE MATCH FORM */
        <form onSubmit={handleCreateMatchSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" />
              <h2 className="font-display font-bold text-xl text-white tracking-wide">
                CREATE MATCH LOBBY & SETUP
              </h2>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 transition">
              <input
                type="checkbox"
                checked={isFinalRound}
                onChange={(e) => setIsFinalRound(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-4 h-4" /> Final Round Match
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Match Title / Sequence *
              </label>
              <input
                type="text"
                placeholder="e.g. Match #1 (Erangel)"
                value={matchTitle}
                onChange={(e) => setMatchTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Room Credentials (ID & Password) *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  required
                />
                <input
                  type="text"
                  placeholder="Password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d121c] border border-slate-700/80 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Map Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-amber-400" /> Choose Battle Map *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {BGMI_MAPS.map((map) => (
                <button
                  key={map.id}
                  type="button"
                  onClick={() => setSelectedMap(map.id)}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-28 relative overflow-hidden ${
                    selectedMap === map.id
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-[#0d121c] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-display font-black text-lg tracking-wider text-white">{map.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{map.desc}</span>
                  {selectedMap === map.id && (
                    <span className="absolute top-2 right-2 text-amber-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* TEAM SELECTION & MATCHES PLAYED FILTER SECTION */}
          <div className="p-6 bg-[#0c1018] rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" /> Select Teams Participating in Match
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Check squad boxes to include in match. Filter teams by total matches played to balance game time.
                </p>
              </div>

              {/* Filter by Matches Played */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider mr-1">
                  <Filter className="w-3.5 h-3.5 text-amber-400" /> Filter:
                </span>
                {[
                  { id: 'ALL', label: 'All Present' },
                  { id: '0', label: '0 Matches' },
                  { id: '1', label: '1 Match' },
                  { id: '2+', label: '2+ Matches' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMatchesPlayedFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      matchesPlayedFilter === f.id
                        ? 'bg-amber-500 text-black font-extrabold shadow-md'
                        : 'bg-[#131926] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Selection Helpers */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectFiltered}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold rounded-xl transition"
                >
                  ✓ Select All Filtered ({filteredPresentTeams.length})
                </button>
                <button
                  type="button"
                  onClick={handleSelectZeroMatchesOnly}
                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold rounded-xl transition"
                >
                  🎯 Select 0 Matches Played Only
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl transition"
                >
                  ✕ Deselect All
                </button>
              </div>

              <div className="font-mono text-amber-400 font-bold">
                {selectedTeamsList.length} / {presentTeams.length} Teams Selected
              </div>
            </div>

            {/* Team Selection Checkboxes Grid */}
            {filteredPresentTeams.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No verified present teams match the selected "Matches Played" filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
                {filteredPresentTeams.map((team) => {
                  const isSelected = selectedTeamIds.includes(team.id);
                  const playedCount = matchesPlayedMap[team.id] || 0;
                  const assignedSlot = slotAssignments[team.id];

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleToggleTeamSelect(team.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                          : 'bg-[#131926] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{team.teamName}</div>
                          <div className="text-[10px] text-slate-400">Leader: {team.leaderName}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                          playedCount === 0
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {playedCount} Matches
                        </span>
                        {assignedSlot && isSelected && (
                          <div className="text-[10px] font-mono text-amber-400 font-extrabold mt-1">
                            Slot #{assignedSlot}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Random Slot Generator Action */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Randomize slot numbers (Slot 2+) for the <strong className="text-amber-400">{selectedTeamsList.length} selected teams</strong>:
              </span>

              <button
                type="button"
                onClick={handleRandomizeSlots}
                disabled={selectedTeamsList.length === 0 || !canLobby}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 self-start sm:self-auto"
              >
                <Shuffle className="w-4 h-4" /> ⚡ Shuffle Slot Numbers
              </button>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={selectedTeamsList.length === 0 || !canSetup}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-black font-display font-black text-base uppercase tracking-wider transition shadow-xl shadow-amber-500/20"
          >
            Create Match Room ({selectedTeamsList.length} Teams Selected)
          </button>

        </form>
      )}

      {/* SCORE ENTRY MODAL */}
      {showScoreEntry && activeMatch && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-display font-black text-2xl text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" /> END MATCH & ENTER SCORES
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Select finish position (1st to 6th+) and kill counts for participating teams.
                </p>
              </div>

              <button
                onClick={() => setShowScoreEntry(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold flex items-center justify-between">
              <span>🥇 1st: 6pt | 🥈 2nd: 4pt | 🥉 3rd: 2pt | 4th-5th: 1pt | 6th+: 0pt | Kills: 2pt each</span>
              <span className="font-mono text-white">Score = Position Bonus + (Kills × 2)</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {activeMatch.participatingTeams.map((team) => {
                const input = matchResultsInput[team.teamId] || { position: 1, kills: 0 };
                const calc = calculateMatchScore(input.position, input.kills);

                return (
                  <div key={team.teamId} className="p-4 bg-[#0d121c] rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-base">{team.teamName}</div>
                      <div className="text-xs text-slate-400">Leader: {team.leaderName} (Slot #{team.slotNumber})</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Rank / Position *</label>
                        <select
                          value={input.position}
                          onChange={(e) => setMatchResultsInput({
                            ...matchResultsInput,
                            [team.teamId]: { ...input, position: parseInt(e.target.value, 10) }
                          })}
                          className="px-3.5 py-2 bg-[#141b29] border border-amber-500/40 rounded-xl text-xs text-amber-400 font-bold focus:outline-none"
                        >
                          <option value="1">🥇 1st Place (6 pts)</option>
                          <option value="2">🥈 2nd Place (4 pts)</option>
                          <option value="3">🥉 3rd Place (2 pts)</option>
                          <option value="4">4th Place (1 pt)</option>
                          <option value="5">5th Place (1 pt)</option>
                          <option value="6">6th+ Place (0 pts)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Kills (×2 pts)</label>
                        <input
                          type="number"
                          min="0"
                          value={input.kills}
                          onChange={(e) => setMatchResultsInput({
                            ...matchResultsInput,
                            [team.teamId]: { ...input, kills: Math.max(0, parseInt(e.target.value, 10) || 0) }
                          })}
                          className="w-20 px-3 py-2 bg-[#141b29] border border-slate-700 rounded-xl text-xs text-white font-mono font-bold text-center focus:outline-none"
                        />
                      </div>

                      <div className="text-right min-w-24">
                        <div className="text-[10px] text-slate-400">Match Score</div>
                        <div className="font-display font-black text-xl text-amber-400">
                          {calc.matchScore} pts
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowScoreEntry(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitScores}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                Submit & Publish Match Scores
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
