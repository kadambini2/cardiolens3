import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  PhoneCall, 
  ArrowRight, 
  Sparkles, 
  Stethoscope, 
  Video, 
  Gamepad2, 
  BookOpen, 
  AlertTriangle, 
  Bot, 
  Users, 
  Layers, 
  Activity,
  CheckCircle2,
  Calendar,
  Eye,
  Pill
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Heart3DViewer } from '../components/heart3d/Heart3DViewer';
import { ThemeToggle } from '../components/ThemeToggle';

export const Welcome: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="flex-1 flex flex-col bg-[#070d1e] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Header matching Screen 1 Landing Page */}
      <header className="border-b border-slate-800/80 bg-[#070d1e]/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-600/25">
            <Heart className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Cardio<span className="text-cyan-400">Lens</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <Link to="/" className="text-cyan-400 font-bold hover:text-cyan-300 transition">Home</Link>
          <Link to="/patient/heart-3d" className="hover:text-white transition">3D Heart</Link>
          <a href="#features" className="hover:text-white transition">Features</a>
          <Link to="/patient/doctors" className="hover:text-white transition">Find a Doctor</Link>
          <Link to="/patient/cpr-guide" className="hover:text-white transition">Learn CPR</Link>
          <Link to="/patient/games" className="hover:text-white transition">Heart Games</Link>
        </nav>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative hidden md:block w-44 lg:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search..."
              className="w-full bg-slate-900/90 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-1.5 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <ThemeToggle />

          <Link
            to="/auth/patient"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-200 transition"
          >
            Patient Login
          </Link>

          <Link
            to="/auth/doctor"
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-md shadow-cyan-500/20"
          >
            Doctor Login
          </Link>

          <Link
            to="/patient/sos"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-600/30"
          >
            <PhoneCall className="h-3 w-3" />
            <span>Emergency SOS</span>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-8 py-10 lg:py-16 max-w-7xl mx-auto w-full">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Heart <br />
              <span className="text-white">Deserves</span> <br />
              <span className="text-cyan-400">Smarter Care.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover your heart, understand your health, connect with healthcare professionals, and access essential emergency guidance with CardioLens.
            </p>

            {/* Main CTA buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                to="/patient/heart-3d"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <span>Explore 3D Heart</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/auth/patient"
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
              >
                Get Started
              </Link>
            </div>

            {/* Secondary CTA buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/patient/consultation"
                className="bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Video className="h-3.5 w-3.5 text-cyan-400" />
                <span>Book Video Consultation</span>
              </Link>
              <Link
                to="/patient/sos"
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-red-600/30"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Emergency SOS</span>
              </Link>
            </div>
          </div>

          {/* Center / Right Column: 3D Heart & Callout Badges */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[440px] sm:min-h-[500px]">
            {/* Background glowing rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] rounded-full border border-cyan-500/20 bg-cyan-950/20 animate-pulse"></div>
              <div className="absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border border-rose-500/20"></div>
            </div>

            {/* Embedded 3D Heart Viewer */}
            <div className="w-full h-[460px] sm:h-[500px] rounded-3xl overflow-hidden relative z-10">
              <Heart3DViewer />
            </div>

            {/* Interactive 3D Heart Card Overlay on bottom-right matching image */}
            <Link
              to="/patient/heart-3d"
              className="hidden sm:flex absolute bottom-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl items-center gap-3 hover:border-cyan-400 transition group max-w-xs"
            >
              <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Heart className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition">
                  Interactive 3D Heart
                </span>
                <span className="text-[10px] text-slate-400 block line-clamp-1">
                  Explore the human heart in 3D and learn about structure.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Six Circular Glowing Feature Icons matching Screen 1 */}
      <section id="features" className="px-4 sm:px-8 py-8 border-y border-slate-800/80 bg-slate-950/60 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Medications Tracker', desc: 'Schedule doses and track daily adherence', icon: Pill, to: '/patient/medications', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
            { title: '3D Heart & Heatmap', desc: 'Anatomical 4D twin with SPECT perfusion', icon: Heart, to: '/patient/heart-3d', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
            { title: 'Find a Doctor', desc: 'Connect with cardiologists & direct phone lines', icon: Users, to: '/patient/doctors', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
            { title: 'Video Consultation', desc: 'Live clinical video visits with specialists', icon: Video, to: '/patient/consultation', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
            { title: 'Learn CPR', desc: '110 BPM metronome & AHA guidance', icon: BookOpen, to: '/patient/cpr-guide', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
            { title: 'Emergency SOS', desc: 'One-touch 911 & GPS caretaker alert', icon: AlertTriangle, to: '/patient/sos', color: 'text-red-400 bg-red-500/10 border-red-500/30' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.to}
                className="glass-card rounded-2xl p-4 text-center hover:border-slate-600 transition flex flex-col items-center justify-between group"
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 border ${item.color} group-hover:scale-110 transition shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. "How CardioLens Works" 4-Step Process matching Screen 1 */}
      <section className="px-4 sm:px-8 py-14 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How CardioLens Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            From preventive daily tracking to emergency life support in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: 'Create Your Account',
              desc: 'Sign up as a patient or doctor and set your profile.'
            },
            {
              step: '2',
              title: 'Explore & Learn',
              desc: 'Use AI, 3D heart, games, and emergency resources.'
            },
            {
              step: '3',
              title: 'Book Consultation',
              desc: 'Find doctors and book with certified specialists.'
            },
            {
              step: '4',
              title: 'Get Care & Support',
              desc: 'Video call, follow-up, and 1-touch emergency help.'
            }
          ].map((item) => (
            <div key={item.step} className="glass-card rounded-2xl p-5 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-sm font-mono mb-3 shadow-md shadow-cyan-500/20">
                {item.step}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
