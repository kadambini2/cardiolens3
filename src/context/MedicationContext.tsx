import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Medication, 
  MedicationDose, 
  DayAdherence, 
  DailyAdherenceRecord, 
  StreakData 
} from '../types/medications';
import confetti from 'canvas-confetti';
import { playHeartbeatSound } from '../utils/audio';

interface MedicationContextType {
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'doses'> & { doseTimes: string[] }) => void;
  removeMedication: (id: string) => void;
  toggleDoseStatus: (medId: string, doseId: string) => void;
  markDoseSkipped: (medId: string, doseId: string) => void;
  markAllTodayTaken: () => void;
  todayStats: {
    totalDoses: number;
    takenDoses: number;
    percent: number;
    streakDays: number;
    isComplete: boolean;
  };
  streakData: StreakData;
  weeklyHistory: DayAdherence[];
  historicalRecords: DailyAdherenceRecord[];
  pushPermission: NotificationPermission | 'unsupported';
  requestPushPermission: () => Promise<void>;
  sendTestPushNotification: (medName?: string) => void;
  caretakerAlertLog: string[];
}

const STORAGE_KEY = 'cardiolens_patient_meds_v1';
const HISTORY_STORAGE_KEY = 'cardiolens_adherence_history_v1';

const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Metoprolol Succinate',
    dosage: '25mg (Extended Release)',
    category: 'Beta Blocker',
    instructions: 'Take 1 tablet in the morning with breakfast to regulate heart rate & BP.',
    frequency: 'Once Daily',
    color: 'emerald',
    notifyCaretakerOnMiss: true,
    totalPills: 90,
    remainingPills: 42,
    pushEnabled: true,
    doses: [
      { id: 'd-1', time: '08:00', label: 'Morning Dose (8:00 AM)', taken: true, takenAt: '08:04 AM' }
    ]
  },
  {
    id: 'med-2',
    name: 'Atorvastatin',
    dosage: '40mg',
    category: 'Statin',
    instructions: 'Take at night before bed to stabilize arterial plaque and reduce LDL.',
    frequency: 'Once Daily',
    color: 'cyan',
    notifyCaretakerOnMiss: true,
    totalPills: 60,
    remainingPills: 28,
    pushEnabled: true,
    doses: [
      { id: 'd-2', time: '21:00', label: 'Evening Dose (9:00 PM)', taken: false }
    ]
  },
  {
    id: 'med-3',
    name: 'Aspirin (Cardio-Chewable)',
    dosage: '81mg (Low Dose)',
    category: 'Antiplatelet',
    instructions: 'Antiplatelet therapy for coronary stent patency.',
    frequency: 'Once Daily',
    color: 'rose',
    notifyCaretakerOnMiss: false,
    totalPills: 100,
    remainingPills: 76,
    pushEnabled: true,
    doses: [
      { id: 'd-3', time: '08:30', label: 'Morning Dose (8:30 AM)', taken: true, takenAt: '08:32 AM' }
    ]
  },
  {
    id: 'med-4',
    name: 'Lisinopril',
    dosage: '10mg',
    category: 'ACE Inhibitor',
    instructions: 'Renal & afterload reduction for cardiovascular longevity.',
    frequency: 'Once Daily',
    color: 'purple',
    notifyCaretakerOnMiss: true,
    totalPills: 60,
    remainingPills: 18,
    pushEnabled: true,
    doses: [
      { id: 'd-4', time: '12:00', label: 'Midday Dose (12:00 PM)', taken: false }
    ]
  }
];

