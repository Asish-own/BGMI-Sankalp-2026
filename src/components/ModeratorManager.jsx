import React, { useState } from 'react';
import { UserCheck, Key, Shield, Plus, Trash2, CheckCircle2, Lock, Sparkles, Settings, Users, Gamepad, Trophy, ShieldAlert } from 'lucide-react';
import { DEFAULT_PERMISSIONS } from '../utils/storage';

export default function ModeratorManager({ moderators = [], onUpdateModerators }) {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Moderator Form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('bgmi-moderator');
  const [newName, setNewName] = useState('');
  const [permissions, setPermissions] = useState({ ...DEFAULT_PERMISSIONS });

  const handleTogglePermission = (modId, permKey) => {
    const updated = moderators.map(mod => {
      if (mod.id === modId) {
        return {
          ...mod,
          permissions: {
            ...mod.permissions,
            [permKey]: !mod.permissions[permKey]
          }
        };
      }
      return mod;
    });
    onUpdateModerators(updated);
  };

  const handleAddModerator = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      alert('Please fill out Username, Password, and Display Name.');
      return;
    }

    const newMod = {
      id: 'mod-' + Date.now(),
      username: newUsername.trim(),
      password: newPassword.trim(),
      name: newName.trim(),
      permissions: { ...permissions }
    };

    onUpdateModerators([...moderators, newMod]);
    setNewUsername('');
    setNewPassword('bgmi-moderator');
    setNewName('');
    setShowAddModal(false);
  };

  const handleDeleteModerator = (modId) => {
    if (moderators.length <= 1) {
      alert('At least one moderator account must remain.');
      return;
    }
    const updated = moderators.filter(m => m.id !== modId);
    onUpdateModerators(updated);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl hud-border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" /> Admin Privilege Controller
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
            MODERATOR ACCOUNTS & GRANULAR POWERS
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Admin manages moderator credentials (<code className="text-emerald-400">bgmi-moderator</code>) and toggles granular permissions per category.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Moderator ID
        </button>
      </div>

      {/* Moderators List */}
      <div className="space-y-6">
        {moderators.map((mod) => (
          <div 
            key={mod.id}
            className="p-6 bg-[#0d121c] rounded-2xl border border-slate-800 space-y-6 hover:border-slate-700 transition"
          >
            {/* Moderator Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-black font-display font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  {mod.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-bold text-white text-lg">{mod.name}</div>
                  <div className="text-xs font-mono text-slate-400">
                    ID: <strong className="text-emerald-400">{mod.username}</strong> • Password: <strong className="text-amber-400">{mod.password}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteModerator(mod.id)}
                className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition self-start sm:self-auto"
                title="Remove Moderator Account"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* CATEGORIZED GRANULAR PERMISSIONS */}
            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> Granular Moderator Access Matrix:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. TEAM MANAGEMENT */}
                <div className="p-4 bg-[#111723] rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <Users className="w-3.5 h-3.5" /> Team Management
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'viewTeams', label: 'View Teams' },
                      { key: 'editTeams', label: 'Edit Teams' },
                      { key: 'verifyTeams', label: 'Verify Teams' }
                    ].map((perm) => (
                      <label key={perm.key} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={mod.permissions?.[perm.key] ?? true}
                          onChange={() => handleTogglePermission(mod.id, perm.key)}
                          className="w-4 h-4 accent-cyan-500 rounded"
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. MATCH MANAGEMENT */}
                <div className="p-4 bg-[#111723] rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <Gamepad className="w-3.5 h-3.5" /> Match Management
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'manageLobbies', label: 'Manage Lobbies' },
                      { key: 'matchSetup', label: 'Match Setup' },
                      { key: 'startMatch', label: 'Start Match' },
                      { key: 'endMatch', label: 'End Match' }
                    ].map((perm) => (
                      <label key={perm.key} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={mod.permissions?.[perm.key] ?? true}
                          onChange={() => handleTogglePermission(mod.id, perm.key)}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. SCORING */}
                <div className="p-4 bg-[#111723] rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <Trophy className="w-3.5 h-3.5" /> Scoring
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'viewScores', label: 'View Scores' },
                      { key: 'enterScores', label: 'Enter Scores' },
                      { key: 'editScores', label: 'Edit Scores' },
                      { key: 'deleteScores', label: 'Delete Scores' }
                    ].map((perm) => (
                      <label key={perm.key} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={mod.permissions?.[perm.key] ?? true}
                          onChange={() => handleTogglePermission(mod.id, perm.key)}
                          className="w-4 h-4 accent-emerald-500 rounded"
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. TOURNAMENT CONTROL */}
                <div className="p-4 bg-[#111723] rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <ShieldAlert className="w-3.5 h-3.5" /> Tournament Control
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'disqualifyTeams', label: 'Disqualify Teams' }
                    ].map((perm) => (
                      <label key={perm.key} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={mod.permissions?.[perm.key] ?? true}
                          onChange={() => handleTogglePermission(mod.id, perm.key)}
                          className="w-4 h-4 accent-red-500 rounded"
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ADD MODERATOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddModerator} className="glass-panel max-w-md w-full p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-white">Create New Moderator Account</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Display Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Moderator Rahul"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Username / ID *</label>
                <input
                  type="text"
                  placeholder="e.g. moderator2"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Password *</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0c1018] border border-slate-700 rounded-xl text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-black font-extrabold rounded-xl text-xs uppercase"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
