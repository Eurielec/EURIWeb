'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmailAction, resendVerificationAction } from '@/app/actions/auth';
import { Mail, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function VerificarEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [state, formAction, pending] = useActionState(verifyEmailAction, null);
  const { t } = useLanguage();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [resendMsg, setResendMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResendMsg('');
    const result = await resendVerificationAction(email);
    if (result.success) {
      setResendMsg(t.auth.verify.resendSuccess);
      setCooldown(60);
    } else {
      setResendMsg(result.error || t.auth.verify.resendError);
    }
  };

  const code = digits.join('');

  return (
    <main className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl m-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/20">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">
            {t.auth.verify.titlePart1} <span className="text-red-600">{t.auth.verify.titlePart2}</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            {t.auth.verify.subtitle}
          </p>
          <p className="text-red-600 font-bold text-xs sm:text-sm mt-1 break-all px-2">{email}</p>
        </div>

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="code" value={code} />

          {/* OTP Input */}
          <div className="flex justify-center gap-1.5 sm:gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black bg-black/60 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
              />
            ))}
          </div>

          {state?.error && (
            <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-center">
              {state.error}
            </p>
          )}

          {resendMsg && (
            <p className={`text-sm p-3 rounded-xl text-center ${resendMsg.includes('reenviado') ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
              {resendMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || code.length < 6}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {pending ? t.auth.verify.submitPending : t.auth.verify.submit}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${cooldown > 0 ? '' : 'hover:rotate-180 transition-transform duration-500'}`} />
            {cooldown > 0 ? `${t.auth.verify.resendWait} ${cooldown}s` : t.auth.verify.resend}
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          {t.auth.verify.footer}
        </p>
      </div>
    </main>
  );
}
