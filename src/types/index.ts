export type UserRole = 'doctor' | 'patient';

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  hospital: string;
  phone: string;
  email: string;
  available: boolean;
  availabilityText: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  bio: string;
  languages: string[];
  education: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  bloodType: string;
  caretakerName: string;
  caretakerPhone: string;
  caretakerRelation: string;
  conditions: string[];
  medications: string[];
  restingBpm: number;
  bloodPressure: string;
  ecgStatus: 'Normal Sinus Rhythm' | 'Sinus Tachycardia' | 'Premature Ventricular Contractions' | 'Atrial Fibrillation Warning';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  doctorData?: DoctorProfile;
  patientData?: PatientProfile;
}

export interface PatientQuery {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  subject: string;
  question: string;
  status: 'answered' | 'pending';
  response?: string;
  answeredAt?: string;
  createdAt: string;
  urgency: 'low' | 'medium' | 'urgent';
}

export interface ConsultationNote {
  id: string;
  timestamp: string;
  sender: 'doctor' | 'patient' | 'caretaker' | 'system';
  senderName: string;
  content: string;
}
