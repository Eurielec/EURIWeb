'use client';

import { useState, useRef, useEffect } from 'react';
import { CreditCard, Check, AlertCircle, Loader2, Banknote } from 'lucide-react';
import { createIMWCheckoutAction, confirmIMWPaymentAction, declareCashPaymentIMWAction } from '@/app/actions/imw';
import { useLanguage } from '@/components/LanguageProvider';

export default function IMWPaymentSection({ 
  imwPrice, 
  imwPaymentStatus 
}: { 
  imwPrice: number | null; 
  imwPaymentStatus: string | null; 
}) {
  const { t } = useLanguage();
  const [paymentState, setPaymentState] = useState<'idle' | 'loading' | 'widget' | 'success' | 'error' | 'cash_loading'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);

  // Load SumUp SDK
  useEffect(() => {
    if (!document.getElementById('sumup-sdk-script')) {
      const script = document.createElement('script');
      script.id = 'sumup-sdk-script';
      script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (imwPrice === null) {
    return null; // Not activated for this user
  }

  const handlePay = async () => {
    setPaymentState('loading');
    setPaymentError('');

    try {
      const res = await createIMWCheckoutAction();
      if (!res.success || !res.checkoutId) {
        setPaymentState('error');
        setPaymentError(res.error || t.imwPayment.errorInit);
        return;
      }

      setPaymentState('widget');

      // Initialize SumUp Widget
      setTimeout(() => {
        if (window.SumUpCard && widgetRef.current) {
          window.SumUpCard.mount({
            id: 'sumup-imw-widget',
            checkoutId: res.checkoutId,
            onResponse: async (type: string, body: any) => {
              if (type === 'success') {
                const confirmRes = await confirmIMWPaymentAction();
                if (confirmRes.success) {
                  setPaymentState('success');
                } else {
                  setPaymentState('error');
                  setPaymentError(t.imwPayment.errorUpdate);
                }
              } else {
                setPaymentState('error');
                setPaymentError(t.imwPayment.errorCancel);
              }
            },
          });
        } else {
          setPaymentState('error');
          setPaymentError(t.imwPayment.errorLoad);
        }
      }, 500);

    } catch (err) {
      setPaymentState('error');
      setPaymentError(t.imwPayment.errorNet);
    }
  };

  const handleCashPayment = async () => {
    setPaymentState('cash_loading');
    setPaymentError('');
    try {
      const res = await declareCashPaymentIMWAction();
      if (!res.success) {
        setPaymentState('error');
        setPaymentError(res.error || t.imwPayment.errorNet);
      } else {
        setPaymentState('idle');
      }
    } catch (err) {
      setPaymentState('error');
      setPaymentError(t.imwPayment.errorNet);
    }
  };

  const isPaid = imwPaymentStatus === 'PAID' || imwPaymentStatus === 'PAID_CARD' || imwPaymentStatus === 'PAID_CASH' || paymentState === 'success';
  const isPendingCash = imwPaymentStatus === 'PENDING_CASH';

  return (
    <div className="flex flex-col items-center justify-center min-w-[200px] p-6 bg-black/40 rounded-2xl border border-white/5">
      <h2 className="text-[10px] font-black mb-2 text-gray-500 uppercase tracking-[0.2em]">{t.imwPayment.title}</h2>
      
      <div className={`text-4xl font-black mb-2 ${isPaid ? 'text-green-500' : 'text-white'}`}>
        {imwPrice.toFixed(2)}€
      </div>

      {isPaid ? (
        <div className="flex items-center gap-2 text-green-500 text-xs font-black uppercase tracking-widest bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
          <Check className="w-4 h-4" /> {t.imwPayment.paid}
        </div>
      ) : (
        <div className="w-full">
          {isPendingCash && paymentState === 'idle' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl mb-4 text-yellow-500 text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed">
              {t.imwPayment.pendingCash}
            </div>
          )}

          {paymentState === 'widget' && (
            <div className="bg-white rounded-2xl p-2 mb-4 animate-in zoom-in-95 duration-300 w-full min-h-[300px]">
              <div id="sumup-imw-widget" ref={widgetRef} />
            </div>
          )}

          {paymentState === 'error' && (
             <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-4 flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
               <AlertCircle size={16} /> {paymentError}
             </div>
          )}

          {paymentState !== 'widget' && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={handlePay}
                disabled={paymentState === 'loading' || paymentState === 'cash_loading'}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
              >
                {paymentState === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><CreditCard className="w-4 h-4" /> {t.imwPayment.payCard}</>
                )}
              </button>

              {!isPendingCash && (
                <button 
                  onClick={handleCashPayment}
                  disabled={paymentState === 'loading' || paymentState === 'cash_loading'}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-gray-300 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  {paymentState === 'cash_loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <><Banknote className="w-4 h-4" /> {t.imwPayment.payCash}</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
