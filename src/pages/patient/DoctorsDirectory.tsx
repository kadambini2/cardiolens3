import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  Video, 
  MessageSquare, 
  Star, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search, 
  Send, 
  X, 
  UserCheck, 
  AlertCircle,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { useConsultation } from '../../context/ConsultationContext';
import { DoctorProfile } from '../../types';

export const DoctorsDirectory: React.FC = () => {
  const { doctors, startCall, queries, submitQuery } = useConsultation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'interventional' | 'caretaker'>('all');
  
  // Query Modal State
  const [queryModalDoctor, setQueryModalDoctor] = useState<DoctorProfile | null>(null);
  const [querySubject, setQuerySubject] = useState('');
  const [queryText, setQueryText] = useState('');
  const [queryUrgency, setQueryUrgency] = useState<'low' | 'medium' | 'urgent'>('medium');
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [querySuccess, setQuerySuccess] = useState(false);

  // Phone Call Modal State
  const [phoneCallDoctor, setPhoneCallDoctor] = useState<DoctorProfile | null>(null);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'available') return doc.available;
    if (selectedFilter === 'interventional') return doc.specialty.toLowerCase().includes('interventional');
    if (selectedFilter === 'caretaker') return doc.specialty.toLowerCase().includes('caretaker');
    return true;
  });

  const handleStartConsult = (doctor: DoctorProfile) => {
    startCall(doctor);
    navigate('/patient/consultation');
  };

  const handleOpenQueryModal = (doctor: DoctorProfile) => {
    setQueryModalDoctor(doctor);
    setQuerySubject('');
    setQueryText('');
    setQueryUrgency('medium');
    setQuerySuccess(false);
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryModalDoctor || !queryText.trim()) return;

    setIsSubmittingQuery(true);
    await submitQuery(
      queryModalDoctor.id,
      queryText,
      querySubject || `Clinical Inquiry for ${queryModalDoctor.name.split(',')[0]}`,
      queryUrgency
    );
    setIsSubmittingQuery(false);
    setQuerySuccess(true);
    setTimeout(() => {
      setQueryModalDoctor(null);
      setQuerySuccess(false);
    }, 1500);
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cardiologists & Caretaker Support Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct access to board-certified cardiologists with verified phone numbers, real-time availability, and clinical query resolution.
            </p>
          </div>

          <button
            onClick={() => handleStartConsult(doctors[0])}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition self-start sm:self-auto shrink-0"
          >
            <Video className="h-4 w-4" />
            <span>Launch Video Consultation</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, specialty, or hospital..."
              className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 w-full sm:w-auto shrink-0 overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Specialists ({doctors.length})
            </button>
            <button
              onClick={() => setSelectedFilter('available')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                selectedFilter === 'available'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Available Now ({doctors.filter(d => d.available).length})
            </button>
            <button
              onClick={() => setSelectedFilter('interventional')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                selectedFilter === 'interventional'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interventional
            </button>
            <button
              onClick={() => setSelectedFilter('caretaker')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                selectedFilter === 'caretaker'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Caretaker Coordinators
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Doctor Header Strip */}
              <div className="flex items-start gap-4">
                {/* Doctor Avatar with Fallback container */}
                <div className="relative shrink-0">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-2xl object-cover border border-cyan-500/30 shadow-md"
                    onError={(e) => {
                      // Fallback if image blocked
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-900 to-slate-900 flex items-center justify-center text-cyan-300 font-bold text-lg border border-cyan-500/30 -ml-16 peer-first:hidden">
                    {doc.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white truncate">{doc.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-500">({doc.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-cyan-400 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-400 truncate">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{doc.hospital}</p>
                </div>
              </div>

              {/* Status and Direct Phone Number Bar */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      doc.available ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  ></span>
                  <span className={doc.available ? 'text-emerald-300 font-medium' : 'text-amber-300'}>
                    {doc.availabilityText}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-cyan-300 font-semibold bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-500/20">
                  <PhoneCall className="h-3 w-3 text-cyan-400" />
                  <a href={`tel:${doc.phone}`} className="hover:underline">
                    {doc.phone}
                  </a>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>
            </div>

            {/* Actions: Video Call, Direct Dial, Ask Query */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => handleStartConsult(doc)}
                className="flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-2 rounded-xl text-xs transition"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Video Visit</span>
              </button>

              <button
                onClick={() => setPhoneCallDoctor(doc)}
                className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-2 rounded-xl text-xs transition border border-slate-700"
              >
                <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />
                <span>Call Number</span>
              </button>

              <button
                onClick={() => handleOpenQueryModal(doc)}
                className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-2 rounded-xl text-xs transition border border-slate-700"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span>Solve Query</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Queries & Solutions History */}
      <div className="mt-10 glass-card rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>Patient Query Resolution Center</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review answers provided by cardiologists for questions submitted by you or your family caretaker.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            {queries.length} Total Queries Handled
          </span>
        </div>

        <div className="space-y-4">
          {queries.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{q.subject}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {q.urgency.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>To: {q.doctorName}</span> · <span>{q.createdAt}</span>
                </div>
              </div>

              {/* Patient's question */}
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-slate-300">
                <span className="font-semibold text-slate-400 block mb-1">Patient Inquiry:</span>
                "{q.question}"
              </div>

              {/* Doctor's answer */}
              {q.status === 'answered' && q.response ? (
                <div className="bg-cyan-950/20 p-3.5 rounded-lg border border-cyan-500/30 text-cyan-200">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Physician Clinical Resolution:</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{q.answeredAt}</span>
                  </div>
                  <p className="leading-relaxed">{q.response}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                  <Clock className="h-3.5 w-3.5 animate-spin" />
                  <span>Physician reviewing your telemetry and query. Expected response within 5-10 minutes.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Query Submission Modal */}
      {queryModalDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-700 relative">
            <button
              onClick={() => setQueryModalDoctor(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ask Physician a Clinical Query</h3>
                <p className="text-xs text-slate-400">Directly consult {queryModalDoctor.name}</p>
              </div>
            </div>

            {querySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">Query Submitted Successfully</h4>
                <p className="text-xs text-slate-400">
                  {queryModalDoctor.name} has been notified and will provide clinical guidance shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuery} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Symptom Category</label>
                  <input
                    type="text"
                    required
                    value={querySubject}
                    onChange={(e) => setQuerySubject(e.target.value)}
                    placeholder="e.g. Morning palpitations after caffeine, BP medication adjustment"
                    className="glass-input w-full rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Urgency Level</label>
                  <select
                    value={queryUrgency}
                    onChange={(e) => setQueryUrgency(e.target.value as any)}
                    className="glass-input w-full rounded-xl px-3 py-2 text-xs bg-slate-900 text-white"
                  >
                    <option value="low">Routine Inquiry (Non-urgent)</option>
                    <option value="medium">Moderate Concern (Next few hours)</option>
                    <option value="urgent">Urgent Clinical Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Describe your question or observation</label>
                  <textarea
                    required
                    rows={4}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Detail your symptoms, blood pressure readings, exercise tolerance, or medication questions..."
                    className="glass-input w-full rounded-xl p-3 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setQueryModalDoctor(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingQuery}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmittingQuery ? 'Transmitting...' : 'Submit Query'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Phone Call Modal */}
      {phoneCallDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-slate-700 text-center relative">
            <button
              onClick={() => setPhoneCallDoctor(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-14 w-14 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <PhoneCall className="h-6 w-6 animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Dial Physician</h3>
            <p className="text-xs text-slate-400 mb-4">{phoneCallDoctor.name}</p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-cyan-300 font-bold text-base mb-6">
              {phoneCallDoctor.phone}
            </div>

            <div className="space-y-2">
              <a
                href={`tel:${phoneCallDoctor.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Now via Device</span>
              </a>
              <button
                onClick={() => setPhoneCallDoctor(null)}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
