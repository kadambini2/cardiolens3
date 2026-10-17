import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Gamepad2, 
  Zap, 
  Trophy, 
  RotateCcw, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playHeartbeatSound } from '../../utils/audio';
import { CARDIAC_QUIZ } from '../../data/mockData';

export const HeartGames: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rhythm' | 'angioplasty' | 'quiz'>('rhythm');

  return (
    <div className="flex-1 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
          <Gamepad2 className="h-4 w-4" />
          <span>INTERACTIVE CARDIAC LEARNING & COGNITIVE GAMES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          CardioLens Heart Health Games
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Strengthen your understanding of sinus rhythms, coronary hemodynamics, and cardiac physiology through interactive simulations and games.
        </p>

        {/* Game Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-slate-900/80 rounded-xl border border-slate-800 max-w-md">
          <button
            onClick={() => setActiveTab('rhythm')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'rhythm'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Heart Beat Matcher
          </button>
          <button
            onClick={() => setActiveTab('angioplasty')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'angioplasty'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clear the Artery
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cardiac IQ Quiz
          </button>
        </div>
      </div>

      {/* GAME 1: HEART BEAT MATCHER */}
      {activeTab === 'rhythm' && <RhythmBeatMatcher />}

      {/* GAME 2: ANGIOPLASTY ARTERY CLEAR */}
      {activeTab === 'angioplasty' && <AngioplastySprint />}

      {/* GAME 3: CARDIAC IQ QUIZ */}
      {activeTab === 'quiz' && <CardiacQuizGame />}
    </div>
  );
};

