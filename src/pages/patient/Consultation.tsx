import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Users, 
  Share2, 
  MessageSquare, 
  Activity, 
  Heart, 
  Send, 
  CheckCircle2, 
  MoreVertical,
  Maximize2,
  FileText,
  UserCheck,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useConsultation } from '../../context/ConsultationContext';
import { useAuth } from '../../context/AuthContext';

export const Consultation: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryView = searchParams.get('view');
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>(
    queryView === 'doctor' || user?.role === 'doctor' ? 'doctor' : 'patient'
  );

  const { 
    activeDoctor, 
    doctors, 
    isCallActive, 
    callDuration, 
    isMuted, 
    isVideoOff, 
    isCaretakerJoined, 
    isScreenSharing, 
    callNotes, 
    startCall, 
    endCall, 
    toggleMute, 
    toggleVideo, 
    toggleCaretaker, 
    toggleScreenShare, 
    addCallNote 
  } = useConsultation();

  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'records'>('chat');
  const [chatInput, setChatInput] = useState('');

  const doctor = activeDoctor || doctors[0];
  const patient = user?.patientData;

  useEffect(() => {
    if (queryView === 'doctor' || queryView === 'patient') {
      setViewMode(queryView as any);
    }
  }, [queryView]);

  const formatTimer = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addCallNote(chatInput, viewMode === 'doctor' ? 'doctor' : 'patient');
    setChatInput('');

    // Response
    setTimeout(() => {
      if (viewMode === 'patient') {
        addCallNote(`Dr. Rahul Mishra: "Noted Priya. Your current rhythm is 72 bpm which is excellent. Continue taking Atenolol at 2:00 PM."`, 'doctor');
      } else {
        addCallNote(`Priya Sharma: "Thank you Dr. Rahul! I took my morning dose on time."`, 'patient');
      }
    }, 1200);
  };

  // High quality portrait photos matching Screens 4 & 5
  const patientPhoto = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80';
  const doctorPhoto = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="flex-1 py-4 sm:py-6 px-3 sm:px-6 max-w-7xl mx-auto w-full flex flex-col space-y-4">
      {/* View Switcher Strip matching Screens 4 & 5 */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-2 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider pl-1">
            Video Consultation Mode:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setViewMode('patient');
                setSearchParams({ view: 'patient' });
              }}
              className={`px-3 py-1 rounded-md transition font-semibold ${
                viewMode === 'patient'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Patient View
            </button>
            <button
              onClick={() => {
                setViewMode('doctor');
                setSearchParams({ view: 'doctor' });
              }}
              className={`px-3 py-1 rounded-md transition font-semibold ${
                viewMode === 'doctor'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5. Doctor View
            </button>
          </div>
        </div>

        {!isCallActive ? (
          <button
            onClick={() => startCall()}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg transition shadow-md shadow-cyan-500/20"
          >
            Start Video Call
          </button>
        ) : (
          <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Encrypted Call</span>
          </span>
        )}
      </div>

      {/* Main Video Consultation Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[580px]">
        {/* Main Video Viewport (Takes 12 cols or 8 cols if doctor side panel is open) */}
        <div className={`${viewMode === 'doctor' ? 'lg:col-span-8' : 'lg:col-span-12'} glass-card rounded-2xl overflow-hidden relative flex flex-col justify-between bg-slate-950 border border-slate-800 shadow-2xl min-h-[540px]`}>
          {/* Main Remote Feed: 
              In Patient View -> shows Dr. Rahul Mishra
              In Doctor View -> shows Priya Sharma 
          */}
          <div className="absolute inset-0 z-0">
            <img
              src={viewMode === 'patient' ? doctorPhoto : patientPhoto}
              alt="Remote Video"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40"></div>
          </div>

          {/* Top Overlay: Session Title & Info */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between text-xs">
            <div className="bg-slate-950/80 backdrop-blur px-3.5 py-1.5 rounded-xl border border-slate-800 text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>
                {viewMode === 'patient' 
                  ? 'Consultation with Dr. Rahul Mishra' 
                  : 'Patient: Priya Sharma (Age 32 · Hypertension)'}
              </span>
            </div>

            {/* PiP (Picture in Picture) of local user */}
            <div className="w-32 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-cyan-400 shadow-xl bg-slate-900 relative">
              <img
                src={viewMode === 'patient' ? patientPhoto : doctorPhoto}
                alt="Self View"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1.5 bg-slate-950/90 text-[9px] px-1.5 py-0.2 rounded text-white font-mono">
                {viewMode === 'patient' ? 'Priya Sharma (You)' : 'Dr. Rahul Mishra (You)'}
              </div>
            </div>
          </div>

          {/* Bottom Call Bar matching Screens 4 & 5 */}
          <div className="relative z-10 bg-slate-950/90 backdrop-blur-md px-6 py-3.5 border-t border-slate-800 flex items-center justify-between gap-4">
            {/* Timer readout */}
            <div className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>{formatTimer(callDuration || 754)}</span>
            </div>

            {/* Center Call Buttons matching image */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition ${
                  isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition ${
                  isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              >
                {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full transition ${
                  isScreenSharing ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Share Screen"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <button
                onClick={endCall}
                className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-600/40 transition active:scale-95"
                title="End Call"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Clinical Side Panel (Screen 5) */}
        {viewMode === 'doctor' && (
          <div className="lg:col-span-4 glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              {/* Patient Info Header matching Screen 5 */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Priya Sharma</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                    Stable
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>Age 32 · Female · Blood Type O+</span>
                </div>
                <div className="text-[11px] text-cyan-300 font-mono">
                  Current Vitals: HR 72 bpm · BP 120/80
                </div>
              </div>

              {/* Tabs: Chat, Notes, Medical Records */}
              <div className="flex border-b border-slate-800 text-xs mb-3">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-1.5 text-center font-semibold transition border-b-2 ${
                    activeTab === 'chat'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Live Chat
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-1.5 text-center font-semibold transition border-b-2 ${
                    activeTab === 'notes'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Clinical Notes
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`flex-1 py-1.5 text-center font-semibold transition border-b-2 ${
                    activeTab === 'records'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Records
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'chat' && (
                <div className="space-y-2 overflow-y-auto max-h-[300px] text-xs pr-1">
                  {callNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-2.5 rounded-xl ${
                        note.sender === 'doctor'
                          ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-500/30'
                          : 'bg-slate-900 text-slate-200 border border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-bold block text-slate-400 mb-0.5">
                        {note.senderName} · {note.timestamp}
                      </span>
                      <p>{note.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">Physician Assessment:</span>
                    <p className="text-slate-300">
                      Patient exhibits optimal compliance with Atenolol 25mg at 2:00 PM. Morning systolic/diastolic baseline 120/80 with regular rhythm.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">Plan:</span>
                    <p className="text-slate-300">
                      Maintain current dosing schedule. Next teleconsultation in 30 days.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'records' && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Baseline 12-Lead ECG</span>
                      <span className="text-[10px] text-slate-400">Normal Sinus Rhythm · 72 bpm</span>
                    </div>
                    <FileText className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Blood Chemistry Panel</span>
                      <span className="text-[10px] text-slate-400">Electrolytes & Lipids Normal</span>
                    </div>
                    <FileText className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send note or prescription advice..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
