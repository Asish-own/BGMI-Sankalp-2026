import React from 'react';
import { Shield, Sparkles, ExternalLink, Trophy, Users, MapPin, Mail, Award, Flame, BookOpen } from 'lucide-react';

export default function AboutEventOrganizer() {
  return (
    <section className="relative overflow-hidden glass-panel rounded-3xl border border-amber-500/30 p-6 sm:p-10 shadow-2xl hud-border w-full select-none">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SANKALP 2026 • NIST UNIVERSITY</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-wide">
              ABOUT THE <span className="text-amber-400">ORGANIZER & EVENT</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              <strong>Assult Survivors BGMI Tournament</strong> is an official campus esports championship conducted exclusively by the <strong>Data Science Club (DSC)</strong> of <strong>NIST University, Berhampur, Odisha</strong> as part of the flagship technical fest <strong>SANKALP 2026</strong>.
            </p>
          </div>

          <a
            href="https://data-science-club-nist.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-black uppercase tracking-wider transition self-start md:self-auto shadow-md"
          >
            <span>Visit DSC NIST Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Informative Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Event Identity */}
          <div className="bg-[#0b0f17] p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Assult Survivors BGMI
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official custom room survival championship with verified player rosters, randomized slot management, and live match control.
            </p>
          </div>

          {/* Card 2: Organizer */}
          <div className="bg-[#0b0f17] p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Data Science Club NIST
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premier student technical community at NIST University. Motto: <em>"Learn. Build. Present. Compete."</em> Established in 2020.
            </p>
          </div>

          {/* Card 3: Flagship Fest */}
          <div className="bg-[#0b0f17] p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Sankalp 2026 Tech Fest
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              NIST University's prestigious annual technical festival featuring national hackathons, technical paper expos, and esports clashes.
            </p>
          </div>

          {/* Card 4: Fair Play Scoring */}
          <div className="bg-[#0b0f17] p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Algorithmic Scoring
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Kill = 2 Pts. 1st (WWCD) = 6 Pts, 2nd = 4 Pts, 3rd = 2 Pts, 4th/5th = 1 Pt. Automated 4-tier tie-breaker resolution.
            </p>
          </div>

        </div>

        {/* Official Club Links & Contact Grid */}
        <div className="p-5 sm:p-6 bg-[#080c13] rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-black uppercase text-amber-400 tracking-wider">
              Official Data Science Club Resources
            </div>
            <p className="text-slate-400 text-xs">
              Explore club wings, projects, national achievements, and student team profiles:
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <a
                href="https://data-science-club-nist.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                <span>DSC NIST Home</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://data-science-club-nist.vercel.app/sankalp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                <span>Sankalp 2026</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://data-science-club-nist.vercel.app/achievements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                <span>Achievements</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://data-science-club-nist.vercel.app/team"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                <span>Our Team</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://data-science-club-nist.vercel.app/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                <span>Projects</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://data-science-club-nist.vercel.app/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-amber-400 font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                <span>Contact</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-slate-400 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>NIST University Campus, Palur Hills, Berhampur, Odisha 761008</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <a href="mailto:data.science.club@nist.edu" className="hover:text-amber-400 font-mono">
                  data.science.club@nist.edu
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

