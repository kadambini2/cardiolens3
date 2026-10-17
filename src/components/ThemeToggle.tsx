import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? 'Clinical Light' : 'Dark'} Mode`}
      aria-label={`Toggle theme (currently ${isDark ? 'Dark' : 'Clinical Light'})`}
      className={`relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white shadow-md shadow-black/20'
          : 'bg-white/90 hover:bg-white border-slate-300 text-slate-700 hover:text-slate-950 shadow-md shadow-slate-200/50'
      } ${className}`}
    >
      {/* Icon cluster */}
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Moon className="h-4 w-4 text-cyan-400 transform transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transform transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-tight whitespace-nowrap hidden sm:inline">
          {isDark ? 'Clinical Light' : 'Dark Mode'}
        </span>
      )}

      {/* Mode Status Indicator dot */}
      <span className={`w-1.5 h-1.5 rounded-full ${
        isDark ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-amber-500 shadow-sm shadow-amber-500'
      }`} />
    </button>
  );
};
