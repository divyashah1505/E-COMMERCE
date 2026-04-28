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
        const response = await authService.loginAdmin({
          email: values.email,
          password: values.password,
        });

        const resultData = response.data || response;
        const payload = resultData.data || resultData;

        // -------------------------
        // 2FA FLOW
        // -------------------------
        if (payload.requires2FA) {
          sessionStorage.setItem('temp_2fa_token', payload.twoFaToken);

          toast('2FA verification required', { icon: '🔐' });

          navigate('/verify-2fa', {
            state: { email: payload.email },
          });

          return;
        }

        // Extract token safely
        const token = payload.accessToken || payload.token || payload?.data?.accessToken || payload?.data?.token;
        console.log('Login successful, token:', token);
        if (!token) {
          toast.error('Token not received from server');
          return;
        }
        // Build admin data object
        const adminData = {
          username: payload.username,
          email: payload.email,
        };

        // Store token and update Redux
        setToken(token);
        dispatch(setCredentials({ admin: adminData, token }));

        toast.success('Access Granted. Welcome.', {
          style: {
            borderRadius: '12px',
            background: '#0F172A',
            color: '#fff',
            fontWeight: 'bold',
          },
        });

        // -------------------------
        // NAVIGATION (SAFE FIX)
        // -------------------------
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 50);

      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);

        toast.error(
          error.response?.data?.message || 'Authentication failed'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Sign in to continue managing Clothiq.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6 w-full">

        {/* EMAIL */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-[0.12em] mb-2 ml-1">
            Work Email
          </label>

          <input
            type="email"
            name="email"
            className={`premium-input ${
              formik.touched.email && formik.errors.email
                ? 'border-rose-500'
                : ''
            }`}
            placeholder="admin@clothiq.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.email && formik.errors.email && (
            <p className="text-rose-500 text-xs mt-2 ml-1 font-bold">
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-[0.12em] mb-2 ml-1">
            Password
          </label>

          <input
            type="password"
            name="password"
            className={`premium-input ${
              formik.touched.password && formik.errors.password
                ? 'border-rose-500'
                : ''
            }`}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.password && formik.errors.password && (
            <p className="text-rose-500 text-xs mt-2 ml-1 font-bold">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>

      {/* FOOTER */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Don't have access?{' '}
          <Link
            to="/register"
            className="text-slate-900 dark:text-white hover:text-blue-600"
          >
            Request an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;