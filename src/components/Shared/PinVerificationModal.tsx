import React, { useState, useEffect } from 'react';
import { DeliveryOrder } from '../../types';
import { useDelivery } from '../../context/DeliveryContext';
import { sounds } from '../../utils/audio';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle, X, Delete } from 'lucide-react';

interface PinVerificationModalProps {
  order: DeliveryOrder;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PinVerificationModal: React.FC<PinVerificationModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { validatePinAndDeliver, t, language } = useDelivery();
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setPinDigits(['', '', '', '']);
      setErrorMessage(null);
      setIsSuccess(false);
      setAttempts(order.pinValidationAttempts || 0);
    }
  }, [isOpen, order]);

  if (!isOpen) return null;

  const currentPinString = pinDigits.join('');

  const handleDigitPress = (digit: string) => {
    sounds.playKeypadTap();
    setErrorMessage(null);
    const firstEmptyIndex = pinDigits.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      const updated = [...pinDigits];
      updated[firstEmptyIndex] = digit;
      setPinDigits(updated);

      // Auto submit when 4 digits are completed
      if (firstEmptyIndex === 3) {
        const fullCode = updated.join('');
        submitPin(fullCode);
      }
    }
  };

  const handleDelete = () => {
    sounds.playKeypadTap();
    setErrorMessage(null);
    const filledIndices = pinDigits
      .map((d, i) => (d !== '' ? i : -1))
      .filter((i) => i !== -1);
    if (filledIndices.length > 0) {
      const lastFilled = filledIndices[filledIndices.length - 1];
      const updated = [...pinDigits];
      updated[lastFilled] = '';
      setPinDigits(updated);
    }
  };

  const submitPin = (code: string) => {
    if (code.length < 4) {
      setErrorMessage(
        language === 'sw'
          ? 'Weka tarakimu 4 za kodi ya siri.'
          : 'Saisissez les 4 chiffres du code de sécurité.'
      );
      return;
    }

    const result = validatePinAndDeliver(order.id, code);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1600);
    } else {
      setIsShaking(true);
      setErrorMessage(result.message);
      setAttempts((prev) => prev + 1);
      setTimeout(() => {
        setIsShaking(false);
        setPinDigits(['', '', '', '']);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-transform ${
          isShaking ? 'translate-x-[-8px] animate-shake' : ''
        }`}
      >
        {/* Subtle decorative top bar */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header with Close */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>{t.pinModalTitle}</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 uppercase tracking-wider font-semibold">
                  {t.pinModalBlocking}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Course {order.id} · Remise à <strong className="text-slate-200">{order.recipientName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Notice Banner from Specifications */}
        <div className="mb-5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200/90 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">{t.pinModalNoticeTitle}</p>
            <p className="text-amber-200/80 leading-relaxed">
              {t.pinModalNoticeText}
            </p>
          </div>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-white">{t.pinModalSuccessTitle}</h4>
            <p className="text-sm text-slate-300">
              {t.pinModalSuccessText} <span className="font-mono text-emerald-400 font-bold tracking-wider">{order.pinCode}</span>
            </p>
            <p className="text-xs text-slate-400">
              {t.pinModalEarningsCredited} ({order.priceCDF.toLocaleString()} CDF).
            </p>
          </div>
        ) : (
          <>
            {/* 4 Digit Slots */}
            <div className="flex justify-center gap-3.5 my-4">
              {[0, 1, 2, 3].map((idx) => {
                const val = pinDigits[idx];
                const isActive = pinDigits.findIndex((d) => d === '') === idx;
                return (
                  <div
                    key={idx}
                    className={`w-14 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-mono transition-all duration-150 border ${
                      val
                        ? 'bg-slate-800 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : isActive
                        ? 'bg-slate-800/80 border-slate-500 ring-2 ring-amber-500/30 text-slate-400'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {val ? (
                      <span className="scale-105 transform animate-fade-in">{val}</span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-center text-xs font-medium text-rose-400 bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20 mb-3 animate-fade-in">
                {errorMessage}
              </div>
            )}

            {/* Hint Helper for testing demo */}
            <div className="text-center text-[11px] text-slate-400 mb-3">
              <span>{t.pinModalDemoHint} : </span>
              <strong className="text-amber-400 font-mono tracking-wider text-xs underline cursor-pointer" onClick={() => submitPin(order.pinCode)}>
                {order.pinCode} ({language === 'sw' ? 'Jaza mara moja' : 'Remplir automatiquement'})
              </strong>
            </div>

            {/* Touch-Friendly Keypad (0-9) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigitPress(num)}
                  className="h-14 sm:h-13 rounded-2xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700/80 text-xl font-semibold text-slate-100 flex items-center justify-center transition active:scale-95 shadow-sm"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  sounds.playKeypadTap();
                  setPinDigits(['', '', '', '']);
                }}
                className="h-14 sm:h-13 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 flex items-center justify-center transition active:scale-95"
              >
                {t.pinModalClear}
              </button>

              <button
                type="button"
                onClick={() => handleDigitPress('0')}
                className="h-14 sm:h-13 rounded-2xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700/80 text-xl font-semibold text-slate-100 flex items-center justify-center transition active:scale-95 shadow-sm"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="h-14 sm:h-13 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition active:scale-95"
                aria-label="Effacer dernier chiffre"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Final Action Button */}
            <button
              type="button"
              disabled={currentPinString.length < 4}
              onClick={() => submitPin(currentPinString)}
              className={`w-full mt-4 h-13 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                currentPinString.length === 4
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.pinModalSubmitBtn}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
