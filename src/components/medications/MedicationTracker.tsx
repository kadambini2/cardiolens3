import React, { useState } from 'react';
import { 
  Pill, 
  Bell, 
  BellRing, 
  Check, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles, 
  UserCheck, 
  AlertCircle, 
  Calendar, 
  ChevronRight, 
  X, 
  ShieldCheck,
  CheckCircle2,
  Flame,
  Volume2
} from 'lucide-react';
import { useMedication } from '../../context/MedicationContext';
import { Medication } from '../../types/medications';
import { MedicationStreakCounter } from './MedicationStreakCounter';

export const MedicationTracker: React.FC = () => {
  const { 
    medications, 
    addMedication, 
    removeMedication, 
    toggleDoseStatus, 
    markDoseSkipped,
    markAllTodayTaken,
    todayStats,
    streakData,
    weeklyHistory,
    pushPermission,
    requestPushPermission,
    sendTestPushNotification,
    caretakerAlertLog
  } = useMedication();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Medication Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [category, setCategory] = useState<Medication['category']>('Beta Blocker');
  const [instructions, setInstructions] = useState('');
  const [frequency, setFrequency] = useState<Medication['frequency']>('Once Daily');
  const [doseTimes, setDoseTimes] = useState<string[]>(['08:00']);
  const [notifyCaretaker, setNotifyCaretaker] = useState(true);
  const [totalPills, setTotalPills] = useState(60);
  const [remainingPills, setRemainingPills] = useState(60);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Quick Presets
  const cardiacPresets = [
    { name: 'Clopidogrel (Plavix)', dosage: '75mg', category: 'Antiplatelet' as const, instructions: 'Post-stent dual antiplatelet therapy. Take with water.' },
    { name: 'Carvedilol', dosage: '12.5mg', category: 'Beta Blocker' as const, instructions: 'Heart failure and BP reduction. Take with food.' },
    { name: 'Apixaban (Eliquis)', dosage: '5mg', category: 'Anticoagulant' as const, instructions: 'Stroke prevention in atrial fibrillation. Take twice daily.' },
    { name: 'Amlodipine', dosage: '5mg', category: 'Other' as const, instructions: 'Calcium channel blocker for arterial relaxation.' },
    { name: 'Furosemide (Lasix)', dosage: '20mg', category: 'Diuretic' as const, instructions: 'Loop diuretic to prevent pulmonary fluid retention.' }
  ];

  const handleApplyPreset = (preset: typeof cardiacPresets[0]) => {
    setName(preset.name);
    setDosage(preset.dosage);
    setCategory(preset.category);
    setInstructions(preset.instructions);
  };

  const handleFrequencyChange = (freq: Medication['frequency']) => {
    setFrequency(freq);
    if (freq === 'Once Daily') {
      setDoseTimes(['08:00']);
    } else if (freq === 'Twice Daily') {
      setDoseTimes(['08:00', '20:00']);
    } else if (freq === 'Three Times Daily') {
      setDoseTimes(['08:00', '14:00', '20:00']);
    } else {
      setDoseTimes(['12:00']);
    }
  };

  const handleSubmitNewMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    addMedication({
      name,
      dosage,
      category,
      instructions: instructions || 'Take as directed by your cardiologist.',
      frequency,
      color: category === 'Beta Blocker' ? 'emerald' : category === 'Statin' ? 'cyan' : 'purple',
      notifyCaretakerOnMiss: notifyCaretaker,
      totalPills: Number(totalPills) || 60,
      remainingPills: Number(remainingPills) || 60,
      pushEnabled,
      doseTimes
    });

    // Reset & close
    setIsAddModalOpen(false);
    setName('');
    setDosage('');
    setInstructions('');
  };

  // SVG Progress Ring calculations
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (todayStats.percent / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* 1. Medication Adherence Streak Counter & 14-Day Consecutive Calendar */}
      <MedicationStreakCounter />

      {/* 2. Today's Adherence Ring & Push Notification Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Adherence Overview & Circular Progress Ring */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Circular SVG Adherence Progress Ring */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Background track circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-cyan-400 transition-all duration-700 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Center numerical readout */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                {todayStats.percent}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Adherence
              </span>
            </div>
          </div>

          {/* Adherence Text & Streak Metrics */}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-cyan-400 mb-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span>DAILY CARDIAC REGIMEN</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Today's Medication Adherence
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                You have confirmed <strong className="text-cyan-300">{todayStats.takenDoses} of {todayStats.totalDoses}</strong> scheduled doses today. Strict compliance ensures optimal stent patency and blood pressure regulation.
              </p>
            </div>

            {/* Streak & Caretaker Status */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono border transition ${
                streakData.isTodayComplete
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>{streakData.currentStreak}-Day Streak {streakData.isTodayComplete ? '(Active & Extended)' : '(In Progress Today)'}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-300">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Caretaker Sarah Davis Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Push Notification Schedule Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <BellRing className="h-5 w-5" />
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                pushPermission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {pushPermission === 'granted' ? 'Push Alerts Active' : 'Push Alerts Pending'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Push Notification Schedule
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Receive timely push alerts across your device so you never miss critical antiplatelet or beta-blocker timings.
            </p>

            {/* Upcoming Push Schedule Snapshot */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Next Push Alert:</span>
                </span>
                <span className="text-cyan-300 font-mono font-bold">09:00 PM Tonight</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Atorvastatin 40mg (1 tablet before bed). Caretaker notified upon confirmation.
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
            {pushPermission !== 'granted' ? (
              <button
                onClick={requestPushPermission}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg transition active:scale-95"
              >
                <Bell className="h-4 w-4" />
                <span>Enable Browser Push Notifications</span>
              </button>
            ) : (
              <button
                onClick={() => sendTestPushNotification()}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-xl text-xs border border-slate-700 transition"
              >
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Test Push Sound & Notification</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Adherence Strip */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              7-Day Adherence History
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Target: ≥ 90%</span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {weeklyHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs transition ${
                item.percent === 100
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : item.percent > 0
                  ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              <span className="font-bold block mb-1">{item.day}</span>
              <span className="text-[10px] text-slate-400 block mb-2">{item.date}</span>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-1.5">
                <div
                  className={`h-full ${item.percent === 100 ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
              <span className="font-mono font-bold text-[11px] block">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Medications List & Action Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Pill className="h-5 w-5 text-cyan-400" />
              <span>Prescribed Daily Medications ({medications.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Confirm your daily doses. Refill alerts and caretaker summaries update automatically.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medication</span>
          </button>
        </div>

        {/* Medications Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{med.name}</h4>
                      <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                        {med.category}
                      </span>
                    </div>
                    <span className="text-xs text-cyan-400 font-mono font-medium block mt-0.5">
                      {med.dosage} · {med.frequency}
                    </span>
                  </div>

                  <button
                    onClick={() => removeMedication(med.id)}
                    title="Remove Medication"
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Instructions */}
                <p className="text-xs text-slate-300 mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {med.instructions}
                </p>

                {/* Scheduled Doses for Today */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Today's Scheduled Doses:
                  </span>
                  {med.doses.map((dose) => (
                    <div
                      key={dose.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                        dose.taken
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : dose.skipped
                          ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                          : 'bg-slate-900/80 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-cyan-400" />
                        <div>
                          <span className="font-semibold block">{dose.label}</span>
                          {dose.taken && dose.takenAt && (
                            <span className="text-[10px] text-emerald-400">
                              Confirmed at {dose.takenAt}
                            </span>
                          )}
                          {dose.skipped && (
                            <span className="text-[10px] text-rose-400">Skipped by patient</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleDoseStatus(med.id, dose.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            dose.taken
                              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{dose.taken ? 'Taken' : 'Mark Taken'}</span>
                        </button>

                        {!dose.taken && !dose.skipped && (
                          <button
                            onClick={() => markDoseSkipped(med.id, dose.id)}
                            className="px-2 py-1.5 text-[11px] text-slate-400 hover:text-rose-400"
                          >
                            Skip
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refill pill counter & Push alert indicator */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-cyan-400" />
                  <span>
                    Supply: <strong className="text-white font-mono">{med.remainingPills}/{med.totalPills}</strong> pills remaining
                  </span>
                </div>

                {med.notifyCaretakerOnMiss && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span>Caretaker Alerts ON</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caretaker Notification Log */}
      {caretakerAlertLog.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
            <UserCheck className="h-4 w-4 text-emerald-400" />
            <span>Family Caretaker Notification Log (Sarah Davis)</span>
          </div>
          <div className="space-y-1.5 text-slate-400">
            {caretakerAlertLog.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD MEDICATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-700 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add Daily Cardiac Medication</h3>
                <p className="text-xs text-slate-400">Configure dosage schedule and push notifications</p>
              </div>
            </div>

            {/* Quick Cardiac Presets */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Select Common Cardiac Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cardiacPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitNewMedication} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Clopidogrel (Plavix)"
                  className="glass-input w-full rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 75mg"
                    className="glass-input w-full rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Therapeutic Class</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="glass-input w-full rounded-xl px-3 py-2 bg-slate-900 text-white"
                  >
                    <option value="Beta Blocker">Beta Blocker</option>
                    <option value="Statin">Statin</option>
                    <option value="Antiplatelet">Antiplatelet</option>
                    <option value="ACE Inhibitor">ACE Inhibitor</option>
                    <option value="Anticoagulant">Anticoagulant</option>
                    <option value="Diuretic">Diuretic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value as any)}
                  className="glass-input w-full rounded-xl px-3 py-2 bg-slate-900 text-white"
                >
                  <option value="Once Daily">Once Daily</option>
                  <option value="Twice Daily">Twice Daily (Morning & Evening)</option>
                  <option value="Three Times Daily">Three Times Daily</option>
                  <option value="As Needed">As Needed (PRN)</option>
                </select>
              </div>

              {/* Dose Times */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Scheduled Push Alert Times
                </label>
                <div className="flex gap-2">
                  {doseTimes.map((t, idx) => (
                    <input
                      key={idx}
                      type="time"
                      value={t}
                      onChange={(e) => {
                        const updated = [...doseTimes];
                        updated[idx] = e.target.value;
                        setDoseTimes(updated);
                      }}
                      className="glass-input rounded-xl px-3 py-1.5 font-mono"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Clinical Instructions</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take with food, drink full glass of water"
                  className="glass-input w-full rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Pill Count</label>
                  <input
                    type="number"
                    value={totalPills}
                    onChange={(e) => setTotalPills(Number(e.target.value))}
                    className="glass-input w-full rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Remaining Supply</label>
                  <input
                    type="number"
                    value={remainingPills}
                    onChange={(e) => setRemainingPills(Number(e.target.value))}
                    className="glass-input w-full rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCaretaker}
                    onChange={(e) => setNotifyCaretaker(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-300">
                    Notify Caretaker Sarah Davis if dose is overdue by over 45 minutes
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-300">
                    Enable device push notification schedules for this medication
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition"
                >
                  Save Medication Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
