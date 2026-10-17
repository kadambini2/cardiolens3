import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Video, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Activity, 
  Search, 
  Bell, 
  ArrowRight,
  Eye,
  FileText,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useConsultation } from '../../context/ConsultationContext';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { startCall } = useConsultation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const todayAppointments = [
    { id: '1', patient: 'Priya Sharma', time: '10:00 AM', type: 'Video Consultation', avatar: 'P', status: 'ready', isVideo: true },
    { id: '2', patient: 'Amit Kumar', time: '11:30 AM', type: 'In-Person', avatar: 'A', status: 'scheduled', isVideo: false },
    { id: '3', patient: 'Sneha Patil', time: '2:00 PM', type: 'Video Consultation', avatar: 'S', status: 'scheduled', isVideo: true },
    { id: '4', patient: 'Rohan Verma', time: '4:00 PM', type: 'In-Person', avatar: 'R', status: 'scheduled', isVideo: false }
  ];

  const recentPatients = [
    { name: 'Priya Sharma', diagnosis: 'Post Hypertension', age: 32, avatar: 'P' },
    { name: 'Amit Kumar', diagnosis: 'Post Heart Surgery', age: 48, avatar: 'A' },
    { name: 'Sneha Patil', diagnosis: 'Arrhythmia Checkup', age: 29, avatar: 'S' }
  ];

  const upcomingConsultations = [
    { patient: 'Priya Sharma', time: 'Today, 10:00 AM', note: 'Hypertension Follow-up', avatar: 'P' },
    { patient: 'Rohan Verma', time: 'Dec 15, 2:30 PM', note: 'ECG Review & Stent Check', avatar: 'R' },
    { patient: 'Geeta Rai', time: 'Dec 16, 11:00 AM', note: 'Cardiac Clearance', avatar: 'G' }
  ];

  return (
    <div className="flex-1 py-6 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* 1. Top Clinical Search Bar matching Screen 3 */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, medical records, or telemetry..."
            className="w-full bg-slate-900/90 border border-slate-800 text-xs text-white rounded-xl pl-10 pr-4 py-2 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/40">
              RM
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-bold text-white block">Dr. Rahul Mishra</span>
              <span className="text-[10px] text-slate-400 block">Senior Cardiologist</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Doctor Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your patients, appointments, continuous telemetry, and teleconsultations.
        </p>
      </div>

      {/* 3. Four Metric Stats Matching Screen 3: Total Patients: 124, Today's: 6, Upcoming Video: 4, Pending: 8 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Patients</span>
            <span className="text-2xl font-extrabold font-mono text-white">124</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Today's Appointments</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">6</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Upcoming Video Calls</span>
            <span className="text-2xl font-extrabold font-mono text-cyan-400">4</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pending Reviews</span>
            <span className="text-2xl font-extrabold font-mono text-purple-400">8</span>
          </div>
        </div>
      </div>

      {/* 4. Split Grid: Today's Appointments & Patient Analytics matching Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Today's Appointments List */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Today's Appointments
            </h2>
            <span className="text-xs text-cyan-400 hover:underline cursor-pointer">View All</span>
          </div>

          <div className="space-y-2.5">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center">
                    {apt.avatar}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{apt.patient}</span>
                    <span className="text-[10px] text-slate-400">{apt.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-300 text-xs font-semibold">{apt.time}</span>
                  {apt.isVideo ? (
                    <button
                      onClick={() => {
                        startCall();
                        navigate('/patient/consultation?view=doctor');
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition"
                    >
                      Join
                    </button>
                  ) : (
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs transition border border-slate-700">
                      Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Analytics Line Chart matching Screen 3 */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Patient Analytics (Heart Rate Trends)
            </h2>
          </div>

          {/* KPI readout */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
            <div className="p-2 rounded-lg bg-slate-900/80">
              <span className="text-[10px] text-slate-400 block">Avg</span>
              <span className="font-bold text-white font-mono">78 bpm</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80">
              <span className="text-[10px] text-slate-400 block">Min</span>
              <span className="font-bold text-emerald-400 font-mono">62 bpm</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80">
              <span className="text-[10px] text-slate-400 block">Max</span>
              <span className="font-bold text-rose-400 font-mono">118 bpm</span>
            </div>
          </div>

          {/* SVG Trend Graph */}
          <div className="h-32 w-full pt-2">
            <svg className="w-full h-full" viewBox="0 0 350 90" preserveAspectRatio="none">
              <path
                d="M 10 60 Q 70 80, 130 50 T 250 40 T 340 55"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
              />
              {[
                { cx: 10, cy: 60 },
                { cx: 90, cy: 75 },
                { cx: 170, cy: 45 },
                { cx: 250, cy: 40 },
                { cx: 340, cy: 55 }
              ].map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r="3.5" fill="#f43f5e" />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* 5. Split Bottom Row: Recent Patients & Upcoming Video Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Patients Table */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Patients
            </h2>
            <span className="text-xs text-cyan-400 hover:underline cursor-pointer">View All</span>
          </div>

          <div className="space-y-2">
            {recentPatients.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-200 font-bold flex items-center justify-center">
                    {p.avatar}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.diagnosis} · Age {p.age}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/patient/heart-3d')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Video Consultations */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Upcoming Video Consultations
            </h2>
            <span className="text-xs text-cyan-400 hover:underline cursor-pointer">Schedule</span>
          </div>

          <div className="space-y-2">
            {upcomingConsultations.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center">
                    {c.avatar}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{c.patient}</span>
                    <span className="text-[10px] text-slate-400">{c.note}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-mono">{c.time}</span>
                  <button
                    onClick={() => {
                      startCall();
                      navigate('/patient/consultation?view=doctor');
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
