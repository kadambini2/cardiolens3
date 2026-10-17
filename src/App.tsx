import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConsultationProvider } from './context/ConsultationContext';
import { MedicationProvider } from './context/MedicationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Welcome } from './pages/Welcome';
import { DoctorLogin } from './pages/auth/DoctorLogin';
import { PatientAuth } from './pages/auth/PatientAuth';
import { PatientHome } from './pages/patient/PatientHome';
import { Consultation } from './pages/patient/Consultation';
import { DoctorsDirectory } from './pages/patient/DoctorsDirectory';
import { HeartGames } from './pages/patient/HeartGames';
import { CPRGuide } from './pages/patient/CPRGuide';
import { SOSPage } from './pages/patient/SOSPage';
import { MedicationsPage } from './pages/patient/MedicationsPage';
import { Heart3DPage } from './pages/patient/Heart3DPage';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ConsultationProvider>
            <MedicationProvider>
              <Routes>
              {/* Landing & Public Pages */}
              <Route path="/" element={<Welcome />} />

              {/* Authentication Routes */}
              <Route path="/auth" element={<Navigate to="/auth/patient" replace />} />
              <Route path="/auth/doctor" element={<DoctorLogin />} />
              <Route path="/auth/patient" element={<PatientAuth />} />

              {/* Doctor Clinical Workspace */}
              <Route path="/doctor" element={<Layout />}>
                <Route index element={<DoctorDashboard />} />
                <Route path="heart-3d" element={<Heart3DPage />} />
                <Route path="consultation" element={<Consultation />} />
                <Route path="doctors" element={<DoctorsDirectory />} />
                <Route path="cpr-guide" element={<CPRGuide />} />
              </Route>

              {/* Patient & Caretaker Workspace */}
              <Route path="/patient" element={<Layout />}>
                <Route index element={<PatientHome />} />
                <Route path="medications" element={<MedicationsPage />} />
                <Route path="heart-3d" element={<Heart3DPage />} />
                <Route path="consultation" element={<Consultation />} />
                <Route path="doctors" element={<DoctorsDirectory />} />
                <Route path="games" element={<HeartGames />} />
                <Route path="cpr-guide" element={<CPRGuide />} />
                <Route path="sos" element={<SOSPage />} />
              </Route>

              {/* Top-level aliases for direct navigation */}
              <Route path="/medications" element={<Navigate to="/patient/medications" replace />} />
              <Route path="/heart-3d" element={<Navigate to="/patient/heart-3d" replace />} />
              <Route path="/consultation" element={<Navigate to="/patient/consultation" replace />} />
              <Route path="/doctors" element={<Navigate to="/patient/doctors" replace />} />
              <Route path="/games" element={<Navigate to="/patient/games" replace />} />
              <Route path="/cpr-guide" element={<Navigate to="/patient/cpr-guide" replace />} />
              <Route path="/sos" element={<Navigate to="/patient/sos" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MedicationProvider>
        </ConsultationProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
}
