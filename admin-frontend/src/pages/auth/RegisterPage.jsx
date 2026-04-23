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
        setTimeout(() => {
          toast.success('Ready for takeoff! 🚀', {
            style: { borderRadius: '1rem', background: '#333', color: '#fff', fontWeight: 'bold' }
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
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Join the Squad</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Create your admin account.</p>
      </div>
      
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors group-focus-within:text-primary">Username</label>
          <input
            type="text"
            name="username"
            className={`input-genz text-lg ${formik.touched.username && formik.errors.username ? 'border-red-500' : ''}`}
            placeholder="johndoe"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-red-500 text-sm mt-2 ml-1 font-bold animate-slide-in-right">{formik.errors.username}</p>
          )}
        </div>
        
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors group-focus-within:text-primary">Email</label>
          <input
            type="email"
            name="email"
            className={`input-genz text-lg ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
            placeholder="admin@startup.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-2 ml-1 font-bold animate-slide-in-right">{formik.errors.email}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors group-focus-within:text-primary">Password</label>
            <input
              type="password"
              name="password"
              className={`input-genz text-lg tracking-widest ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-bold animate-slide-in-right">{formik.errors.password}</p>
            )}
          </div>
          
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors group-focus-within:text-primary">Confirm</label>
            <input
              type="password"
              name="confirmPassword"
              className={`input-genz text-lg tracking-widest ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="••••••••"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-bold animate-slide-in-right">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </div>
        
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white font-black text-lg py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-neon disabled:opacity-50 group"
          >
            <span className="relative z-10">{loading ? 'Creating...' : 'Create Account'}</span>
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine"></div>
          </button>
        </div>
      </form>
      
      <div className="mt-10 text-center">
        <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
          Already part of the crew?{' '}
          <Link to="/login" className="text-primary hover:text-pink-500 font-black transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-pink-500 hover:after:w-full after:transition-all after:duration-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