// Generate 14 past consecutive days of 100% adherence (Oct 3 to Oct 16)
function generateInitialHistoricalRecords(): DailyAdherenceRecord[] {
  const records: DailyAdherenceRecord[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 14; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const month = d.toLocaleString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    const dayName = daysOfWeek[d.getDay()];

    records.push({
      date: dateStr,
      formattedDate: `${month} ${dayNum}`,
      dayName,
      totalDoses: 4,
      takenDoses: 4,
      allTaken: true,
      medicationNames: ['Metoprolol 25mg', 'Atorvastatin 40mg', 'Aspirin 81mg', 'Lisinopril 10mg']
    });
  }

  return records;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_MEDICATIONS;
  });

  const [historicalRecords] = useState<DailyAdherenceRecord[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    const initial = generateInitialHistoricalRecords();
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  });

  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [caretakerAlertLog, setCaretakerAlertLog] = useState<string[]>([
    'Caretaker Sarah Davis synced: Morning Metoprolol 25mg confirmed taken at 08:04 AM.',
    'Caretaker Sarah Davis synced: Morning Aspirin 81mg confirmed taken at 08:32 AM.',
    '14-Day Perfect Streak Milestone logged to patient clinical chart.'
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch {
      // ignore
    }
  }, [medications]);

  // Request browser push notification permission
  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPushPermission(result);
        if (result === 'granted') {
          new Notification('CardioLens Push Notifications Enabled', {
            body: 'You will receive scheduled reminders for your daily cardiac medications.',
            icon: '/favicon.ico'
          });
        }
      } catch (err) {
        console.error('Notification permission error', err);
      }
    }
  };

  const sendTestPushNotification = (medName: string = 'Metoprolol 25mg') => {
    playHeartbeatSound(120, 0.12);
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`CardioLens Reminder: Time for ${medName}`, {
        body: 'Scheduled dose now due. Confirm in CardioLens to sync with your cardiologist and caretaker.',
        icon: '/favicon.ico',
        tag: 'cardiolens-med-alert'
      });
    } else {
      // In-app fallback alert
      alert(`[PUSH ALERT SIMULATION] Time for your scheduled cardiac dose: ${medName}\nCaretaker Sarah Davis will be notified upon confirmation.`);
    }
  };

  const addMedication = (data: Omit<Medication, 'id' | 'doses'> & { doseTimes: string[] }) => {
    const newId = 'med-' + Date.now();
    const doses: MedicationDose[] = data.doseTimes.map((t, idx) => ({
      id: `d-${Date.now()}-${idx}`,
      time: t,
      label: `Scheduled Dose (${t})`,
      taken: false
    }));

    const newMed: Medication = {
      ...data,
      id: newId,
      doses
    };

    setMedications(prev => [newMed, ...prev]);
  };

  const removeMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const toggleDoseStatus = (medId: string, doseId: string) => {
    setMedications(prev => {
      const updated = prev.map(m => {
        if (m.id !== medId) return m;

        const updatedDoses = m.doses.map(d => {
          if (d.id !== doseId) return d;
          const willBeTaken = !d.taken;
          if (willBeTaken) {
            playHeartbeatSound(110, 0.08);
            // Log caretaker notification
            if (m.notifyCaretakerOnMiss) {
              setCaretakerAlertLog(log => [
                `Caretaker Sarah Davis notified: ${m.name} ${m.dosage} confirmed taken at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
                ...log.slice(0, 8)
              ]);
            }
          }
          return {
            ...d,
            taken: willBeTaken,
            takenAt: willBeTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            skipped: false
          };
        });

        return {
          ...m,
          remainingPills: Math.max(0, m.remainingPills + (m.doses.find(d => d.id === doseId)?.taken ? 1 : -1)),
          doses: updatedDoses
        };
      });

      // Check if all doses for today are now taken
      const allDoses = updated.flatMap(m => m.doses);
      const total = allDoses.length;
      const taken = allDoses.filter(d => d.taken).length;
      if (total > 0 && taken === total) {
        // Trigger celebratory confetti for completing today's streak!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setCaretakerAlertLog(log => [
          `🔥 All scheduled doses completed for today! Adherence streak extended to 15 days!`,
          ...log.slice(0, 8)
        ]);
      }

      return updated;
    });
  };

  // Mark all doses for today as taken in one click
  const markAllTodayTaken = () => {
    setMedications(prev => {
      const updated = prev.map(m => ({
        ...m,
        doses: m.doses.map(d => ({
          ...d,
          taken: true,
          takenAt: d.takenAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          skipped: false
        }))
      }));

      playHeartbeatSound(130, 0.15);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setCaretakerAlertLog(log => [
        `🎉 All today's medications marked as taken! 15-day streak achieved! Caretaker Sarah Davis and Dr. Elena Rossi notified.`,
        ...log.slice(0, 8)
      ]);

      return updated;
    });
  };

  const markDoseSkipped = (medId: string, doseId: string) => {
    setMedications(prev => prev.map(m => {
      if (m.id !== medId) return m;
      return {
        ...m,
        doses: m.doses.map(d => d.id === doseId ? { ...d, skipped: true, taken: false } : d)
      };
    }));
  };

  // Compute Today's Adherence Stats
  const allDoses = medications.flatMap(m => m.doses);
  const totalDoses = allDoses.length;
  const takenDoses = allDoses.filter(d => d.taken).length;
  const percent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;
  const isTodayComplete = totalDoses > 0 && takenDoses === totalDoses;

  // Streak Calculation:
  // Count consecutive days where all doses were taken.
  // Historical consecutive streak up to yesterday:
  let previousDaysStreak = 0;
  for (let i = historicalRecords.length - 1; i >= 0; i--) {
    if (historicalRecords[i].allTaken) {
      previousDaysStreak++;
    } else {
      break;
    }
  }

  // Current streak accounts for whether today's doses are fully taken or still pending
  const currentStreak = isTodayComplete ? previousDaysStreak + 1 : previousDaysStreak;
  const bestStreak = Math.max(21, currentStreak);

  // Milestones: 7 days -> 14 days -> 21 days -> 30 days -> 60 days
  let nextMilestone = 21;
  let milestoneTitle = '3-Week Gold Plaque Shield';

  if (currentStreak < 7) {
    nextMilestone = 7;
    milestoneTitle = '1-Week Bronze Stent Guardian';
  } else if (currentStreak < 14) {
    nextMilestone = 14;
    milestoneTitle = '2-Week Silver Heart Protector';
  } else if (currentStreak < 21) {
    nextMilestone = 21;
    milestoneTitle = '3-Week Gold Plaque Shield';
  } else if (currentStreak < 30) {
    nextMilestone = 30;
    milestoneTitle = '30-Day Diamond Cardio Champion';
  } else {
    nextMilestone = 60;
    milestoneTitle = '60-Day Master of Adherence';
  }

  const prevMilestoneBase = nextMilestone === 7 ? 0 : nextMilestone === 14 ? 7 : nextMilestone === 21 ? 14 : 21;
  const progressToMilestone = Math.min(
    100,
    Math.round(((currentStreak - prevMilestoneBase) / (nextMilestone - prevMilestoneBase)) * 100)
  );

  const streakData: StreakData = {
    currentStreak,
    previousDaysStreak,
    bestStreak,
    isTodayComplete,
    remainingToday: Math.max(0, totalDoses - takenDoses),
    streakStatus: isTodayComplete ? 'completed_today' : 'in_progress_today',
    nextMilestone,
    milestoneTitle,
    progressToMilestone,
    history: historicalRecords
  };

  const todayStats = {
    totalDoses,
    takenDoses,
    percent,
    streakDays: currentStreak,
    isComplete: isTodayComplete
  };

  // 7-day adherence history for visual weekly strip
  const weeklyHistory: DayAdherence[] = [
    { day: 'Sun', date: 'Oct 11', takenCount: 4, totalCount: 4, percent: 100, allTaken: true },
    { day: 'Mon', date: 'Oct 12', takenCount: 4, totalCount: 4, percent: 100, allTaken: true },
    { day: 'Tue', date: 'Oct 13', takenCount: 4, totalCount: 4, percent: 100, allTaken: true },
    { day: 'Wed', date: 'Oct 14', takenCount: 4, totalCount: 4, percent: 100, allTaken: true },
    { day: 'Thu', date: 'Oct 15', takenCount: 4, totalCount: 4, percent: 100, allTaken: true },
    { day: 'Fri', date: 'Oct 16', takenCount: 4, totalCount: 4, percent: 100, allTaken: true },
    { 
      day: 'Sat', 
      date: 'Today', 
      takenCount: takenDoses, 
      totalCount: totalDoses, 
      percent: percent, 
      isToday: true, 
      allTaken: isTodayComplete 
    }
  ];

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        removeMedication,
        toggleDoseStatus,
        markDoseSkipped,
        markAllTodayTaken,
        todayStats,
        streakData,
        weeklyHistory,
        historicalRecords,
        pushPermission,
        requestPushPermission,
        sendTestPushNotification,
        caretakerAlertLog
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within MedicationProvider');
  }
  return context;
};
