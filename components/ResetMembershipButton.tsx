'use client';

import { useState } from 'react';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { resetAllMembershipPaymentsAction } from '@/app/actions/membership';

export default function ResetMembershipButton() {
  const { t } = useLanguage();
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setIsPending(true);
    try {
      const result = await resetAllMembershipPaymentsAction();
      if (result.success) {
        alert(t.admin.dashboard.resetMembershipSuccess);
        setShowConfirm(false);
      } else {
        alert(t.admin.dashboard.resetMembershipError + ' Detalles: ' + (result.error || 'Unknown error'));
      }
    } catch (error: any) {
      alert(t.admin.dashboard.resetMembershipError + ' Detalles: ' + error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-lg"
      >
        <RefreshCcw className="w-4 h-4 text-orange-500" />
        <span>{t.admin.dashboard.resetMembership}</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">
              {t.admin.dashboard.resetMembership}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {t.admin.dashboard.resetMembershipConfirm}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                onClick={handleReset}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
