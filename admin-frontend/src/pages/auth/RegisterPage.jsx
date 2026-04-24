import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const registerSchema = Yup.object({
  username: Yup.string().min(4, 'Min 4').max(20).required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Min 8').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { username: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Mocking API call for now as per original code
        setTimeout(() => {
          toast.success('Registration request sent.', {
            style: { borderRadius: '8px', background: '#0F172A', color: '#fff' }
          });
          navigate('/login');
          setLoading(false);
        }, 1500);
      } catch (error) {
        toast.error('Registration failed');
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h2>
        <p className="text-slate-500 dark:text-slate-400">Join the administrative team.</p>
      </div>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.12em] mb-2 ml-1">Username</label>
          <input
            type="text"
            name="username"
            className={`premium-input ${formik.touched.username && formik.errors.username ? 'border-rose-500' : ''}`}
            placeholder="johndoe"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-rose-500 text-xs mt-1 ml-1 font-bold">{formik.errors.username}</p>
          )}
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.12em] mb-2 ml-1">Email</label>
          <input
            type="email"
            name="email"
            className={`premium-input ${formik.touched.email && formik.errors.email ? 'border-rose-500' : ''}`}
            placeholder="admin@clothiq.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-rose-500 text-xs mt-1 ml-1 font-bold">{formik.errors.email}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.12em] mb-2 ml-1">Password</label>
            <input
              type="password"
              name="password"
              className={`premium-input ${formik.touched.password && formik.errors.password ? 'border-rose-500' : ''}`}
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-rose-500 text-xs mt-1 ml-1 font-bold">{formik.errors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.12em] mb-2 ml-1">Confirm</label>
            <input
              type="password"
              name="confirmPassword"
              className={`premium-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-rose-500' : ''}`}
              placeholder="••••••••"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-rose-500 text-xs mt-1 ml-1 font-bold">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </div>
        
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="premium-btn premium-btn-primary w-full py-3.5 text-sm uppercase tracking-[0.16em]"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
