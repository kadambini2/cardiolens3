import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Lock, Mail, ShieldCheck, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_DOCTORS } from '../../data/mockData';

export const DoctorLogin: React.FC = () => {
  const { loginAsDoctor } = useAuth();
  const navigate = useNavigate();

  const [licenseId, setLicenseId] = useState('MD-892410-CARDIO');
  const [email, setEmail] = useState('elena.rossi@metroheart.org');
  const [password, setPassword] = useState('••••••••••••');
  const [hospital, setHospital] = useState('Metropolitan Heart & Vascular Center');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsDoctor({
        email,
        name: 'Dr. Elena Rossi, MD, FACC',
        hospital
      });
      navigate('/doctor');
    }, 600);
  };

  const handleSelectDoctorPreset = (doc: typeof INITIAL_DOCTORS[0]) => {
    setEmail(doc.email);
    setHospital(doc.hospital);
    setLicenseId(`MD-${Math.floor(100000 + Math.random() * 900000)}-CARD`);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Physician Clinical Portal
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
            Authorized clinician authentication gate for teleconsultation review, patient hemodynamic telemetry, and emergency triage.
          </p>
        </div>

        {/* Doctor Login Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Medical License Number / NPI
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                <input
                  type="text"
                  required
                  value={licenseId}
                  onChange={(e) => setLicenseId(e.target.value)}
                  placeholder="e.g. MD-892410-CARDIO"
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Clinical Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Hospital Affiliation
              </label>
              <input
                type="text"
                required
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="Hospital / Medical Institute"
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Clinical Credential Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition active:scale-[0.99] mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Clinical Console'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Evaluator Presets */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Instant Clinician Sign-In Presets:
            </p>
            <div className="space-y-1.5">
              {INITIAL_DOCTORS.slice(0, 3).map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelectDoctorPreset(doc)}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-slate-200 block truncate">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{doc.specialty}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 shrink-0 font-medium">Select</span>
                </button>
              ))}
            </div>
          </div>

          {/* Switch to Patient Mode */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Are you a patient or family caretaker?{' '}
            <Link to="/auth/patient" className="text-cyan-400 hover:underline font-medium">
              Go to Patient Portal & Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
