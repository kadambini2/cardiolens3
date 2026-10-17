import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  PhoneCall, 
  Zap, 
  Wind, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { playCPRClick } from '../../utils/audio';
import { CPR_STEPS } from '../../data/mockData';

export const CPRGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [compressionCount, setCompressionCount] = useState(0);
  const [pulseVisual, setPulseVisual] = useState(false);

  // User Practice Compression Rate Tracker
  const [userBpm, setUserBpm] = useState<number | null>(null);
  const [cadenceFeedback, setCadenceFeedback] = useState<string>('Tap rhythmically at 100-120 BPM');
  const userTapsRef = useRef<number[]>([]);

  // 110 BPM = 545.45 ms interval
  const bpm = 110;
  const intervalMs = (60 / bpm) * 1000;

  useEffect(() => {
    let timer: any;
    if (metronomeActive) {
      timer = setInterval(() => {
        setPulseVisual(true);
        setCompressionCount(prev => {
          const next = prev + 1;
          if (soundEnabled) {
            playCPRClick(next % 30 === 0);
          }
          return next;
        });
        setTimeout(() => setPulseVisual(false), 120);
      }, intervalMs);
    } else {
      setPulseVisual(false);
    }
    return () => clearInterval(timer);
  }, [metronomeActive, soundEnabled, intervalMs]);

  const handleUserTap = () => {
    const now = Date.now();
    userTapsRef.current.push(now);
    // Keep only last 5 taps
    if (userTapsRef.current.length > 5) {
      userTapsRef.current.shift();
    }

    if (userTapsRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < userTapsRef.current.length; i++) {
        intervals.push(userTapsRef.current[i] - userTapsRef.current[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setUserBpm(calculatedBpm);

      if (calculatedBpm >= 100 && calculatedBpm <= 120) {
        setCadenceFeedback(`PERFECT AHA CADENCE: ${calculatedBpm} BPM!`);
      } else if (calculatedBpm < 100) {
        setCadenceFeedback(`TOO SLOW: ${calculatedBpm} BPM. Target 100–120 BPM.`);
      } else {
        setCadenceFeedback(`TOO FAST: ${calculatedBpm} BPM. Slow down slightly.`);
      }
    }
  };

  const getStepIcon = (name: string) => {
    switch (name) {
      case 'ShieldAlert': return ShieldAlert;
      case 'PhoneCall': return PhoneCall;
      case 'HeartPulse': return Heart;
      case 'Wind': return Wind;
      case 'Zap': return Zap;
      default: return Activity;
    }
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>AMERICAN HEART ASSOCIATION (AHA) PROTOCOL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Emergency CPR Treatment Guide & Metronome
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Critical life-support sequence for sudden cardiac arrest. High-quality chest compressions at 100–120 BPM save lives.
          </p>
        </div>

        <Link
          to="/patient/sos"
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-rose-600/30 transition self-start sm:self-auto shrink-0"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Launch SOS Emergency</span>
        </Link>
      </div>

      {/* METRONOME & COMPRESSION TRAINER (TOP FEATURE) */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Metronome Visualizer */}
          <div className="text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Activity className="h-3.5 w-3.5" />
              <span>110 BPM Life-Saving Cadence (Stayin' Alive Rhythm)</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Hands-Only CPR Compression Metronome
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Start this metronome during cardiac emergencies or practice sessions. Keep both elbows locked straight and depress the sternum at least 2 inches (5 cm) on every beat.
            </p>

            {/* Metronome Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setMetronomeActive(prev => !prev)}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg ${
                  metronomeActive
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
              >
                {metronomeActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{metronomeActive ? 'Pause Metronome' : 'Start 110 BPM Metronome'}</span>
              </button>

              <button
                onClick={() => setSoundEnabled(prev => !prev)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700"
                title={soundEnabled ? 'Mute Metronome Sound' : 'Enable Metronome Sound'}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
              </button>

              <button
                onClick={() => {
                  setCompressionCount(0);
                  setUserBpm(null);
                  userTapsRef.current = [];
                  setCadenceFeedback('Tap rhythmically at 100-120 BPM');
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition border border-slate-700"
                title="Reset Counters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: Pulsing Heart & Compression Counter */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center space-y-4">
            <div
              className={`h-36 w-36 rounded-full flex flex-col items-center justify-center transition-all duration-100 ${
                pulseVisual
                  ? 'bg-amber-500/30 border-4 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.6)] scale-110'
                  : 'bg-slate-900 border-2 border-slate-700 scale-100'
              }`}
            >
              <Heart
                className={`h-14 w-14 transition-colors ${
                  pulseVisual ? 'text-amber-400 fill-amber-500' : 'text-slate-600'
                }`}
              />
              <span className="text-[11px] font-mono font-bold text-white mt-1">
                {metronomeActive ? '110 BPM' : 'OFF'}
              </span>
            </div>

            {/* Cycle Status */}
            <div>
              <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                {compressionCount}
              </div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Compressions Delivered ({compressionCount % 30}/30 in current cycle)
              </span>
            </div>

            {/* Interactive User Compression Cadence Test */}
            <div className="w-full pt-3 border-t border-slate-800">
              <button
                onClick={handleUserTap}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-cyan-300 rounded-xl transition border border-slate-700"
              >
                Tap Here to Practice Compression Cadence
              </button>
              <div className="mt-2 text-[11px] font-semibold text-slate-300">
                {cadenceFeedback}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP AHA CPR PROTOCOL */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">
          5-Step Life-Saving Resuscitation Protocol
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          {CPR_STEPS.map((s) => {
            const Icon = getStepIcon(s.iconName);
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isActive
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">Step {s.step}</span>
                  <Icon className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold truncate text-slate-200">{s.title.split(':')[0]}</h4>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        {(() => {
          const curr = CPR_STEPS.find(s => s.step === activeStep) || CPR_STEPS[0];
          const Icon = getStepIcon(curr.iconName);
          return (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Phase {curr.step} of 5
                  </span>
                  <h3 className="text-xl font-bold text-white">{curr.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                {curr.instruction}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-medium bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Clinical Rule: {curr.keyNote}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep(p => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg disabled:opacity-40"
                  >
                    Previous Step
                  </button>
                  <button
                    disabled={activeStep === CPR_STEPS.length}
                    onClick={() => setActiveStep(p => Math.min(CPR_STEPS.length, p + 1))}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg disabled:opacity-40"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
