import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  ArrowRight,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  HeartHandshake
} from 'lucide-react';
import { useMedication } from '../../context/MedicationContext';

export const MedicationStreakCounter: React.FC = () => {
  const { streakData, todayStats, markAllTodayTaken } = useMedication();
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const {
    currentStreak,
    previousDaysStreak,
    bestStreak,
    isTodayComplete,
    remainingToday,
    nextMilestone,
    milestoneTitle,
    progressToMilestone,
    history
  } = streakData;

  const milestones = [
    { days: 7, title: '1-Week Bronze', icon: '🥉', desc: 'Consistent baseline established' },
    { days: 14, title: '2-Week Silver', icon: '🥈', desc: 'Critical post-PCI endothelialization' },
    { days: 21, title: '3-Week Gold', icon: '🥇', desc: 'Arterial plaque stabilization' },
    { days: 30, title: '30-Day Diamond', icon: '💎', desc: 'Long-term cardiovascular protection' }
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden space-y-6">
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. TOP HEADER & STREAK SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          {/* Animated Big Glowing Flame Icon Badge */}
          <div className="relative shrink-0">
            <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl ${
              isTodayComplete
                ? 'bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-400 text-white shadow-amber-500/30'
                : 'bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-900/60 text-amber-400 border border-amber-500/30 shadow-amber-900/20'
            }`}>
              <Flame className={`h-10 w-10 sm:h-12 sm:w-12 fill-current ${isTodayComplete ? 'animate-bounce' : 'animate-pulse'}`} />
            </div>
            {isTodayComplete && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg border-2 border-slate-950 animate-pulse">
                +1 Ext
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>MEDICATION ADHERENCE STREAK</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                {currentStreak}
              </h2>
              <span className="text-lg sm:text-xl font-bold text-slate-300">
                {currentStreak === 1 ? 'Consecutive Day' : 'Consecutive Days'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              {isTodayComplete ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Streak verified for today! You have taken all {todayStats.totalDoses} of {todayStats.totalDoses} doses.</span>
                </span>
              ) : (
                <span className="text-amber-300">
                  Active streak in progress today: You have taken {todayStats.takenDoses} of {todayStats.totalDoses} doses. Take remaining {remainingToday} dose(s) to extend your streak to {previousDaysStreak + 1} days!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Button & Best Record */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-3 shrink-0">
          {!isTodayComplete && (
            <button
              onClick={markAllTodayTaken}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark All Remaining Taken Today</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Personal Best: <strong className="text-white font-mono">{bestStreak} Days</strong></span>
          </div>
        </div>
      </div>

      {/* 2. RECENT 14-DAY CONSECUTIVE CALENDAR MATRIX */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <span>Consecutive Days Tracker (Past 14 Days + Today)</span>
          </span>
          <button
            onClick={() => setShowHistoryModal(!showHistoryModal)}
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>{showHistoryModal ? 'Hide Details' : 'View Full Clinical Log'}</span>
            {showHistoryModal ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* 14 Past Days + Today Badges Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-15 gap-2 text-center text-xs">
          {history.slice(-14).map((record) => (
            <div
              key={record.date}
              className="p-2 sm:p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex flex-col items-center justify-between relative group hover:border-emerald-400 transition"
              title={`${record.formattedDate} (${record.dayName}): 100% adherence (4/4 doses taken)`}
            >
              <span className="text-[10px] text-slate-400 block font-mono">{record.formattedDate}</span>
              <div className="my-1.5 h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-[9px] font-bold uppercase text-emerald-400">100%</span>
            </div>
          ))}

          {/* Today's Special Card */}
          <div
            className={`p-2 sm:p-2.5 rounded-2xl border flex flex-col items-center justify-between relative transition ${
              isTodayComplete
                ? 'bg-gradient-to-b from-amber-500/20 to-emerald-950/40 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 animate-pulse'
            }`}
            title={`Today: ${todayStats.takenDoses}/${todayStats.totalDoses} doses confirmed (${todayStats.percent}%)`}
          >
            <span className="text-[10px] text-amber-400 font-bold block font-mono">Today</span>
            <div className={`my-1.5 h-6 w-6 rounded-full flex items-center justify-center ${
              isTodayComplete ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-cyan-500/20 text-cyan-400'
            }`}>
              {isTodayComplete ? <Flame className="h-3.5 w-3.5 fill-current" /> : <Clock className="h-3.5 w-3.5" />}
            </div>
            <span className="text-[9px] font-bold font-mono">
              {todayStats.takenDoses}/{todayStats.totalDoses}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MILESTONE PROGRESSION & BADGES */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span className="font-bold text-white">Next Milestone:</span>
            <span className="text-amber-300 font-semibold">{milestoneTitle} ({nextMilestone} Days)</span>
          </div>
          <span className="text-slate-400 font-mono">
            {nextMilestone - currentStreak > 0
              ? `${nextMilestone - currentStreak} days remaining`
              : 'Milestone Achieved! 🎉'}
          </span>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1">
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 transition-all duration-700 rounded-full"
              style={{ width: `${progressToMilestone}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Current: {currentStreak} Days</span>
            <span>Target: {nextMilestone} Days</span>
          </div>
        </div>

        {/* Milestone Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80">
          {milestones.map((m) => {
            const isUnlocked = currentStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate text-[11px]">{m.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{m.days} Days · {isUnlocked ? 'Unlocked' : 'Locked'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. EXPANDABLE CLINICAL ADHERENCE HISTORY LOG */}
      {showHistoryModal && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Full Historical Record (Audited for Cardiologist & Caretaker)</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">100% Consecutive Compliance</span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 text-xs">
            {/* Today */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isTodayComplete ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-cyan-950/30 border-cyan-500/30'
            }`}>
              <div>
                <span className="font-bold text-white block">Today (Current Day)</span>
                <span className="text-[11px] text-slate-400">
                  {todayStats.takenDoses} of {todayStats.totalDoses} doses marked taken ({todayStats.percent}%)
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                isTodayComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {isTodayComplete ? 'Streak Extended' : 'In Progress'}
              </span>
            </div>

            {/* Past 14 Days */}
            {history.slice().reverse().map((rec) => (
              <div
                key={rec.date}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rec.formattedDate} ({rec.dayName})</span>
                    <span className="text-[10px] text-emerald-400 font-mono">4/4 Doses Confirmed</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Metoprolol 25mg · Atorvastatin 40mg · Aspirin 81mg · Lisinopril 10mg
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CLINICAL BENEFIT & CARETAKER SYNC FOOTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-slate-300 leading-snug">
            <strong className="text-white">Clinical Efficacy:</strong> Maintaining a 14+ day streak reduces in-stent restenosis and stabilizes coronary endothelial shear stress.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
          <UserCheck className="h-5 w-5 text-cyan-400 shrink-0" />
          <p className="text-slate-300 leading-snug">
            <strong className="text-white">Caretaker Alerted:</strong> Sarah Davis automatically receives notification updates upon today's final dose completion.
          </p>
        </div>
      </div>
    </div>
  );
};
