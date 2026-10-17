import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Heart, Phone, Shield, ArrowRight, UserCheck, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PATIENT } from '../../data/mockData';

export const PatientAuth: React.FC = () => {
  const { loginAsPatient, registerPatient } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState(DEMO_PATIENT.email);
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number>(55);
  const [gender, setGender] = useState('Male');
  const [bloodType, setBloodType] = useState('O+');
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerPhone, setCaretakerPhone] = useState('');
  const [caretakerRelation, setCaretakerRelation] = useState('Spouse / Primary Caretaker');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['Preventive Health']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableConditionTags = [
    'Hypertension',
    'Post-LAD Stenting',
    'Atrial Fibrillation',
    'Coronary Artery Disease',
    'Heart Failure (NYHA II)',
    'High Cholesterol',
    'Preventive Health'
  ];

  const toggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter(c => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsPatient(loginEmail, loginEmail === DEMO_PATIENT.email ? DEMO_PATIENT.name : undefined);
      navigate('/patient');
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      registerPatient({
        name,
        email,
        age: Number(age),
        gender,
        bloodType,
        caretakerName: caretakerName || 'Family Caretaker',
        caretakerPhone: caretakerPhone || '+1 (555) 019-4821',
        caretakerRelation,
        conditions: selectedConditions.length > 0 ? selectedConditions : ['General Prevention']
      });
      navigate('/patient');
    }, 600);
  };

  const handleFillDemoRegistration = () => {
    setName('Robert Martinez');
    setEmail('robert.m@example.com');
    setPassword('cardioSafe123');
    setAge(64);
    setGender('Male');
    setBloodType('B+');
    setCaretakerName('Elena Martinez (Wife)');
    setCaretakerPhone('+1 (555) 489-3210');
    setCaretakerRelation('Spouse & Health Proxy');
    setSelectedConditions(['Hypertension', 'High Cholesterol']);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <Heart className="h-8 w-8 fill-emerald-500/20 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Patient & Caretaker Health Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Access secure telemedicine consultations with top cardiologists, coordinate with family caretakers, and monitor cardiovascular wellness.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Top subtle bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Patient Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              New Patient Registration
            </button>
          </div>

          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Patient Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-[0.99] mt-2"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Sign In to Patient Portal'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Demo Sign in helper */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Evaluator Login:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(DEMO_PATIENT.email);
                      setLoginPassword('cardiolensDemo123');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline font-medium"
                  >
                    Load Sample Patient
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{DEMO_PATIENT.name} (Age {DEMO_PATIENT.age})</span>
                    <span className="text-[10px] text-slate-400">{DEMO_PATIENT.caretakerName} · {DEMO_PATIENT.bloodPressure}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Active Profile
                  </span>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">Step 1: Patient Information</span>
                <button
                  type="button"
                  onClick={handleFillDemoRegistration}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Auto-fill Sample Data
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Robert Martinez"
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm bg-slate-900 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Blood Type</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="glass-input w-full rounded-xl px-3 py-2 text-sm bg-slate-900 text-white"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="glass-input w-full rounded-xl px-3.5 py-2 text-sm"
                />
              </div>

              {/* Caretaker Information Section */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-cyan-400 block mb-2">
                  Step 2: Caretaker & Emergency Contact
                </span>
                <p className="text-[11px] text-slate-400 mb-3">
                  Designated caretaker will have access to video consultations, emergency SOS alerts, and medication schedules.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Caretaker Full Name</label>
                    <input
                      type="text"
                      required
                      value={caretakerName}
                      onChange={(e) => setCaretakerName(e.target.value)}
                      placeholder="e.g. Elena Martinez (Wife)"
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Caretaker Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={caretakerPhone}
                      onChange={(e) => setCaretakerPhone(e.target.value)}
                      placeholder="+1 (555) 489-3210"
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Cardiovascular Conditions */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Cardiac History / Focus Areas:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableConditionTags.map((tag) => {
                    const isSelected = selectedConditions.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleCondition(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md transition ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-medium'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-[0.99] mt-2"
              >
                <span>{isSubmitting ? 'Registering Patient...' : 'Complete Registration & Enter Portal'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Switch to Doctor Mode */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Are you a certified physician or healthcare specialist?{' '}
            <Link to="/auth/doctor" className="text-emerald-400 hover:underline font-medium">
              Access Doctor Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
