'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X, 
  Sparkles 
} from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface CyberToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
}

const CyberToastContext = createContext<CyberToastContextType | undefined>(undefined);

export function CyberToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = item.duration || 4000;
    const newToast: ToastItem = { ...item, id, duration };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // max 4 toasts at once

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  return (
    <CyberToastContext.Provider value={{ toast: addToast, success, info, warning, error }}>
      {children}

      {/* FIXED FLOATING HUD TOAST CONTAINER */}
      <div 
        aria-live="polite"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-[calc(100vw-2rem)]"
      >
        {toasts.map((t) => {
          let borderColor = 'border-cyber-cyan/50';
          let glowColor = 'rgba(0, 240, 255, 0.25)';
          let iconColor = 'text-cyber-cyan';
          let bgIcon = 'bg-cyber-cyan/15 border-cyber-cyan/30';
          let IconComponent = Info;

          if (t.type === 'success') {
            borderColor = 'border-cyber-emerald/50';
            glowColor = 'rgba(16, 185, 129, 0.25)';
            iconColor = 'text-cyber-emerald';
            bgIcon = 'bg-cyber-emerald/15 border-cyber-emerald/30';
            IconComponent = CheckCircle2;
          } else if (t.type === 'warning') {
            borderColor = 'border-cyber-amber/50';
            glowColor = 'rgba(245, 158, 11, 0.25)';
            iconColor = 'text-cyber-amber';
            bgIcon = 'bg-cyber-amber/15 border-cyber-amber/30';
            IconComponent = AlertTriangle;
          } else if (t.type === 'error') {
            borderColor = 'border-red-500/50';
            glowColor = 'rgba(239, 68, 68, 0.25)';
            iconColor = 'text-red-400';
            bgIcon = 'bg-red-500/15 border-red-500/30';
            IconComponent = AlertCircle;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-2xl p-4 backdrop-blur-2xl bg-slate-950/90 border shadow-2xl transition-all duration-300 animate-tab-slide flex items-start gap-3.5 relative overflow-hidden group ${borderColor}`}
              style={{
                boxShadow: `0 10px 35px -5px rgba(0, 0, 0, 0.7), 0 0 20px -2px ${glowColor}`
              }}
            >
              {/* Left Accent Glow Line */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 bg-current"
                style={{ color: t.type === 'success' ? '#10B981' : t.type === 'warning' ? '#F59E0B' : t.type === 'error' ? '#EF4444' : '#00F0FF' }}
              />

              {/* Icon */}
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${bgIcon}`}>
                <IconComponent className={`w-4 h-4 ${iconColor}`} />
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-0.5 pr-2">
                <h4 className="text-xs font-black text-white tracking-wide">
                  {t.title}
                </h4>
                {t.message && (
                  <p className="text-[11px] font-medium text-white/70 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => removeToast(t.id)}
                className="text-white/40 hover:text-white transition p-1 rounded-lg hover:bg-white/[0.06] shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </CyberToastContext.Provider>
  );
}

export function useCyberToast() {
  const context = useContext(CyberToastContext);
  if (!context) {
    throw new Error('useCyberToast must be used within a CyberToastProvider');
  }
  return context;
}
