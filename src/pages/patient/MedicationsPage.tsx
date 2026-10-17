import React from 'react';
import { Pill, ShieldCheck, Heart } from 'lucide-react';
import { MedicationTracker } from '../../components/medications/MedicationTracker';

export const MedicationsPage: React.FC = () => {
  return (
    <div className="flex-1 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <Pill className="h-4 w-4" />
          <span>DAILY CARDIAC REGIMEN & ADHERENCE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Cardiac Medication Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Log daily doses, configure device push notification alerts, and monitor compliance with real-time adherence progress rings.
        </p>
      </div>

      {/* Medication Tracker Core Component */}
      <MedicationTracker />
    </div>
  );
};
