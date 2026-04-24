import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { setToken } from '../../utils/tokenHelper';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(8, 'Min 8 chars').required('Password required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authService.loginAdmin({ email: values.email, password: values.password });
        const resultData = response.data || response;
        const payload = resultData.data || resultData;

        if (payload.requires2FA) {
          sessionStorage.setItem('temp_2fa_token', payload.twoFaToken);
          toast('2FA verification required', { icon: '🔐' });
          navigate('/verify-2fa', { state: { email: payload.email } });
        } else {
          const token = payload.accessToken || payload.token;
          const adminData = {
            username: payload.username,
            email: payload.email,
          };
          
          if (token) setToken(token);
          if (payload.refreshToken) localStorage.setItem('admin_refresh_token', payload.refreshToken);
          
          dispatch(setCredentials({ admin: adminData, token }));
          
          toast.success('Access Granted. Welcome.', {
            style: { borderRadius: '12px', background: '#0F172A', color: '#fff', fontWeight: 'bold' }
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Login error details:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || 'Authentication failed';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome Back</h2>
        <p className="text-slate-500 dark:text-slate-400">Sign in to continue managing Clothiq.</p>
      </div>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6 w-full">
        <div className="group">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-[0.12em] mb-2 ml-1 transition-colors group-focus-within:text-blue-600">Work Email</label>
          <input
            type="email"
            name="email"
            className={`premium-input ${formik.touched.email && formik.errors.email ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : ''}`}
            placeholder="admin@clothiq.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-rose-500 text-xs mt-2 ml-1 font-bold">{formik.errors.email}</p>
          )}
        </div>
        
        <div className="group">
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-[0.12em] transition-colors group-focus-within:text-blue-600">Password</label>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">Forgot?</a>
          </div>
          <input
            type="password"
            name="password"
            className={`premium-input tracking-[0.2em] ${formik.touched.password && formik.errors.password ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : ''}`}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-rose-500 text-xs mt-2 ml-1 font-bold">{formik.errors.password}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating...
                </>
              ) : 'Sign In'}
            </span>
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Don't have access?{' '}
          <Link to="/register" className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
            Request an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
