import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { updatePaymentMethod } from '../../services/settingService';

const Setting = () => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(0); // 0 = Stripe Default
  const [status, setStatus] = useState({ type: '', message: '' });

  const paymentOptions = [
    { id: 1, name: 'Stripe Only', desc: 'Accept payments via Stripe international gateway.' },
    { id: 2, name: 'Razorpay Only', desc: 'Accept payments via Razorpay (India optimized).' },
  ];

  const handleUpdate = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      await updatePaymentMethod(selectedMethod);
      setStatus({ type: 'success', message: 'Payment method updated successfully!' });
      
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      // Show the message from backend error
      setStatus({ type: 'error', message: error.message || 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-page">
      <div className="premium-shell max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">General Settings</h1>
        <p className="text-slate-500 mt-1">Configure your backend payment gateway integration.</p>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <CreditCard className="text-blue-600" size={24} />
            <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Payment Gateway</h2>
          </div>
        </div>

        <div className="p-8 space-y-4">
          {paymentOptions.map((option) => (
            <div 
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === option.id 
                ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-600/10'
                : 'border-slate-200 dark:border-white/10 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedMethod === option.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                  }`}>
                    <span className="font-bold">{option.id === 1 ? 'S' : 'R'}</span>
                  </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{option.name}</p>
                  <p className="text-sm text-slate-500">{option.desc}</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === option.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
              }`}>
                {selectedMethod === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
          ))}

          {status.message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="premium-btn premium-btn-primary px-7 py-3.5 uppercase text-xs tracking-[0.16em]"
            >
              {loading ? 'Saving...' : 'Update Payment Method'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Setting;