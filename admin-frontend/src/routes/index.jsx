import { useRoutes, Navigate } from 'react-router-dom';
import { PATHS } from './routePaths';

// Guards & Layouts
import AdminAuthGuard from '../components/guards/AdminAuthGuard';
import AuthLayout from '../components/layout/AuthLayout';
import AppLayout from '../components/layout/AppLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import TwoFactorPage from '../pages/auth/TwoFactorPage';
import Setting from '../pages/auth/setting'; // 1. IMPORT THE SETTING COMPONENT

// Admin Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import CustomerList from '../pages/auth/customerList';
import CategoryList from '../pages/auth/categoryList';
import SubcategoryList from '../pages/auth/subcategoryList';
import ProductList from '../pages/auth/productList'; 
import PromoCodeList from '../pages/auth/promoCodeList'; 
import SubscriptionList from '../pages/auth/suuScriptionList'; 

export default function Routes() {
  return useRoutes([
    // 1. Root Redirect
    {
      path: PATHS.HOME,
      element: <Navigate to={PATHS.DASHBOARD} replace />,
    },

    // 2. Public Auth Routes (Login, Register, 2FA)
    {
      element: <AuthLayout />,
      children: [
        { path: PATHS.LOGIN, element: <LoginPage /> },
        { path: PATHS.REGISTER, element: <RegisterPage /> },
        { path: PATHS.VERIFY_2FA, element: <TwoFactorPage /> },
      ],
    },

    // 3. Protected Admin Routes (Requires Auth)
    {
      element: (
        <AdminAuthGuard>
          <AppLayout />
        </AdminAuthGuard>
      ),
      children: [
        // Dashboard & User Management
        {
          path: PATHS.DASHBOARD,
          element: <DashboardPage />,
        },
        {
          path: PATHS.USERS,
          element: <CustomerList />,
        },

        // --- Category Management Architecture ---
        {
          path: 'categories', 
          children: [
            {
              path: '', 
              element: <CategoryList />,
            },
            {
              path: ':categoryId/subcategories', 
              element: <SubcategoryList />,
            },
            {
              path: ':categoryId/subcategories/:subcategoryId/products',
              element: <ProductList />,
            },
          ],
        },

        // --- Global Product Management ---
        {
          path: 'products',
          children: [
             { path: '', element: <ProductList /> },
          ]
        },

        // --- Additional Modules ---
        { path: PATHS.ORDERS, element: <div className="p-8">Orders Registry</div> },
        
        // 2. REGISTER THE SETTINGS ROUTE HERE
        { 
          path: PATHS.SETTINGS, 
          element: <Setting /> 
        },

        // (Optional) You can keep or remove the old payments path
        { path: PATHS.PAYMENTS, element: <div className="p-8">Payment Protocol</div> },
        
        { 
          path: PATHS.PROMO, 
          element: <PromoCodeList /> 
        }, 
        { 
          path: PATHS.SUBSCRIPTIONS,
          element: <SubscriptionList /> 
        },
        
        { path: PATHS.MEMBERSHIP, element: <div className="p-8">Membership System</div> },
      ],
    },

    // 4. Fallback 404
    {
      path: '*',
      element: (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
           <h1 className="text-9xl font-black text-slate-200">404</h1>
           <p className="text-xl font-bold text-slate-500 uppercase tracking-widest mt-4">Registry Node Not Found</p>
           <button 
             onClick={() => window.location.href = PATHS.DASHBOARD}
             className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"
           >
             Return to Dashboard
           </button>
        </div>
      ),
    },
  ]);
}