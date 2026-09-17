import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, MinusCircle, UserX, Trash2, Plus, FileText, CheckCircle2 } from 'lucide-react';

export const VIOLATION_TYPES = [
  'Teaming up with enemy team',
  'Using unauthorized hacks / scripts',
  'Exploiting out-of-bounds map glitch',
  'Playing with unregistered member (Unannounced player)',
  'Toxic speech / Insulting tournament officials',
  'Intentional disconnection / Leaving match room early'
];

export default function PenaltyManager({ teams = [], penalties = [], onAddPenalty, onDeletePenalty }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [violationType, setViolationType] = useState(VIOLATION_TYPES[0]);
  const [deductionPoints, setDeductionPoints] = useState(5);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeamId) {
      alert('Please select a team.');
      return;
    }

    const team = teams.find(t => t.id === selectedTeamId);
    if (!team) return;

    const penaltyData = {
      id: 'pen-' + Date.now(),
      teamId: team.id,
      teamName: team.teamName,
      leaderName: team.leaderName,
      violationType,
      deductionPoints: isDisqualified ? 999 : Math.max(0, parseInt(deductionPoints, 10) || 0),
      isDisqualified,
      notes: notes.trim(),
      loggedAt: new Date().toISOString()
    };

    onAddPenalty(penaltyData);
    setNotes('');
    setShowModal(false);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Fair Play & Discipline Enforcement
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-wide">
            ILLEGAL MOVE & PENALTY LOG
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Log rule violations, issue point deductions, or disqualify teams for illegal gameplay.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue Penalty / Deduction
        </button>
      </div>

      {/* Penalties Audit Table */}
      {penalties.length === 0 ? (
        <div className="p-8 text-center bg-[#0d121c] rounded-2xl border border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <div className="font-display font-bold text-white text-base">Zero Penalties Recorded</div>
          <p className="text-slate-400 text-xs">All teams are adhering strictly to tournament fair play rules.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {penalties.map((pen) => (
            <div 
              key={pen.id}
              className="p-4 bg-[#0d121c] rounded-2xl border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-white text-base">{pen.teamName}</span>
                  {pen.isDisqualified ? (
                    <span className="px-2 py-0.5 bg-red-500 text-black text-[10px] font-black uppercase rounded">
                      DISQUALIFIED (DQ)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase rounded border border-red-500/30">
                      -{pen.deductionPoints} POINTS DEDUCTION
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Violation: <strong className="text-white">{pen.violationType}</strong></span>
                </div>
                {pen.notes && (
                  <div className="text-[11px] text-slate-400 italic">
                    "{pen.notes}"
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-[10px] text-slate-500">
                  {new Date(pen.loggedAt).toLocaleTimeString()}
                </span>
                <button
                  onClick={() => onDeletePenalty(pen.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-800 rounded-lg transition"
                  title="Remove Penalty"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOG PENALTY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-red-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" /> LOG RULE VIOLATION
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Select Team */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Select Offending Team *</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-white font-bold"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.teamName} (Leader: {t.leaderName})</option>
                  ))}
                </select>
              </div>

              {/* Violation Type */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Violation Category *</label>
                <select
                  value={violationType}
                  onChange={(e) => setViolationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-white"
                >
                  {VIOLATION_TYPES.map((v, idx) => (
                    <option key={idx} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Action / Penalty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Point Deduction (-pts)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    disabled={isDisqualified}
                    value={deductionPoints}
                    onChange={(e) => setDeductionPoints(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-white font-mono font-bold"
                  />
                </div>

                <div className="flex items-end">
                  <label className="w-full p-2.5 bg-[#0c1018] border border-slate-700 rounded-xl flex items-center gap-2 cursor-pointer text-red-400 font-bold">
                    <input
                      type="checkbox"
                      checked={isDisqualified}
                      onChange={(e) => setIsDisqualified(e.target.checked)}
                      className="w-4 h-4 accent-red-500 rounded"
                    />
                    <span>Disqualify Team</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Incident Notes / Match #</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Teaming reported during Match #2 final circle."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-white placeholder-slate-500"
                ></textarea>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-500 hover:bg-red-400 text-white font-extrabold rounded-xl uppercase tracking-wider shadow-lg shadow-red-500/20"
              >
                Log Penalty
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
