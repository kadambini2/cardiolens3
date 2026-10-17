import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Flame, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  Video, 
  Pill, 
  FileText, 
  Download,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Heart3DViewer } from '../../components/heart3d/Heart3DViewer';

export const Heart3DPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 py-6 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* 1. CLINICAL HEADER & LIVE TELEMETRY BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>CLINICAL 4D DIGITAL TWIN & SPECT PERFUSION SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            3D Heart Model & Myocardial Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time PBR cardiac simulation with SPECT/PET thermal ischemia thermography, mid-LAD stent lattice inspection, synchronized 12-lead ECG strip, and native <code className="text-cyan-400 font-mono">.GLB</code> 3D model import/export.
          </p>
        </div>

        {/* Telemetry Snapshot Pill */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-lg shrink-0">
          <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">SINUS RHYTHM</span>
            <span className="font-bold text-rose-400 text-xs sm:text-sm font-mono">68 BPM</span>
          </div>
          <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">PERFUSION</span>
            <span className="font-bold text-emerald-400 text-xs sm:text-sm font-mono">TIMI 3 (100%)</span>
          </div>
          <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800/80 hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-mono">STENT CALIBER</span>
            <span className="font-bold text-cyan-300 text-xs sm:text-sm font-mono">3.0 x 18 mm</span>
          </div>
        </div>
      </div>

      {/* 2. THE 3D CARDIAC TWIN & PERFUSION STUDIO */}
      <Heart3DViewer />

      {/* 3. FOUR CLINICAL EXPLANATORY FEATURE TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: 3D Thermal Heatmap */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-amber-500/40 transition group">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">3D Heatmap Perfusion</h3>
              <span className="text-[10px] text-amber-400/80 font-mono">SPECT / PET Gradient</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Visualizes myocardial blood flow with high-definition thermography: blue ischemic defect zones indicate hypoperfusion, while warm gold and crimson depict patent, hyper-perfused LAD tissue.
          </p>
        </div>

        {/* Tile 2: Real .GLB 3D Ecosystem */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-cyan-500/40 transition group">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Native .GLB Import & Export</h3>
              <span className="text-[10px] text-cyan-400/80 font-mono">Standard 3D Format</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download the active 3D model as a standard binary <code className="text-cyan-300 font-mono">.glb</code> file, or drag & drop custom patient-specific cardiac CT/MRI segmentations with automatic heart rate syncing.
          </p>
        </div>

        {/* Tile 3: LAD Stent Patency */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-emerald-500/40 transition group">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Mid-LAD Stent Architecture</h3>
              <span className="text-[10px] text-emerald-400/80 font-mono">Cobalt-Chromium Lattice</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inspect the drug-eluting stent deployed in the mid-anterior descending artery with real-time radial expansion, ensuring non-turbulent laminar blood flow to the left ventricular apex.
          </p>
        </div>

        {/* Tile 4: Conduction & Auscultation */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-rose-500/40 transition group">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Auscultation & Lead II ECG</h3>
              <span className="text-[10px] text-rose-400/80 font-mono">S1/S2 Phonocardiogram</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Listen to acoustic heart sounds (S1 Lub and S2 Dub) across 5 standard anatomical chest landmarks, synchronized millisecond-by-millisecond with the live Lead II oscilloscope ECG tracing.
          </p>
        </div>
      </div>

      {/* 4. CLINICAL CALL-TO-ACTION PORTALS (Real Website Experience) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-cyan-400">
            <Sparkles className="h-4 w-4" />
            <span>INTEGRATED CLINICIAN COLLABORATION</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Have questions about this 3D model or your post-stent recovery?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Share this 4D digital twin with Dr. Elena Rossi during your live teleconsultation or verify your daily antiplatelet schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/patient/medications')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Pill className="h-4 w-4 text-cyan-400" />
            <span>Meds Tracker</span>
          </button>

          <button
            onClick={() => navigate('/patient/consultation')}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition group"
          >
            <Video className="h-4 w-4" />
            <span>Join Video Visit</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
