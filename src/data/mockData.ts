import { DoctorProfile, PatientProfile, PatientQuery } from '../types';

export const INITIAL_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rahul Mishra',
    title: 'Senior Cardiologist & Interventional Specialist',
    specialty: 'Interventional Cardiology & Coronary Angioplasty',
    department: 'Cardiovascular Institute',
    hospital: 'Metropolitan Heart & Vascular Center',
    phone: '+91 98765 43210',
    email: 'dr.rahul.mishra@cardiolens.com',
    available: true,
    availabilityText: 'Available Now · Video Visit Active',
    rating: 4.98,
    reviewsCount: 164,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
    bio: 'Senior cardiologist specializing in coronary interventions, hypertension management, and preventive cardiovascular care with over 18 years of clinical experience.',
    languages: ['English', 'Hindi'],
    education: 'AIIMS New Delhi / Harvard Medical School Fellow'
  },
  {
    id: 'doc-2',
    name: 'Dr. Elena Rossi, MD',
    title: 'Cardiac Electrophysiologist',
    specialty: 'Arrhythmia Management & Catheter Ablation',
    department: 'Arrhythmia Service',
    hospital: 'Pacific Memorial Cardiac Hospital',
    phone: '+1 (555) 234-8901',
    email: 'elena.rossi@cardiolens.com',
    available: true,
    availabilityText: 'Available in 15 min',
    rating: 4.92,
    reviewsCount: 112,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    bio: 'Pioneer in pulsed-field ablation and cardiac rhythm regulation.',
    languages: ['English', 'Italian'],
    education: 'Johns Hopkins School of Medicine'
  },
  {
    id: 'doc-3',
    name: 'Dr. Marcus Chen, MD, PhD',
    title: 'Advanced Heart Failure Specialist',
    specialty: 'Heart Failure & Mechanical Circulatory Support',
    department: 'Cardiology Care Unit',
    hospital: 'University Heart Institute',
    phone: '+1 (555) 890-1234',
    email: 'marcus.chen@cardiolens.com',
    available: true,
    availabilityText: 'Available Tomorrow',
    rating: 4.89,
    reviewsCount: 94,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
    bio: 'Dedicated to post-myocardial recovery and remote patient telemetry.',
    languages: ['English', 'Mandarin'],
    education: 'Stanford University School of Medicine'
  }
];

export const DEMO_PATIENT: PatientProfile = {
  id: 'pat-101',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  age: 32,
  gender: 'Female',
  bloodType: 'O+',
  caretakerName: 'Amit Sharma (Spouse)',
  caretakerPhone: '+91 9876543210',
  caretakerRelation: 'Spouse & Emergency Proxy',
  conditions: ['Post Hypertension', 'Mild Exertional Palpitations'],
  medications: ['Atenolol 25mg (2:00 PM)', 'Aspirin 81mg (Morning)'],
  restingBpm: 72,
  bloodPressure: '120/80',
  ecgStatus: 'Normal Sinus Rhythm'
};

export const INITIAL_QUERIES: PatientQuery[] = [
  {
    id: 'q-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rahul Mishra',
    patientId: 'pat-101',
    patientName: 'Priya Sharma',
    subject: 'Blood pressure reading after morning routine',
    question: 'Hello Dr. Rahul, my morning blood pressure reading was 120/80 and heart rate was 72 bpm. Is it safe to continue with the current Atenolol 25mg dosage at 2:00 PM?',
    status: 'answered',
    response: 'Hello Priya, 120/80 is an optimal reading. Please continue with your Atenolol 25mg at 2:00 PM as scheduled. Keep up with your hydration and moderate walking.',
    answeredAt: '10 minutes ago',
    createdAt: '1 hour ago',
    urgency: 'low'
  }
];

