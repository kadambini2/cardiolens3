import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Video, 
  Users, 
  Gamepad2, 
  BookOpen, 
  AlertTriangle, 
  Stethoscope, 
  LogOut, 
  UserCheck, 
  Menu, 
  X,
  PhoneCall,
  Pill
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';
import { ThemeToggle } from './ThemeToggle';

export const Layout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { isCallActive, activeDoctor, callDuration } = useConsultation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = user?.role === 'doctor';

  const patientNavLinks = [
    { to: '/patient', label: 'Overview', icon: Activity, end: true },
    { to: '/patient/medications', label: 'Meds Tracker', icon: Pill },
    { to: '/patient/heart-3d', label: '3D Heart', icon: Heart },
    { to: '/patient/consultation', label: 'Video Visit', icon: Video, badge: isCallActive ? 'Live' : undefined },
    { to: '/patient/doctors', label: 'Care Team', icon: Users },
    { to: '/patient/games', label: 'Heart Games', icon: Gamepad2 },
    { to: '/patient/cpr-guide', label: 'CPR Guide', icon: BookOpen }
  ];

  const doctorNavLinks = [
    { to: '/doctor', label: 'Clinical Console', icon: Stethoscope, end: true },
    { to: '/patient/heart-3d', label: '3D Heart Twin', icon: Heart },
    { to: '/patient/consultation', label: 'Telepresence Visit', icon: Video, badge: isCallActive ? 'Active' : undefined },
    { to: '/patient/doctors', label: 'Physician Roster', icon: Users },
    { to: '/patient/cpr-guide', label: 'CPR Protocols', icon: BookOpen }
  ];

  const navLinks = isDoctor ? doctorNavLinks : patientNavLinks;

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-rose-600/8 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Ongoing Call Banner if active and navigating away from video */}
      {isCallActive && !location.pathname.includes('/consultation') && (
        <div className="relative z-50 bg-gradient-to-r from-emerald-950/90 via-cyan-950/90 to-slate-900/90 border-b border-emerald-500/30 px-4 py-2.5 flex items-center justify-between text-xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-emerald-300">
              Active Consultation with {activeDoctor?.name || 'Physician'}
            </span>
            <span className="text-slate-400 font-mono">({formatCallTime(callDuration)})</span>
          </div>
          <button
            onClick={() => navigate('/patient/consultation')}
            className="px-3 py-1 bg-emerald-500 text-slate-950 font-semibold rounded hover:bg-emerald-400 transition"
          >
            Return to Video Room
          </button>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (4-5 nav links) - Zone 3 (Action) */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-rose-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <Heart className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Cardio<span className="text-cyan-400">Lens</span>
            </span>
          </NavLink>

          {/* Clinical / Patient Badge Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 text-[11px] text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md bg-slate-900/60">
            {isDoctor ? (
              <>
                <Stethoscope className="h-3 w-3 text-cyan-400" />
                <span className="text-cyan-300 font-medium">Physician Mode</span>
              </>
            ) : (
              <>
                <UserCheck className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Patient & Caretaker</span>
              </>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors py-1 ${
                    isActive
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 -mb-[15px]'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick SOS Trigger in Patient Mode */}
          {!isDoctor && (
            <NavLink
              to="/patient/sos"
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-lg shadow-rose-600/25 transition active:scale-95"
            >
              <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
              <span>SOS EMERGENCY</span>
            </NavLink>
          )}

          {/* Global Theme Toggle (Dark <-> Clinical Light) */}
          <ThemeToggle />

          {/* Mode Switcher Toggle */}
          <button
            onClick={() => {
              const target = isDoctor ? 'patient' : 'doctor';
              switchRole(target);
              navigate(target === 'doctor' ? '/doctor' : '/patient');
            }}
            title={`Switch to ${isDoctor ? 'Patient Mode' : 'Doctor Mode'}`}
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700/60 hover:border-cyan-500/50 px-3 py-1.5 rounded-lg transition"
          >
            {isDoctor ? (
              <>
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Patient Portal</span>
              </>
            ) : (
              <>
                <Stethoscope className="h-3.5 w-3.5 text-cyan-400" />
                <span>Doctor Portal</span>
              </>
            )}
          </button>

          {/* User Sign Out / Profile Link */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden xl:inline text-xs text-slate-400 truncate max-w-[120px]">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-md transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Sign In
            </NavLink>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex flex-col gap-3 z-40 backdrop-blur-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800">
            Navigation Menu
          </div>
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 text-sm font-medium ${
                    isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-slate-400">Display Theme:</span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => {
                const target = isDoctor ? 'patient' : 'doctor';
                switchRole(target);
                navigate(target === 'doctor' ? '/doctor' : '/patient');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-200 bg-slate-800 rounded-lg"
            >
              {isDoctor ? <UserCheck className="h-3.5 w-3.5" /> : <Stethoscope className="h-3.5 w-3.5" />}
              <span>Switch to {isDoctor ? 'Patient Mode' : 'Doctor Mode'}</span>
            </button>
            <NavLink
              to="/patient/sos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>SOS EMERGENCY ASSISTANCE</span>
            </NavLink>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>

      {/* Global Floating SOS Quick Access Button (Patient Mode Only) */}
      {!isDoctor && location.pathname !== '/patient/sos' && (
        <aside aria-label="Emergency Assistance" className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => navigate('/patient/sos')}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-[0_0_28px_rgba(225,29,72,0.45)] border border-rose-400/50 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <AlertTriangle className="h-4 w-4" />
            <span>SOS EMERGENCY</span>
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <Heart className="h-4 w-4 text-cyan-400" />
          <p>© 2026 CardioLens Cardiovascular Intelligence Platform · Real-Time Telepresence & Emergency Support</p>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <NavLink to="/patient/cpr-guide" className="hover:text-slate-200 transition">AHA CPR Protocol</NavLink>
          <span>·</span>
          <NavLink to="/patient/doctors" className="hover:text-slate-200 transition">Cardiologist Roster</NavLink>
          <span>·</span>
          <NavLink to="/patient/sos" className="text-rose-400 hover:text-rose-300 transition">Emergency Dispatch</NavLink>
        </div>
      </footer>
    </div>
  );
};
