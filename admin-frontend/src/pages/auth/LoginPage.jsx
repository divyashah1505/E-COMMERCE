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
        
        // Extract the actual payload, handling cases where backend wraps it in a 'data' property
        const payload = resultData.data || resultData;

        if (payload.requires2FA) {
          // Store 2FA token temporarily and navigate to verification page
          sessionStorage.setItem('temp_2fa_token', payload.twoFaToken);
          toast('2FA verification required', { icon: '🔐', style: { borderRadius: '1rem', background: '#333', color: '#fff' } });
          navigate('/verify-2fa', { state: { email: payload.email } });
        } else {
          // Standard login successful
          const token = payload.accessToken || payload.token;
          const adminData = {
            username: payload.username,
            email: payload.email,
          };
          
          if (token) setToken(token);
          if (payload.refreshToken) localStorage.setItem('admin_refresh_token', payload.refreshToken);
          
          dispatch(setCredentials({ admin: adminData, token }));
          
          toast.success('Welcome back to Admin Panel', {
            style: { borderRadius: '1rem', background: '#333', color: '#fff', fontWeight: 'bold' }
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
    <div className="w-full">
      <div className="mb-10 text-center sm:text-left">
        <div className="w-14 h-14 bg-gradient-to-tr from-primary via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-neon mb-8 mx-auto sm:mx-0 animate-float">
          EA
        </div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Sign In</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Enter your admin universe.</p>
      </div>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors group-focus-within:text-primary">Email</label>
          <input
            type="email"
            name="email"
            className={`input-genz text-lg ${formik.touched.email && formik.errors.email ? 'border-red-500 focus:ring-red-500/20' : ''}`}
            placeholder="admin@startup.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-2 ml-1 font-bold animate-slide-in-right">{formik.errors.email}</p>
          )}
        </div>
        
        <div className="group">
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors group-focus-within:text-primary">Password</label>
            {/* <a href="#" className="text-sm text-primary hover:text-pink-500 font-bold transition-colors mr-1">Forgot?</a> */}
          </div>
          <input
            type="password"
            name="password"
            className={`input-genz text-lg tracking-widest ${formik.touched.password && formik.errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-2 ml-1 font-bold animate-slide-in-right">{formik.errors.password}</p>
          )}
        </div>
        
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white font-black text-lg py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-neon disabled:opacity-50 group"
          >
            <span className="relative z-10">{loading ? 'Authenticating...' : 'Enter Dashboard'}</span>
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine"></div>
          </button>
        </div>
      </form>
      
      <div className="mt-10 text-center">
        <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
          New to the team?{' '}
          <Link to="/register" className="text-primary hover:text-pink-500 font-black transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-pink-500 hover:after:w-full after:transition-all after:duration-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
