import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Video, 
  Users, 
  Gamepad2, 
  BookOpen, 
  AlertTriangle, 
  Calendar, 
  Pill, 
  Bot, 
  Search, 
  Bell, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  PhoneCall,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useConsultation } from '../../context/ConsultationContext';
import { useMedication } from '../../context/MedicationContext';

export const PatientHome: React.FC = () => {
  const { user } = useAuth();
  const { doctors, startCall } = useConsultation();
  const { todayStats, streakData } = useMedication();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState('');
  const patient = user?.patientData;
  const primaryDoctor = doctors[0];

  // Health Trends data (Dec 8 to Dec 14)
  const trendData = [
    { day: 'Dec 8', bpm: 74, bp: '122/82' },
    { day: 'Dec 9', bpm: 71, bp: '120/80' },
    { day: 'Dec 10', bpm: 75, bp: '124/84' },
    { day: 'Dec 11', bpm: 70, bp: '118/78' },
    { day: 'Dec 12', bpm: 73, bp: '121/81' },
    { day: 'Dec 13', bpm: 69, bp: '119/79' },
    { day: 'Dec 14', bpm: 72, bp: '120/80' }
  ];

  return (
    <div className="flex-1 py-6 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* 1. Top Search & Profile Bar matching Screen 2 */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search doctors, symptoms, or ask AI..."
            className="w-full bg-slate-900/90 border border-slate-800 text-xs text-white rounded-xl pl-10 pr-4 py-2 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center font-bold text-xs text-white">
              P
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-bold text-white block">Priya Sharma</span>
              <span className="text-[10px] text-slate-400 block">Patient Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Welcome Banner + Upcoming Appointment Card matching Screen 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Welcome Greeting */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>PATIENT HEALTH DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome Back, Priya! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              Take care of your heart, view your stats, log medications, and manage appointments.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              Resting Rhythm: Normal Sinus
            </span>
            <span>·</span>
            <Link
              to="/patient/medications"
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 font-mono transition"
            >
              <Flame className="h-3.5 w-3.5 fill-amber-400" />
              <span>{streakData.currentStreak}-Day Adherence Streak</span>
            </Link>
            <span>·</span>
            <span>Caretaker: Amit Sharma (+91 9876543210)</span>
          </div>
        </div>

        {/* Upcoming Appointment Card matching Screen 2 */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-cyan-500/30 bg-cyan-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Upcoming Appointment
              </span>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Confirmed
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <img
                src={primaryDoctor.avatar}
                alt={primaryDoctor.name}
                className="h-12 w-12 rounded-xl object-cover border border-cyan-500/40"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{primaryDoctor.name}</h4>
                <p className="text-xs text-cyan-300 truncate">Senior Cardiologist</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                  <Calendar className="h-3 w-3 text-cyan-400" />
                  <span>Dec 14, 2024 · 10:00 AM</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              startCall(primaryDoctor);
              navigate('/patient/consultation');
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Join Now</span>
          </button>
        </div>
      </div>

      {/* 3. Four Vital Metric Cards in a Row matching Screen 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Heart Rate: 72 bpm (Normal) */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <Heart className="h-6 w-6 fill-emerald-500/20" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Heart Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white">72</span>
              <span className="text-xs text-slate-400">bpm</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Normal</span>
          </div>
        </div>

        {/* Blood Pressure: 120/80 (Normal) */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Blood Pressure</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white">120/80</span>
            </div>
            <span className="text-[10px] text-blue-400 font-semibold">Normal</span>
          </div>
        </div>

        {/* Next Medicine: At 2:00 PM (Atenolol 25mg) */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Next Medicine</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold font-mono text-white">At 2:00 PM</span>
            </div>
            <span className="text-[10px] text-cyan-300 font-medium truncate block">Atenolol 25mg</span>
          </div>
        </div>

        {/* Upcoming: 2 Appointments */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Upcoming</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white">2</span>
            </div>
            <span className="text-[10px] text-purple-300 font-medium">Appointments</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions Grid (8 Cards matching Screen 2) */}
      <div>
        <h2 className="text-base font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Meds Tracker', icon: Pill, to: '/patient/medications', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
            { label: '3D Heart & Heatmap', icon: Heart, to: '/patient/heart-3d', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
            { label: 'Book Appointment', icon: Calendar, to: '/patient/doctors', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
            { label: 'Join Video Consultation', icon: Video, to: '/patient/consultation', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
            { label: 'Heart Games', icon: Gamepad2, to: '/patient/games', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
            { label: 'Learn CPR', icon: Activity, to: '/patient/cpr-guide', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
            { label: 'Find a Doctor', icon: Users, to: '/patient/doctors', color: 'bg-teal-500/15 text-teal-400 border-teal-500/30' },
            { label: 'Emergency SOS', icon: PhoneCall, to: '/patient/sos', color: 'bg-red-500/20 text-red-400 border-red-500/40' }
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="glass-card rounded-2xl p-3.5 text-center flex flex-col items-center justify-center hover:border-slate-700 transition group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border ${action.color} group-hover:scale-110 transition shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-200 leading-tight">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. "Your Health Trends" Line Graph matching Screen 2 */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Your Health Trends (Heart Rate & Blood Pressure)
            </h3>
          </div>
          <Link to="/patient/medications" className="text-xs text-cyan-400 hover:underline">
            View Details & Medication Adherence →
          </Link>
        </div>

        {/* SVG Interactive Line Chart matching Screen 2 */}
        <div className="h-48 w-full relative flex flex-col justify-end pt-6">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 140" preserveAspectRatio="none">
            {/* Horizontal grid lines */}
            <line x1="0" y1="20" x2="700" y2="20" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="0" y1="60" x2="700" y2="60" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="700" y2="100" stroke="#1e293b" strokeDasharray="4 4" />

            {/* Gradient fill */}
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Trend path */}
            <path
              d="M 50 80 Q 150 95, 250 75 T 450 100 T 650 90 L 650 140 L 50 140 Z"
              fill="url(#trendGradient)"
            />
            <path
              d="M 50 80 Q 150 95, 250 75 T 450 100 T 650 90"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
            />

            {/* Data Points */}
            {[
              { cx: 50, cy: 80, bpm: 74 },
              { cx: 150, cy: 95, bpm: 71 },
              { cx: 250, cy: 75, bpm: 75 },
              { cx: 350, cy: 105, bpm: 70 },
              { cx: 450, cy: 85, bpm: 73 },
              { cx: 550, cy: 110, bpm: 69 },
              { cx: 650, cy: 90, bpm: 72 }
            ].map((p, idx) => (
              <g key={idx}>
                <circle cx={p.cx} cy={p.cy} r="5" fill="#06b6d4" stroke="#080f1e" strokeWidth="2" />
                <text x={p.cx} y={p.cy - 10} textAnchor="middle" fill="#f8fafc" fontSize="10" fontFamily="monospace">
                  {p.bpm}
                </text>
              </g>
            ))}
          </svg>

          {/* Days Label row */}
          <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-800">
            {trendData.map(d => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
