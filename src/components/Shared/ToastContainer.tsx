import React from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useDelivery();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-3.5 shadow-2xl border flex items-start gap-3 backdrop-blur-md transition-all duration-200 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/50 text-slate-100'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/50 text-slate-100'
                : 'bg-slate-900/95 border-amber-500/50 text-slate-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white leading-tight">{toast.text}</h5>
              {toast.subtext && (
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.subtext}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition shrink-0"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