export const CPR_STEPS = [
  {
    step: 1,
    title: 'Check Responsiveness',
    instruction: 'Tap the person\'s shoulders gently. Ask loudly, "Are you OK?" Check for normal breathing (no breathing or only gasping).',
    keyNote: 'Spend no more than 10 seconds evaluating responsiveness.',
    iconName: 'ShieldAlert',
    actionText: 'Responsiveness Evaluated'
  },
  {
    step: 2,
    title: 'Call 112 / 911 & Get an AED',
    instruction: 'Direct someone specifically to call emergency services (112 / 911) and retrieve an Automated External Defibrillator (AED). If alone, put your phone on speaker with emergency dispatch.',
    keyNote: 'Put your phone on speaker to talk to dispatch while assisting.',
    iconName: 'PhoneCall',
    actionText: 'Emergency Dispatch Contacted'
  },
  {
    step: 3,
    title: 'High-Quality Chest Compressions',
    instruction: 'Place heel of one hand in the center of the chest (lower half of sternum), interlock the other hand. Lock your elbows straight and press DOWN at least 2 inches at a rate of 100 to 120 compressions per minute.',
    keyNote: 'Allow the chest to completely recoil between compressions.',
    iconName: 'HeartPulse',
    actionText: '100-120 BPM Cadence Maintained'
  },
  {
    step: 4,
    title: 'Rescue Breaths (30:2 Ratio)',
    instruction: 'After 30 deep compressions, tilt the head back, lift the chin, pinch the nose closed, and deliver 2 gentle breaths. If untrained, continue HANDS-ONLY CPR uninterrupted!',
    keyNote: 'Hands-Only CPR is just as effective for untrained bystanders.',
    iconName: 'Wind',
    actionText: '30:2 Cycle Maintained'
  },
  {
    step: 5,
    title: 'Deploy AED as Soon as Available',
    instruction: 'Power ON the AED immediately. Attach electrode pads to bare dry chest as diagrammed. Stop compressions when AED says "Analyzing heart rhythm". Deliver shock only if advised, then immediately resume CPR.',
    keyNote: 'Do not touch the patient while a shock is being delivered.',
    iconName: 'Zap',
    actionText: 'AED Connected & Guided'
  }
];

export const CARDIAC_QUIZ = [
  {
    id: 1,
    question: 'Which part of the heart pumps oxygenated blood to the body?',
    options: [
      'Right Atrium',
      'Left Ventricle',
      'Right Ventricle',
      'Left Atrium'
    ],
    correctIndex: 1,
    explanation: 'The Left Ventricle has the thickest muscular myocardium and is responsible for pumping oxygen-rich blood through the aortic valve into the systemic circulation.'
  },
  {
    id: 2,
    question: 'What is considered a normal resting heart rate for healthy adults?',
    options: [
      '40 to 60 bpm',
      '60 to 100 bpm',
      '105 to 130 bpm',
      '135 to 160 bpm'
    ],
    correctIndex: 1,
    explanation: 'A normal resting heart rate for adults ranges from 60 to 100 beats per minute (bpm). Well-trained endurance athletes may have lower resting rates.'
  },
  {
    id: 3,
    question: 'According to AHA CPR guidelines, what is the recommended chest compression rate per minute?',
    options: [
      '60 to 80 compressions/min',
      '80 to 100 compressions/min',
      '100 to 120 compressions/min',
      '140 to 160 compressions/min'
    ],
    correctIndex: 2,
    explanation: 'A compression rate of 100–120 beats per minute (often matched to the rhythm of "Stayin\' Alive") maintains optimal coronary and cerebral blood perfusion.'
  },
  {
    id: 4,
    question: 'Which major coronary artery supplies blood to the front of the heart and left ventricle?',
    options: [
      'Left Anterior Descending Artery (LAD)',
      'Right Coronary Artery (RCA)',
      'Left Circumflex Artery (LCX)',
      'Posterior Descending Artery (PDA)'
    ],
    correctIndex: 0,
    explanation: 'The Left Anterior Descending (LAD) coronary artery runs down the anterior interventricular sulcus and perfuses the anterior wall and septum of the left ventricle.'
  }
];
