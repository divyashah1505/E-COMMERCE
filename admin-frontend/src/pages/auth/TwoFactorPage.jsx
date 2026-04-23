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
      toast.error('OTP must be at least 6 characters');
      return;
    }

    setLoading(true);
    // Mock OTP Verification
    setTimeout(() => {
      dispatch(set2FaVerified(true));
      toast.success('2FA Verified Successfully!');
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Two-Factor Auth</h2>
      <p className="text-sm text-center text-gray-500 mb-4 dark:text-gray-400">
        Enter the code from your authenticator app.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            className="w-full p-2 border rounded text-center text-2xl tracking-widest dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="000000"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default TwoFactorPage;
