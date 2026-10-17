import React, { useState } from 'react';
import { Bot, Send, Sparkles, Heart, Activity, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const CardioAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'user',
      text: 'What are normal heart rate ranges?',
      time: '10:02 AM'
    },
    {
      id: 'm-2',
      sender: 'ai',
      text: 'A normal resting heart rate for adults is usually between 60 and 100 beats per minute (bpm). Athletes or people who exercise regularly may have a lower resting heart rate (40 to 60 bpm). If your resting heart rate is consistently above 100 bpm (tachycardia) or below 60 bpm (bradycardia) and you feel dizzy or short of breath, please consult your cardiologist.',
      time: '10:02 AM'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'How to lower blood pressure?',
    'What causes chest pain?',
    'Tips for a healthy heart',
    'When to see a cardiologist?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = 'Thank you for asking. For optimal cardiovascular health, aim for 150 minutes of moderate aerobic exercise weekly, reduce sodium intake below 2,300 mg daily, and ensure regular blood pressure monitoring.';

      const lower = text.toLowerCase();
      if (lower.includes('lower blood pressure') || lower.includes('blood pressure')) {
        aiReply = 'To lower blood pressure naturally: 1) Follow the DASH diet rich in potassium, 2) Reduce daily sodium intake, 3) Engage in 30 minutes of brisk walking, 4) Limit alcohol and caffeine, and 5) Take prescribed antihypertensives like Atenolol at the same time every day.';
      } else if (lower.includes('chest pain')) {
        aiReply = 'CRITICAL: Chest tightness radiating to your left arm, jaw, or shoulder—especially with shortness of breath or sweating—requires immediate medical attention. Please click the red "Emergency SOS" button or call 112 / 911 immediately.';
      } else if (lower.includes('tips') || lower.includes('healthy heart')) {
        aiReply = 'Key heart health habits: Prioritize 7-8 hours of sleep, manage stress through deep breathing, incorporate omega-3 fatty acids, maintain hydration, and take medications consistently using the CardioLens Medication Tracker.';
      } else if (lower.includes('when to see') || lower.includes('cardiologist')) {
        aiReply = 'See a cardiologist if you experience unexplained shortness of breath, palpitations (fluttering or skipped beats), swollen ankles, persistent high blood pressure over 140/90, or a family history of premature heart disease.';
      }

      const aiMsg: ChatMessage = {
        id: 'm-' + (Date.now() + 1),
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex-1 py-6 px-4 sm:px-8 max-w-4xl mx-auto w-full flex flex-col space-y-4">
      {/* Header matching Screen 6 */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Cardio AI</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.2 rounded-full font-mono">
                Active 24/7
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Your personal heart health intelligence assistant
            </p>
          </div>
        </div>

        <Link to="/patient" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 flex-1 min-h-[460px] flex flex-col justify-between space-y-4">
        {/* Messages feed */}
        <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] opacity-75">
                  <span className="font-bold">{m.sender === 'user' ? 'You' : 'Cardio AI'}</span>
                  <span>·</span>
                  <span>{m.time}</span>
                </div>
                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Cardio AI is analyzing medical guidelines...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts suggestions matching Screen 6 */}
        <div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 mb-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/50 px-3 py-1.5 rounded-xl transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Cardio AI anything..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition shadow-md shadow-cyan-500/20 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
