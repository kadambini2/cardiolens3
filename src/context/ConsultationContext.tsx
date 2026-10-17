import React, { createContext, useContext, useState, useEffect } from 'react';
import { DoctorProfile, PatientQuery, ConsultationNote } from '../types';
import { INITIAL_DOCTORS, INITIAL_QUERIES } from '../data/mockData';

interface ConsultationContextType {
  doctors: DoctorProfile[];
  activeDoctor: DoctorProfile | null;
  isCallActive: boolean;
  callDuration: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isCaretakerJoined: boolean;
  isScreenSharing: boolean;
  callNotes: ConsultationNote[];
  queries: PatientQuery[];
  startCall: (doctor?: DoctorProfile) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleCaretaker: () => void;
  toggleScreenShare: () => void;
  addCallNote: (content: string, sender?: 'doctor' | 'patient' | 'caretaker') => void;
  submitQuery: (doctorId: string, question: string, subject: string, urgency?: 'low' | 'medium' | 'urgent') => Promise<void>;
  answerQuery: (queryId: string, answer: string) => void;
  activeTab: 'directory' | 'call' | 'queries';
  setActiveTab: (tab: 'directory' | 'call' | 'queries') => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors] = useState<DoctorProfile[]>(INITIAL_DOCTORS);
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile | null>(INITIAL_DOCTORS[0]);
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isCaretakerJoined, setIsCaretakerJoined] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'directory' | 'call' | 'queries'>('directory');

  const [callNotes, setCallNotes] = useState<ConsultationNote[]>([
    {
      id: 'cn-1',
      timestamp: '10:00 AM',
      sender: 'doctor',
      senderName: 'Dr. Elena Rossi',
      content: 'Clinical review initiated: Tele-ECG displays sinus rhythm at 68 bpm. Prior LAD stent intact with no acute ST deviations.'
    },
    {
      id: 'cn-2',
      timestamp: '10:02 AM',
      sender: 'patient',
      senderName: 'Johnathan Davis',
      content: 'Reported morning walk tightness. Sensation resolved spontaneously after 3 minutes of rest.'
    }
  ]);

  const [queries, setQueries] = useState<PatientQuery[]>(INITIAL_QUERIES);

  // Call duration counter
  useEffect(() => {
    let timer: any;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const startCall = (doctor?: DoctorProfile) => {
    if (doctor) {
      setActiveDoctor(doctor);
    } else if (!activeDoctor) {
      setActiveDoctor(doctors[0]);
    }
    setIsCallActive(true);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsCaretakerJoined(false);
    setIsScreenSharing(false);
    setActiveTab('call');

    // Add entry note
    const docName = (doctor || activeDoctor || doctors[0]).name;
    setCallNotes(prev => [
      ...prev,
      {
        id: 'cn-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'system',
        senderName: 'Secure Telepresence Bridge',
        content: `Encrypted HIPAA-compliant teleconsultation session established with ${docName}.`
      }
    ]);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallNotes(prev => [
      ...prev,
      {
        id: 'cn-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'system',
        senderName: 'CardioLens Dispatch',
        content: `Consultation concluded. Session duration: ${Math.floor(callDuration / 60)}m ${callDuration % 60}s. Care summary saved to patient portal.`
      }
    ]);
  };

  const toggleMute = () => setIsMuted(prev => !prev);
  const toggleVideo = () => setIsVideoOff(prev => !prev);
  const toggleCaretaker = () => {
    setIsCaretakerJoined(prev => {
      const next = !prev;
      setCallNotes(notes => [
        ...notes,
        {
          id: 'cn-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'caretaker',
          senderName: 'Sarah Davis (Caretaker)',
          content: next ? 'Caretaker joined the teleconference from remote mobile device.' : 'Caretaker left the teleconference session.'
        }
      ]);
      return next;
    });
  };
  const toggleScreenShare = () => setIsScreenSharing(prev => !prev);

  const addCallNote = (content: string, sender: 'doctor' | 'patient' | 'caretaker' = 'patient') => {
    const senderNames = {
      doctor: activeDoctor?.name || 'Dr. Elena Rossi',
      patient: 'Johnathan Davis (Patient)',
      caretaker: 'Sarah Davis (Caretaker)',
      system: 'Clinical Telemetry'
    };

    setCallNotes(prev => [
      ...prev,
      {
        id: 'cn-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender,
        senderName: senderNames[sender],
        content
      }
    ]);
  };

  const submitQuery = async (
    doctorId: string,
    question: string,
    subject: string,
    urgency: 'low' | 'medium' | 'urgent' = 'medium'
  ) => {
    const doc = doctors.find(d => d.id === doctorId) || doctors[0];
    const newQuery: PatientQuery = {
      id: 'q-' + Date.now(),
      doctorId,
      doctorName: doc.name,
      patientId: 'pat-101',
      patientName: 'Johnathan Davis',
      subject: subject || 'Cardiac Consultation Query',
      question,
      status: 'pending',
      createdAt: 'Just now',
      urgency
    };

    setQueries(prev => [newQuery, ...prev]);

    // Simulated automated physician response after short delay for realistic clinical query resolution
    setTimeout(() => {
      setQueries(prev => prev.map(q => {
        if (q.id === newQuery.id) {
          const autoAnswers = [
            `Dr. ${doc.name.split(',')[0]} reviewed your query: "Thank you for documenting this carefully. Given your current hemodynamic stability, maintain your present regimen. If symptoms progress or resting BP exceeds 150/95, please trigger a direct visit or call our care coordinator."`,
            `Dr. ${doc.name.split(',')[0]} clinical recommendation: "Your reported values remain within an acceptable post-intervention therapeutic window. Keep a 3-day morning and evening log, and we will cross-reference this during our next scheduled video visit."`
          ];
          return {
            ...q,
            status: 'answered',
            response: autoAnswers[Math.floor(Math.random() * autoAnswers.length)],
            answeredAt: 'Just now'
          };
        }
        return q;
      }));
    }, 4000);
  };

  const answerQuery = (queryId: string, answer: string) => {
    setQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        return {
          ...q,
          status: 'answered',
          response: answer,
          answeredAt: 'Just now'
        };
      }
      return q;
    }));
  };

  return (
    <ConsultationContext.Provider
      value={{
        doctors,
        activeDoctor,
        isCallActive,
        callDuration,
        isMuted,
        isVideoOff,
        isCaretakerJoined,
        isScreenSharing,
        callNotes,
        queries,
        startCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleCaretaker,
        toggleScreenShare,
        addCallNote,
        submitQuery,
        answerQuery,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
};
