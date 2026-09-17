import React, { useEffect } from 'react';
import { Trophy, Flame, Swords, Shield, Award, Sparkles, ChevronRight, AlertTriangle, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateLeaderboard } from '../utils/scoring';

export default function Leaderboard({ teams = [], matches = [], activeMatch }) {
  const leaderboardData = calculateLeaderboard(teams, matches);

  // Check if final round match completed
  const hasCompletedFinalRound = matches.some(m => m.isFinalRound && m.isCompleted);
  const topThree = leaderboardData.slice(0, 3);

  // Trigger celebration confetti when final round is scored
  useEffect(() => {
    if (hasCompletedFinalRound) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback
      }
    }
  }, [hasCompletedFinalRound]);

  return (
    <div className="max-w-7xl mx-auto my-8 space-y-10">
      
      {/* FINAL ROUND GRAND CHAMPIONS PODIUM BANNER */}
      {hasCompletedFinalRound && topThree.length >= 3 && (
        <div className="relative overflow-hidden glass-panel p-8 sm:p-12 rounded-3xl border-2 border-amber-400/80 shadow-2xl space-y-8 animate-fadeIn">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-amber-500/10 via-transparent to-orange-500/10 pointer-events-none"></div>

          <div className="text-center space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black uppercase tracking-widest animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" /> TOURNAMENT CHAMPIONS DECLARED
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-wider">
              🏆 GRAND CHAMPIONS PODIUM 🏆
            </h1>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              The Final Round has concluded! Congratulations to the top performing squads of the BGMI Club Tournament.
            </p>
          </div>

          {/* Podium Grid (2nd, 1st, 3rd) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 items-end relative z-10">
            
            {/* 🥈 2nd Place Podium */}
            {topThree[1] && (
              <div className="bg-[#121927] p-6 rounded-3xl border border-slate-700 text-center space-y-4 shadow-xl order-2 md:order-1">
                <div className="w-16 h-16 rounded-full bg-slate-700/50 text-slate-300 border border-slate-500 flex items-center justify-center font-display font-black text-2xl mx-auto shadow-md">
                  🥈
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">RUNNER UP</span>
                  <h3 className="font-display font-black text-2xl text-white">{topThree[1].teamName}</h3>
                  <p className="text-xs text-slate-400">Leader: {topThree[1].leaderName} ({topThree[1].leaderYear} Year)</p>
                </div>
                <div className="p-3 bg-[#0b0e14] rounded-2xl border border-slate-800 flex justify-around text-xs">
                  <div>
                    <div className="text-slate-400 font-medium">Points</div>
                    <div className="font-display font-black text-xl text-slate-200">{topThree[1].totalPoints}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Kills</div>
                    <div className="font-display font-black text-xl text-amber-400">{topThree[1].totalKills}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 🥇 1st Place Champion Podium */}
            {topThree[0] && (
              <div className="bg-gradient-to-b from-amber-500/20 via-[#182030] to-[#0d121c] p-8 rounded-3xl border-2 border-amber-400 text-center space-y-4 shadow-2xl shadow-amber-500/20 scale-105 order-1 md:order-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-black flex items-center justify-center font-display font-black text-4xl mx-auto shadow-lg shadow-amber-500/40 animate-bounce">
                  🥇
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest">
                    GRAND CHAMPION
                  </span>
                  <h3 className="font-display font-black text-3xl text-amber-300 mt-2">{topThree[0].teamName}</h3>
                  <p className="text-xs text-slate-300">Leader: {topThree[0].leaderName} ({topThree[0].leaderYear} Year)</p>
                </div>
                <div className="p-4 bg-[#0b0e14] rounded-2xl border border-amber-500/30 flex justify-around text-xs">
                  <div>
                    <div className="text-slate-400 font-medium">Total Score</div>
                    <div className="font-display font-black text-2xl text-amber-400">{topThree[0].totalPoints} pts</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Total Kills</div>
                    <div className="font-display font-black text-2xl text-orange-400">{topThree[0].totalKills}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">WWCD</div>
                    <div className="font-display font-black text-2xl text-yellow-300">{topThree[0].wwcdCount} 🏆</div>
                  </div>
                </div>
              </div>
            )}

            {/* 🥉 3rd Place Podium */}
            {topThree[2] && (
              <div className="bg-[#121927] p-6 rounded-3xl border border-amber-800/40 text-center space-y-4 shadow-xl order-3">
                <div className="w-16 h-16 rounded-full bg-amber-900/40 text-amber-500 border border-amber-700 flex items-center justify-center font-display font-black text-2xl mx-auto shadow-md">
                  🥉
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider">3RD PLACE</span>
                  <h3 className="font-display font-black text-2xl text-white">{topThree[2].teamName}</h3>
                  <p className="text-xs text-slate-400">Leader: {topThree[2].leaderName} ({topThree[2].leaderYear} Year)</p>
                </div>
                <div className="p-3 bg-[#0b0e14] rounded-2xl border border-slate-800 flex justify-around text-xs">
                  <div>
                    <div className="text-slate-400 font-medium">Points</div>
                    <div className="font-display font-black text-xl text-amber-500">{topThree[2].totalPoints}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Kills</div>
                    <div className="font-display font-black text-xl text-amber-400">{topThree[2].totalKills}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Main Leaderboard Table Section */}
      <div className="space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#141b28] to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" /> Official Standings
            </div>
            <h2 className="font-display font-black text-3xl text-white tracking-wide">
              TOURNAMENT <span className="text-amber-400">LEADERBOARD</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Formula: <strong className="text-white">Position Bonus + (Kills × 2)</strong>. Strict tie-breaker rules enforced automatically.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0c1018] p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <div className="text-slate-400 font-bold">Matches Played</div>
              <div className="font-display font-black text-xl text-amber-400">{matches.filter(m => m.isCompleted).length} Matches</div>
            </div>
          </div>
        </div>

        {/* Scoring Rule Explainer Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          <div className="p-4 bg-[#0d121c] rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-4 h-4" /> Position Bonus Points
            </div>
            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded font-bold">🥇 1st: 6pts</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold">🥈 2nd: 4pts</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold">🥉 3rd: 2pts</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded font-bold">4th: 1pt</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded font-bold">5th: 1pt</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-500 rounded font-bold">6th+: 0pt</span>
            </div>
          </div>

          <div className="p-4 bg-[#0d121c] rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" /> Tie-Breaker Resolution Order
            </div>
            <div className="text-slate-400 flex flex-wrap items-center gap-1.5">
              <span className="text-white font-bold">1. Total Kills</span> → 
              <span className="text-white font-bold">2. 1st Place Finishes (WWCD)</span> → 
              <span className="text-white font-bold">3. Best Single Match Score</span> → 
              <span className="text-red-400 font-bold">4. Tiebreaker Match</span>
            </div>
          </div>

        </div>

        {/* Leaderboard Table */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0e1420] text-slate-400 text-xs font-extrabold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6 text-center">Rank</th>
                  <th className="py-4 px-6">Team Name</th>
                  <th className="py-4 px-6">Team Leader</th>
                  <th className="py-4 px-6 text-center">Matches</th>
                  <th className="py-4 px-6 text-center">WWCD (1st)</th>
                  <th className="py-4 px-6 text-center">Total Kills (×2)</th>
                  <th className="py-4 px-6 text-center">Best Match</th>
                  <th className="py-4 px-6 text-right">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {leaderboardData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      No registered teams found.
                    </td>
                  </tr>
                ) : (
                  leaderboardData.map((row) => (
                    <tr 
                      key={row.teamId}
                      className={`transition ${
                        row.rank === 1
                          ? 'bg-amber-500/10 hover:bg-amber-500/15'
                          : row.rank === 2
                          ? 'bg-slate-800/30 hover:bg-slate-800/50'
                          : row.rank === 3
                          ? 'bg-amber-900/10 hover:bg-amber-900/20'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6 text-center">
                        {row.rank === 1 ? (
                          <span className="w-8 h-8 rounded-xl bg-amber-500 text-black font-display font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
                            🥇 1
                          </span>
                        ) : row.rank === 2 ? (
                          <span className="w-8 h-8 rounded-xl bg-slate-400 text-black font-display font-black text-sm flex items-center justify-center mx-auto">
                            🥈 2
                          </span>
                        ) : row.rank === 3 ? (
                          <span className="w-8 h-8 rounded-xl bg-amber-700 text-white font-display font-black text-sm flex items-center justify-center mx-auto">
                            🥉 3
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-slate-400 text-sm">
                            #{row.rank}
                          </span>
                        )}
                      </td>

                      {/* Team Name */}
                      <td className="py-4 px-6">
                        <div className="font-display font-black text-white text-base">
                          {row.teamName}
                        </div>
                        {row.isTied && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-extrabold uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 mt-1">
                            <AlertTriangle className="w-3 h-3" /> Tiebreaker Match Needed
                          </span>
                        )}
                      </td>

                      {/* Team Leader */}
                      <td className="py-4 px-6 text-slate-300">
                        <div className="font-bold text-white">{row.leaderName}</div>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-semibold">
                          {row.leaderYear} Year
                        </span>
                      </td>

                      {/* Matches Played */}
                      <td className="py-4 px-6 text-center font-mono text-slate-300 font-semibold">
                        {row.matchesPlayed}
                      </td>

                      {/* WWCD Count */}
                      <td className="py-4 px-6 text-center font-mono font-bold text-amber-400">
                        {row.wwcdCount} {row.wwcdCount > 0 && '🏆'}
                      </td>

                      {/* Total Kills */}
                      <td className="py-4 px-6 text-center font-mono font-bold text-orange-400">
                        {row.totalKills} <span className="text-xs text-slate-500">({row.totalKills * 2} pts)</span>
                      </td>

                      {/* Best Single Match Score */}
                      <td className="py-4 px-6 text-center font-mono text-slate-300">
                        {row.bestMatchScore} pts
                      </td>

                      {/* Total Points */}
                      <td className="py-4 px-6 text-right font-display font-black text-2xl text-amber-400 tracking-wide">
                        {row.totalPoints} <span className="text-xs text-slate-400 font-sans">pts</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MATCH HISTORY BREAKDOWN SECTION */}
      {matches.filter(m => m.isCompleted).length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="font-display font-bold text-xl text-white tracking-wide">
            COMPLETED MATCH HISTORY
          </h3>

          <div className="space-y-4">
            {matches.filter(m => m.isCompleted).map((m, idx) => (
              <div key={m.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-lg text-white">{m.name}</span>
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full">
                      Map: {m.map}
                    </span>
                    {m.isFinalRound && (
                      <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded uppercase">
                        FINAL ROUND
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Played at {new Date(m.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {m.results?.map((res) => (
                    <div key={res.teamId} className="p-3 bg-[#0d121c] rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{res.teamName}</div>
                        <div className="text-[10px] text-slate-400">Rank: #{res.position} • {res.kills} Kills</div>
                      </div>
                      <div className="font-display font-bold text-amber-400 text-sm">
                        +{res.matchScore} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
