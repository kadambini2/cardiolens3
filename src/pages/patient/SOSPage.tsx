import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Heart, 
  UserCheck, 
  CheckCircle2, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  X,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playEmergencyPulse } from '../../utils/audio';

export const SOSPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const patient = user?.patientData;

  const [countdown, setCountdown] = useState<number | null>(5);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [sirenMuted, setSirenMuted] = useState<boolean>(false);
  const [gpsLocation, setGpsLocation] = useState<string>('37.7749° N, 122.4194° W (San Francisco, CA)');
  const [dispatchStatus, setDispatchStatus] = useState<string>('Broadcasting high-priority cardiac telemetry to regional 911 EMS...');

  // Get real GPS if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° W (Device GPS)`);
        },
        () => {
          // Keep default mock coordinates
        }
      );
    }
  }, []);

  // 5-second countdown timer before official dispatch
  useEffect(() => {
    let timer: any;
    if (countdown !== null && countdown > 0) {
      if (!sirenMuted) {
        playEmergencyPulse();
      }
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsDispatched(true);
      setCountdown(null);
      setDispatchStatus('911 EMS Dispatched. Caretaker SMS alert delivered. Stand by for paramedic arrival.');
    }
    return () => clearTimeout(timer);
  }, [countdown, sirenMuted]);

  const handleCancel = () => {
    setCountdown(null);
    setIsDispatched(false);
    navigate('/patient');
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Top Warning Banner */}
      <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.35)]">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-600/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Pulsing Emergency Icon */}
        <div className="h-20 w-20 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto mb-4 animate-bounce shadow-xl shadow-rose-600/50">
          <AlertTriangle className="h-10 w-10" />
        </div>

        {countdown !== null && countdown > 0 ? (
          /* Grace Window Countdown */
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              DISPATCHING CARDIAC EMERGENCY SERVICES
            </h1>
            <p className="text-sm text-rose-200 mb-6">
              Grace window active. Emergency broadcast begins in:
            </p>

            <div className="text-6xl font-extrabold font-mono text-white mb-6 tabular-nums">
              00:0{countdown}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleCancel}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition border border-slate-600"
              >
                Cancel Accidental Alert
              </button>
              <button
                onClick={() => setCountdown(0)}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-3 rounded-xl text-xs shadow-lg transition"
              >
                Dispatch Immediately
              </button>
            </div>
          </div>
        ) : (
          /* DISPATCHED ACTIVE STATE */
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-rose-600 px-4 py-1 rounded-full text-xs font-mono font-bold tracking-widest text-white uppercase animate-pulse">
              <Radio className="h-4 w-4" />
              <span>EMERGENCY DISPATCH ACTIVE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Emergency Services Notified
            </h1>
            <p className="text-sm text-rose-200 max-w-xl mx-auto leading-relaxed">
              {dispatchStatus}
            </p>

            {/* Direct Dial Action */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:911"
                className="flex items-center gap-2 bg-white text-slate-950 font-extrabold px-8 py-4 rounded-xl text-sm shadow-2xl hover:bg-slate-100 transition active:scale-95"
              >
                <PhoneCall className="h-5 w-5 text-rose-600" />
                <span>Call 911 Directly</span>
              </a>

              <Link
                to="/patient/cpr-guide"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-4 rounded-xl text-sm shadow-xl transition"
              >
                <BookOpen className="h-5 w-5" />
                <span>Open CPR Guide & 110 BPM Metronome</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Automated Telemetry & Transmission Manifest */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Automated Emergency Broadcast Manifest</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Current GPS Coordinates</span>
              <span className="text-white font-mono font-semibold">{gpsLocation}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <UserCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Caretaker Alerted</span>
              <span className="text-white font-semibold">
                {patient?.caretakerName || 'Sarah Davis (Daughter)'} · {patient?.caretakerPhone || '+1 (555) 912-3481'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Heart className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Cardiac Profile Sent to Paramedics</span>
              <span className="text-white">
                {patient?.conditions?.join(', ') || 'Post-LAD Stenting, Mild Hypertension'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Activity className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Latest Hemodynamics & Blood Type</span>
              <span className="text-white font-mono">
                BP: {patient?.bloodPressure || '124/82'} · HR: {patient?.restingBpm || 68} BPM · Blood: {patient?.bloodType || 'A+'}
              </span>
            </div>
          </div>
        </div>

        {/* Audio control & Dismiss */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setSirenMuted(prev => !prev)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white"
          >
            {sirenMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-rose-400" />}
            <span>{sirenMuted ? 'Unmute Siren Pulse' : 'Mute Siren Tone'}</span>
          </button>

          <button
            onClick={() => navigate('/patient')}
            className="text-slate-400 hover:text-slate-200 underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