/* ==========================================
   GAME 1: RHYTHM BEAT MATCHER
========================================== */
const RhythmBeatMatcher: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetBpm, setTargetBpm] = useState(72);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; color: string } | null>(null);
  const [heartBeatScale, setHeartBeatScale] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const lastBeatTimeRef = useRef<number>(0);
  const beatIntervalMs = (60 / targetBpm) * 1000;

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        lastBeatTimeRef.current = Date.now();
        setHeartBeatScale(true);
        if (soundEnabled) {
          playHeartbeatSound(80, 0.08);
        }
        setTimeout(() => setHeartBeatScale(false), 140);
      }, beatIntervalMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, targetBpm, soundEnabled, beatIntervalMs]);

  const handleTap = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
      setStreak(0);
      lastBeatTimeRef.current = Date.now();
      return;
    }

    const now = Date.now();
    const elapsedSinceBeat = now - lastBeatTimeRef.current;
    const diff = Math.abs(elapsedSinceBeat - beatIntervalMs);
    const tolerance = 130; // ms

    if (diff < tolerance) {
      // Perfect or Great
      const isPerfect = diff < 65;
      const points = isPerfect ? 100 : 60;
      setScore(prev => prev + points * Math.min(streak + 1, 5));
      setStreak(prev => {
        const next = prev + 1;
        if (next === 10 || next === 25 || next === 50) {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        }
        return next;
      });
      setLastFeedback({
        text: isPerfect ? 'PERFECT SINUS SYNC!' : 'GOOD TIMING',
        color: isPerfect ? 'text-emerald-400' : 'text-cyan-400'
      });
    } else {
      // Off beat
      setStreak(0);
      setLastFeedback({
        text: diff > beatIntervalMs / 2 ? 'MISSED BEAT' : 'OFF TEMPO',
        color: 'text-rose-400'
      });
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-10 border border-purple-500/30 max-w-2xl mx-auto text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Score Board */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800 relative z-10">
        <div className="text-left">
          <span className="text-[11px] text-slate-400 font-mono block">CARDIAC SCORE</span>
          <span className="text-3xl font-extrabold text-white font-mono tabular-nums">{score}</span>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/50 border border-purple-500/30 px-3.5 py-1.5 rounded-full">
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-amber-300 font-mono">{streak} Streak</span>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 font-mono block">TARGET RHYTHM</span>
          <span className="text-lg font-bold text-cyan-300 font-mono">{targetBpm} BPM</span>
        </div>
      </div>

      {/* Heart Interactive Beating Target */}
      <div className="py-8 relative z-10">
        <button
          onClick={handleTap}
          className={`h-48 w-48 rounded-full bg-gradient-to-tr from-purple-900/60 via-rose-900/60 to-purple-800/60 border-2 border-purple-400/50 flex flex-col items-center justify-center mx-auto shadow-[0_0_50px_rgba(168,85,247,0.25)] transition-transform duration-100 cursor-pointer active:scale-95 ${
            heartBeatScale ? 'scale-110 border-rose-400 shadow-[0_0_70px_rgba(244,63,94,0.45)]' : 'scale-100'
          }`}
        >
          <Heart 
            className={`h-20 w-20 transition-all duration-100 ${
              heartBeatScale 
                ? 'text-rose-400 fill-rose-500 scale-110' 
                : 'text-purple-400 fill-purple-500/30'
            }`} 
          />
          <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">
            {isPlaying ? 'TAP ON BEAT!' : 'TAP TO START'}
          </span>
        </button>

        {/* Live Feedback */}
        <div className="h-8 mt-4 flex items-center justify-center">
          {lastFeedback ? (
            <span className={`text-sm font-extrabold tracking-wider ${lastFeedback.color} animate-bounce`}>
              {lastFeedback.text}
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              {isPlaying ? 'Sync with the rhythm pulse' : 'Press Spacebar or Click Heart'}
            </span>
          )}
        </div>
      </div>

      {/* Controls & Cadence Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-slate-800 relative z-10 text-xs">
        <span className="text-slate-400">Rhythm Cadence:</span>
        {[60, 72, 85, 100].map(bpm => (
          <button
            key={bpm}
            onClick={() => setTargetBpm(bpm)}
            className={`px-3 py-1 rounded-lg font-mono transition ${
              targetBpm === bpm
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {bpm} BPM
          </button>
        ))}

        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          className="ml-auto text-[11px] text-slate-400 hover:text-white underline"
        >
          {soundEnabled ? 'Mute Pacer Audio' : 'Enable Pacer Audio'}
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   GAME 2: ANGIOPLASTY STENT SPRINT
========================================== */
interface Plaque {
  id: number;
  x: number;
  y: number;
  size: number;
  density: number; // 1 to 3 clicks to clear
}

const AngioplastySprint: React.FC = () => {
  const [gameActive, setGameActive] = useState(false);
  const [plaques, setPlaques] = useState<Plaque[]>([]);
  const [perfusionPercent, setPerfusionPercent] = useState(65);
  const [stentsDeployed, setStentsDeployed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVictory, setIsVictory] = useState(false);

  // Start Game
  const startGame = () => {
    setGameActive(true);
    setPerfusionPercent(45);
    setStentsDeployed(0);
    setTimeLeft(30);
    setIsVictory(false);

    // Initial plaques in coronary artery lumen
    const initial: Plaque[] = [
      { id: 1, x: 20, y: 35, size: 48, density: 2 },
      { id: 2, x: 45, y: 55, size: 54, density: 3 },
      { id: 3, x: 70, y: 40, size: 42, density: 2 },
      { id: 4, x: 35, y: 25, size: 38, density: 1 },
      { id: 5, x: 60, y: 65, size: 50, density: 2 },
      { id: 6, x: 80, y: 50, size: 44, density: 2 }
    ];
    setPlaques(initial);
  };

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (gameActive && timeLeft > 0 && !isVictory) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, isVictory]);

  const handlePlaqueClick = (id: number) => {
    if (!gameActive) return;

    setPlaques(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          return { ...p, density: p.density - 1 };
        }
        return p;
      }).filter(p => p.density > 0);

      // Recalculate perfusion
      const newPerfusion = Math.min(100, 100 - updated.length * 10);
      setPerfusionPercent(newPerfusion);
      setStentsDeployed(s => s + 1);

      if (updated.length === 0) {
        setIsVictory(true);
        setGameActive(false);
        confetti({ particleCount: 70, spread: 80 });
      }

      return updated;
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-10 border border-purple-500/30 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            <span>Clear the Artery: Angioplasty Stent Sprint</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap atherosclerotic plaques to deploy micro-stents and restore 100% coronary blood flow.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">TIME REMAINING</span>
            <span className="text-lg font-bold text-white">{timeLeft}s</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">CORONARY FLOW</span>
            <span className={`text-lg font-bold ${perfusionPercent >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {perfusionPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Artery Lumen Interactive Canvas Viewport */}
      <div className="relative h-64 sm:h-72 rounded-2xl bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-4 border-rose-900/60 overflow-hidden shadow-inner flex items-center">
        {/* Animated blood cells stream */}
        <div className="absolute inset-0 opacity-25 pointer-events-none flex items-center">
          <div className="w-full h-16 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-ecg-scan"></div>
        </div>

        {/* Vessel Walls */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-rose-950/90 border-b border-rose-800/80"></div>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-rose-950/90 border-t border-rose-800/80"></div>

        {gameActive ? (
          plaques.map((plaque) => (
            <button
              key={plaque.id}
              onClick={() => handlePlaqueClick(plaque.id)}
              style={{
                left: `${plaque.x}%`,
                top: `${plaque.y}%`,
                width: `${plaque.size}px`,
                height: `${plaque.size}px`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 border-2 border-yellow-200/60 shadow-lg cursor-pointer hover:scale-110 active:scale-90 transition-all flex items-center justify-center font-bold text-slate-950 text-xs font-mono"
            >
              {plaque.density}x
            </button>
          ))
        ) : isVictory ? (
          <div className="w-full text-center relative z-10 space-y-2">
            <Trophy className="h-12 w-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-white">Full Perfusion Restored!</h3>
            <p className="text-xs text-emerald-300">
              LAD coronary artery completely patent. Normal myocardial oxygenation restored!
            </p>
          </div>
        ) : (
          <div className="w-full text-center relative z-10 space-y-3">
            <Activity className="h-12 w-12 text-rose-400 mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-white">Coronary Stenosis Detected (55% Blockage)</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Tap the lipid plaques repeatedly to deploy stents before time expires.
            </p>
          </div>
        )}
      </div>

      {/* Game Trigger Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">
          Stents Deployed: <strong className="text-white font-mono">{stentsDeployed}</strong>
        </span>

        <button
          onClick={startGame}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition active:scale-95"
        >
          {gameActive ? <RotateCcw className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          <span>{gameActive ? 'Reset Angioplasty' : 'Start Angioplasty Sprint'}</span>
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   GAME 3: CARDIAC IQ QUIZ
========================================== */
const CardiacQuizGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = CARDIAC_QUIZ[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore(s => s + 1);
      confetti({ particleCount: 25, spread: 50 });
    }
  };

  const handleNext = () => {
    if (currentIndex < CARDIAC_QUIZ.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-10 border border-purple-500/30 max-w-2xl mx-auto space-y-6">
      {!quizFinished ? (
        <>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="text-purple-400 font-semibold font-mono">
              Question {currentIndex + 1} of {CARDIAC_QUIZ.length}
            </span>
            <span className="text-slate-400 font-mono">
              Score: <strong className="text-white">{score}</strong>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;

              let btnStyle = 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-800';
              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 text-emerald-200 border-emerald-500/60 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/60 text-rose-200 border-rose-500/60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="h-5 w-5 rounded-md bg-slate-800/80 text-slate-400 flex items-center justify-center text-xs shrink-0 font-mono">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-normal">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                {selectedOption === question.correctIndex ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Correct Answer!
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Incorrect.
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {selectedOption !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
              >
                {currentIndex < CARDIAC_QUIZ.length - 1 ? 'Next Question' : 'View Quiz Summary'}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Finished State */
        <div className="text-center py-6 space-y-4">
          <Award className="h-14 w-14 text-purple-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-extrabold text-white">Quiz Completed</h3>
          <p className="text-sm text-slate-300">
            You scored <strong className="text-emerald-400">{score}</strong> out of {CARDIAC_QUIZ.length}!
          </p>
          <button
            onClick={restartQuiz}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
          >
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
};
