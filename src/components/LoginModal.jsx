import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, User, Key, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { PASSWORDS } from '../utils/storage';

export default function LoginModal({ isOpen, initialRole = 'admin', onClose, onLogin, moderators = [] }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRole) setSelectedRole(initialRole);
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'admin') {
      if (password.trim() === PASSWORDS.ADMIN) {
        onLogin({ role: 'admin', username: 'Administrator' });
        onClose();
      } else {
        setError('Invalid Admin Password. Hint: bgmi-admin');
      }
    } else if (selectedRole === 'moderator') {
      const isDefaultPass = password.trim() === PASSWORDS.MODERATOR;
      const matchedMod = moderators.find(
        m => m.password === password.trim() || (m.username === username.trim() && m.password === password.trim())
      );

      if (isDefaultPass || matchedMod) {
        const modObj = matchedMod || moderators[0] || {
          username: 'moderator',
          name: 'Official Moderator',
          permissions: {}
        };
        onLogin({ role: 'moderator', username: modObj.name, moderatorObj: modObj });
        onClose();
      } else {
        setError('Invalid Moderator Password. Hint: bgmi-moderator');
      }
    } else {
      if (!password || password.trim() === PASSWORDS.USER || password.trim() === 'bgmi') {
        onLogin({ role: 'user', username: 'Public User' });
        onClose();
      } else {
        setError('Invalid User Key. Hint: bgmi');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden hud-border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Lock className="w-7 h-7 text-black" />
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-wide">
            STAFF <span className="text-amber-400">AUTHENTICATION</span>
          </h2>
          <p className="text-slate-400 text-xs">
            Authenticating staff URL link parameter. Enter password below.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#0c1018] p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setSelectedRole('moderator'); setError(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              selectedRole === 'moderator'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Moderator
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRole('admin'); setError(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {selectedRole === 'moderator' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Moderator ID / Username (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. moderator1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#0c1018] border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Password Key *</span>
              <span className="text-[10px] text-amber-400 font-mono">
                {selectedRole === 'admin' ? 'bgmi-admin' : 'bgmi-moderator'}
              </span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder={selectedRole === 'admin' ? 'Enter bgmi-admin' : 'Enter bgmi-moderator'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0c1018] border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition hover:scale-[1.01]"
            >
              Authenticate Staff
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
