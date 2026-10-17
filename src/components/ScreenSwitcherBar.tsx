import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConsultation } from '../context/ConsultationContext';

export const ScreenSwitcherBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchRole } = useAuth();
  const { startCall } = useConsultation();

  const screens = [
    { num: '1', label: 'Landing Page (Home)', path: '/', action: () => navigate('/') },
    { 
      num: '2', 
      label: 'Patient Dashboard', 
      path: '/patient', 
      action: () => { switchRole('patient'); navigate('/patient'); } 
    },
    { 
      num: '3', 
      label: 'Doctor Dashboard', 
      path: '/doctor', 
      action: () => { switchRole('doctor'); navigate('/doctor'); } 
    },
    { 
      num: '4', 
      label: 'Video (Patient View)', 
      path: '/patient/consultation?view=patient', 
      action: () => { switchRole('patient'); startCall(); navigate('/patient/consultation?view=patient'); } 
    },
    { 
      num: '5', 
      label: 'Video (Doctor View)', 
      path: '/patient/consultation?view=doctor', 
      action: () => { switchRole('doctor'); startCall(); navigate('/patient/consultation?view=doctor'); } 
    },
    { 
      num: '6', 
      label: 'Cardio AI Assistant', 
      path: '/patient/cardio-ai', 
      action: () => { switchRole('patient'); navigate('/patient/cardio-ai'); } 
    },
    { 
      num: '7', 
      label: 'Heart Health Games', 
      path: '/patient/games', 
      action: () => { switchRole('patient'); navigate('/patient/games'); } 
    },
    { 
      num: '8', 
      label: 'CPR Learning Section', 
      path: '/patient/cpr-guide', 
      action: () => { switchRole('patient'); navigate('/patient/cpr-guide'); } 
    },
    { 
      num: '9', 
      label: 'Emergency SOS', 
      path: '/patient/sos', 
      action: () => { switchRole('patient'); navigate('/patient/sos'); } 
    }
  ];

  return (
    <div className="bg-slate-950/95 border-b border-cyan-500/20 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-medium z-50 sticky top-0 shadow-lg backdrop-blur">
      <div className="flex items-center gap-1.5 shrink-0 text-cyan-400 font-bold uppercase tracking-wider pl-1">
        <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
        <span className="hidden sm:inline">UI/UX Prototype Navigation:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {screens.map((s) => {
          const isActive = 
            location.pathname === s.path.split('?')[0] && 
            (s.path.includes('?') ? location.search === `?${s.path.split('?')[1]}` : true);

          return (
            <button
              key={s.num}
              onClick={s.action}
              className={`px-2.5 py-1 rounded-lg transition-all shrink-0 flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                isActive ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {s.num}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
