import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, DoctorProfile, PatientProfile, UserRole } from '../types';
import { INITIAL_DOCTORS, DEMO_PATIENT } from '../data/mockData';

interface AuthContextType {
  user: AuthUser | null;
  loginAsDoctor: (doctorInfo: Partial<DoctorProfile> & { email: string; name?: string }) => void;
  loginAsPatient: (email: string, name?: string) => void;
  registerPatient: (patientInfo: Partial<PatientProfile> & { name: string; email: string }) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updatePatientProfile: (updated: Partial<PatientProfile>) => void;
  updateDoctorProfile: (updated: Partial<DoctorProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cardiolens_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    // Default initial session: Patient Mode (Johnathan Davis)
    return {
      id: DEMO_PATIENT.id,
      name: DEMO_PATIENT.name,
      email: DEMO_PATIENT.email,
      role: 'patient',
      patientData: DEMO_PATIENT,
      doctorData: INITIAL_DOCTORS[0]
    };
  });

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Error persisting auth session:', e);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginAsDoctor = (doctorInfo: Partial<DoctorProfile> & { email: string; name?: string }) => {
    // Match with one of the initial doctors or use custom info
    const matched = INITIAL_DOCTORS.find(d => d.email.toLowerCase() === doctorInfo.email.toLowerCase()) || INITIAL_DOCTORS[0];
    const docData: DoctorProfile = {
      ...matched,
      ...doctorInfo,
      name: doctorInfo.name || matched.name
    };

    const newUser: AuthUser = {
      id: docData.id,
      name: docData.name,
      email: docData.email,
      role: 'doctor',
      doctorData: docData,
      patientData: user?.patientData || DEMO_PATIENT
    };

    setUser(newUser);
  };

  const loginAsPatient = (email: string, name?: string) => {
    const pData: PatientProfile = {
      ...DEMO_PATIENT,
      email,
      name: name || DEMO_PATIENT.name
    };

    const newUser: AuthUser = {
      id: pData.id,
      name: pData.name,
      email: pData.email,
      role: 'patient',
      patientData: pData,
      doctorData: user?.doctorData || INITIAL_DOCTORS[0]
    };

    setUser(newUser);
  };

  const registerPatient = (patientInfo: Partial<PatientProfile> & { name: string; email: string }) => {
    const newPatient: PatientProfile = {
      id: 'pat-' + Math.random().toString(36).substr(2, 6),
      name: patientInfo.name,
      email: patientInfo.email,
      age: patientInfo.age || 45,
      gender: patientInfo.gender || 'Not specified',
      bloodType: patientInfo.bloodType || 'O+',
      caretakerName: patientInfo.caretakerName || 'Primary Family Caretaker',
      caretakerPhone: patientInfo.caretakerPhone || '+1 (555) 019-2834',
      caretakerRelation: patientInfo.caretakerRelation || 'Emergency Contact',
      conditions: patientInfo.conditions && patientInfo.conditions.length > 0 ? patientInfo.conditions : ['Preventive Cardiac Health'],
      medications: patientInfo.medications || [],
      restingBpm: patientInfo.restingBpm || 72,
      bloodPressure: patientInfo.bloodPressure || '120/80 mmHg',
      ecgStatus: 'Normal Sinus Rhythm'
    };

    const newUser: AuthUser = {
      id: newPatient.id,
      name: newPatient.name,
      email: newPatient.email,
      role: 'patient',
      patientData: newPatient,
      doctorData: user?.doctorData || INITIAL_DOCTORS[0]
    };

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    setUser({
      ...user,
      role: newRole,
      name: newRole === 'doctor' ? (user.doctorData?.name || 'Dr. Elena Rossi, MD') : (user.patientData?.name || 'Johnathan Davis')
    });
  };

  const updatePatientProfile = (updated: Partial<PatientProfile>) => {
    if (!user || !user.patientData) return;
    setUser({
      ...user,
      patientData: {
        ...user.patientData,
        ...updated
      }
    });
  };

  const updateDoctorProfile = (updated: Partial<DoctorProfile>) => {
    if (!user || !user.doctorData) return;
    setUser({
      ...user,
      doctorData: {
        ...user.doctorData,
        ...updated
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginAsDoctor,
        loginAsPatient,
        registerPatient,
        logout,
        switchRole,
        updatePatientProfile,
        updateDoctorProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
