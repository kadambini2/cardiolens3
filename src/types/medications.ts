export interface MedicationDose {
  id: string;
  time: string; // e.g. "08:00"
  label: string; // "Morning Dose"
  taken: boolean;
  takenAt?: string;
  skipped?: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g. "25mg", "1 tablet"
  category: 'Beta Blocker' | 'Statin' | 'Antiplatelet' | 'ACE Inhibitor' | 'Anticoagulant' | 'Diuretic' | 'Other';
  instructions: string; // "Take with breakfast", "Take before sleep"
  frequency: 'Once Daily' | 'Twice Daily' | 'Three Times Daily' | 'As Needed';
  doses: MedicationDose[];
  color: string;
  notifyCaretakerOnMiss: boolean;
  totalPills: number;
  remainingPills: number;
  pushEnabled: boolean;
}

export interface DayAdherence {
  day: string; // "Mon", "Tue"
  date: string; // "Oct 17"
  takenCount: number;
  totalCount: number;
  percent: number;
  isToday?: boolean;
  allTaken?: boolean;
}

export interface DailyAdherenceRecord {
  date: string; // "YYYY-MM-DD" e.g. "2026-10-16"
  formattedDate: string; // "Oct 16"
  dayName: string; // "Friday"
  totalDoses: number;
  takenDoses: number;
  allTaken: boolean;
  medicationNames?: string[];
}

export interface StreakData {
  currentStreak: number;
  previousDaysStreak: number;
  bestStreak: number;
  isTodayComplete: boolean;
  remainingToday: number;
  streakStatus: 'completed_today' | 'in_progress_today' | 'at_risk';
  nextMilestone: number;
  milestoneTitle: string;
  progressToMilestone: number; // percentage
  history: DailyAdherenceRecord[];
}
