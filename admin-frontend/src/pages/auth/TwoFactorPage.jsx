import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set2FaVerified } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const TwoFactorPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Code must be 6 digits');
      return;
    }

    setLoading(true);
    // Mock OTP Verification
    setTimeout(() => {
      dispatch(set2FaVerified(true));
      toast.success('Identity verified.', {
        style: { borderRadius: '8px', background: '#0F172A', color: '#fff' }
      });
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Security Verification</h2>
        <p className="text-slate-500 dark:text-slate-400">Enter the 6-digit code from your app.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.12em] mb-4 text-center">Verification Code</label>
          <input
            type="text"
            className="premium-input text-center text-4xl tracking-[0.5em] font-bold h-20"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="000000"
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]"
          >
            {loading ? 'Verifying Identity...' : 'Confirm Identity'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/login')}
          className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          Cancel and return to login
        </button>
      </div>
    </div>
  );
};

export default TwoFactorPage;
