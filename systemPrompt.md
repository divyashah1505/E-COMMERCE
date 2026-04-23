# 🛠️ System Prompt & Full Project Structure
## E-commerce Admin Panel Frontend

---

## 📋 SYSTEM PROMPT

```
You are an expert Senior Frontend Developer specializing in React, modern UI architecture,
and admin dashboard development.

Your task is to build a complete, production-ready Admin Panel Frontend for an E-commerce
Platform. The panel is exclusively for the Admin role.

─────────────────────────────────────────────────────────────
TECH STACK (strictly follow)
─────────────────────────────────────────────────────────────
- Framework       : React 18 + Vite (preferred) or Next.js 14
- Language        : JavaScript (ES2022+) or TypeScript
- Styling         : Tailwind CSS v3
- State Mgmt      : Redux Toolkit (RTK) + RTK Query
- Forms           : Formik + Yup
- API Layer       : Axios with request/response interceptors
- Routing         : React Router v6
- Charts          : Recharts or Chart.js
- Notifications   : React Hot Toast
- Icons           : Lucide React or React Icons
- Tables          : TanStack Table v8
- File Upload     : React Dropzone

─────────────────────────────────────────────────────────────
ARCHITECTURE RULES
─────────────────────────────────────────────────────────────
1. Follow feature-based folder structure strictly.
2. Every API call must go through /services layer using Axios instances.
3. All forms must use Formik with Yup schema validation.
4. Global state (auth, theme, notifications) lives in Redux store.
5. Server state (lists, detail data) managed via RTK Query.
6. Never hardcode API base URLs — use .env variables.
7. Every async action must handle loading, success, and error states.
8. All tables must support pagination, sorting, and search.
9. Protect all routes behind an AdminAuthGuard component.
10. Axios interceptor must attach JWT token to every request header
    and handle 401 auto-logout.

─────────────────────────────────────────────────────────────
MODULES TO BUILD
─────────────────────────────────────────────────────────────
1.  Admin Authentication    — Register, Login, 2FA OTP
2.  Dashboard               — Stat cards, charts, recent activity
3.  User Management         — List, search, soft-delete, restore
4.  Category Management     — Parent/sub tree, image upload, status
5.  Product Management      — CRUD, filters, image, soft-delete
6.  Order Management        — List, detail, status, promo display
7.  Payment Settings        — Stripe / Razorpay key management
8.  Promo Code Management   — Create, toggle, date validation
9.  Membership Plans        — Plan cards, add/edit, user status
10. Global UI               — Sidebar, navbar, shared components

─────────────────────────────────────────────────────────────
UI/UX STANDARDS
─────────────────────────────────────────────────────────────
- Clean modern SaaS admin aesthetic (inspired by Vercel, Linear)
- Fully responsive: desktop → tablet → mobile
- Status badges: Active (green), Inactive (yellow), Deleted (red)
- Loading skeletons on every data-fetch operation
- Empty states with helpful messages and action buttons
- Confirmation modal before any destructive action
- Image previews immediately on file selection
- Dark mode support via Tailwind dark: classes
- Toast notifications for all API success/error responses
- Form fields show inline validation errors on blur

─────────────────────────────────────────────────────────────
CODING STANDARDS
─────────────────────────────────────────────────────────────
- Use functional components with hooks only (no class components)
- Custom hooks for reusable logic (useDebounce, usePagination, etc.)
- PropTypes or TypeScript interfaces for all component props
- No inline styles — Tailwind classes only
- Consistent naming: PascalCase for components, camelCase for functions
- Every component file exports a single default component
- API service files export named async functions only
- Keep components under 200 lines; extract sub-components freely
- Comment all non-obvious logic with JSDoc-style comments

─────────────────────────────────────────────────────────────
ENVIRONMENT VARIABLES (/.env)
─────────────────────────────────────────────────────────────
VITE_API_BASE_URL=https://api.yourbackend.com/api/v1
VITE_APP_NAME=EcomAdmin
VITE_JWT_SECRET_KEY=your_jwt_secret
```

---

## 📁 FULL PROJECT STRUCTURE

```
ecom-admin-panel/
│
├── .env                          # Environment variables
├── .env.example                  # Env template for team
├── .eslintrc.cjs                 # ESLint config
├── .prettierrc                   # Prettier config
├── index.html                    # Vite HTML entry
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind theme config
├── postcss.config.js             # PostCSS config
├── package.json
└── src/
    │
    ├── main.jsx                  # React DOM entry point
    ├── App.jsx                   # Root component + Router setup
    │
    ├── assets/                   # Static files
    │   ├── images/
    │   │   └── logo.svg
    │   └── icons/
    │
    ├── components/               # Reusable UI components
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Select.jsx
    │   │   ├── Textarea.jsx
    │   │   ├── Badge.jsx         # Active / Inactive / Deleted
    │   │   ├── Avatar.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── Skeleton.jsx
    │   │   ├── EmptyState.jsx
    │   │   └── ImagePreview.jsx
    │   │
    │   ├── layout/
    │   │   ├── AppLayout.jsx     # Sidebar + Navbar wrapper
    │   │   ├── Sidebar.jsx       # Nav links, collapse toggle
    │   │   ├── Navbar.jsx        # Top bar, profile, logout
    │   │   ├── PageHeader.jsx    # Page title + breadcrumb
    │   │   └── AuthLayout.jsx    # Centered card for auth pages
    │   │
    │   ├── table/
    │   │   ├── DataTable.jsx     # TanStack Table wrapper
    │   │   ├── TablePagination.jsx
    │   │   ├── TableSearch.jsx
    │   │   └── TableActions.jsx  # Edit / Delete / Restore buttons
    │   │
    │   ├── modal/
    │   │   ├── Modal.jsx         # Base modal wrapper
    │   │   ├── ConfirmDialog.jsx # Delete confirmation
    │   │   └── FormModal.jsx     # Modal wrapping a form
    │   │
    │   ├── charts/
    │   │   ├── LineChart.jsx
    │   │   ├── BarChart.jsx
    │   │   └── DonutChart.jsx
    │   │
    │   ├── upload/
    │   │   └── ImageUploader.jsx # React Dropzone + preview
    │   │
    │   └── guards/
    │       └── AdminAuthGuard.jsx # Route protection HOC
    │
    ├── pages/                    # Route-level page components
    │   │
    │   ├── auth/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── TwoFactorPage.jsx
    │   │
    │   ├── dashboard/
    │   │   └── DashboardPage.jsx
    │   │
    │   ├── users/
    │   │   ├── UsersPage.jsx         # All users list
    │   │   ├── DeletedByAdminPage.jsx
    │   │   ├── DeletedByUserPage.jsx
    │   │   └── BothDeletedPage.jsx
    │   │
    │   ├── categories/
    │   │   ├── CategoriesPage.jsx    # Parent + sub tree view
    │   │   ├── AddCategoryPage.jsx
    │   │   └── EditCategoryPage.jsx
    │   │
    │   ├── products/
    │   │   ├── ProductsPage.jsx
    │   │   ├── AddProductPage.jsx
    │   │   └── EditProductPage.jsx
    │   │
    │   ├── orders/
    │   │   ├── OrdersPage.jsx
    │   │   └── OrderDetailPage.jsx
    │   │
    │   ├── payments/
    │   │   └── PaymentSettingsPage.jsx
    │   │
    │   ├── promo/
    │   │   ├── PromoCodesPage.jsx
    │   │   └── AddPromoPage.jsx
    │   │
    │   ├── membership/
    │   │   ├── MembershipPlansPage.jsx
    │   │   ├── AddPlanPage.jsx
    │   │   └── UserMembershipPage.jsx
    │   │
    │   └── errors/
    │       ├── NotFoundPage.jsx      # 404
    │       └── UnauthorizedPage.jsx  # 403
    │
    ├── services/                 # Axios API call functions
    │   ├── axiosInstance.js      # Base Axios config + interceptors
    │   ├── authService.js        # registeradmin, loginAdmin, 2FA
    │   ├── userService.js        # alluserList, searchList, delete, reactivate
    │   ├── categoryService.js    # addCategory, list, edit, delete, search
    │   ├── productService.js     # addProduct, update, delete, list, search
    │   ├── orderService.js       # orderList
    │   ├── paymentService.js     # setPaymentMethod
    │   ├── promoService.js       # addpromoCode, list, update, delete, enable
    │   └── membershipService.js  # addSubplan, update, disable, reactivate
    │
    ├── store/                    # Redux Toolkit
    │   ├── index.js              # configureStore
    │   ├── slices/
    │   │   ├── authSlice.js      # admin token, profile, 2FA state
    │   │   ├── themeSlice.js     # dark/light mode
    │   │   └── uiSlice.js        # sidebar collapsed, modal open
    │   └── api/                  # RTK Query API slices
    │       ├── usersApi.js
    │       ├── categoriesApi.js
    │       ├── productsApi.js
    │       ├── ordersApi.js
    │       ├── promoApi.js
    │       └── membershipApi.js
    │
    ├── hooks/                    # Custom React hooks
    │   ├── useAuth.js            # Auth state helpers
    │   ├── useDebounce.js        # Debounce search input
    │   ├── usePagination.js      # Page/limit state
    │   ├── useToast.js           # Wrapper for react-hot-toast
    │   └── useImagePreview.js    # File → object URL preview
    │
    ├── utils/                    # Pure helper functions
    │   ├── constants.js          # API endpoints, enums, config values
    │   ├── validators.js         # Yup schema definitions
    │   ├── formatters.js         # Date, currency, truncate helpers
    │   ├── tokenHelper.js        # get/set/remove JWT from localStorage
    │   └── exportCSV.js          # CSV export utility
    │
    ├── routes/
    │   ├── index.jsx             # All route definitions
    │   └── routePaths.js         # Named path constants
    │
    └── styles/
        └── globals.css           # Tailwind base + custom CSS vars
```

---

## 🔌 API ENDPOINTS REFERENCE

### Auth
| Function | Method | Endpoint |
|---|---|---|
| `registerAdmin` | POST | `/admin/register` |
| `loginAdmin` | POST | `/admin/login` |
| `verify2FA` | POST | `/admin/verify-2fa` |

### Users
| Function | Method | Endpoint |
|---|---|---|
| `getAllUsers` | GET | `/admin/users` |
| `searchUsers` | GET | `/admin/users/search?q=` |
| `deleteUser` | DELETE | `/admin/users/:id` |
| `reactivateUser` | PATCH | `/admin/users/:id/reactivate` |
| `deletedByAdmin` | GET | `/admin/users/deleted-by-admin` |
| `deletedByUser` | GET | `/admin/users/deleted-by-user` |
| `bothDeleted` | GET | `/admin/users/both-deleted` |

### Categories
| Function | Method | Endpoint |
|---|---|---|
| `addCategory` | POST | `/admin/categories` |
| `addSubCategory` | POST | `/admin/categories/sub` |
| `listCategories` | GET | `/admin/categories` |
| `editCategory` | PUT | `/admin/categories/:id` |
| `deleteCategory` | DELETE | `/admin/categories/:id` |
| `reactivateCategory` | PATCH | `/admin/categories/:id/reactivate` |
| `searchCategory` | GET | `/admin/categories/search?q=` |

### Products
| Function | Method | Endpoint |
|---|---|---|
| `addProduct` | POST | `/admin/products` |
| `updateProduct` | PUT | `/admin/products/:id` |
| `deleteProduct` | DELETE | `/admin/products/:id` |
| `reactivateProduct` | PATCH | `/admin/products/:id/reactivate` |
| `listProducts` | GET | `/admin/products` |
| `searchProducts` | GET | `/admin/products/search?q=` |

### Orders
| Function | Method | Endpoint |
|---|---|---|
| `listOrders` | GET | `/admin/orders` |
| `getOrderDetail` | GET | `/admin/orders/:id` |

### Payments
| Function | Method | Endpoint |
|---|---|---|
| `setPaymentMethod` | POST | `/admin/settings/payment` |

### Promo Codes
| Function | Method | Endpoint |
|---|---|---|
| `addPromoCode` | POST | `/admin/promo` |
| `listPromoCodes` | GET | `/admin/promo` |
| `updatePromoCode` | PUT | `/admin/promo/:id` |
| `deletePromoCode` | DELETE | `/admin/promo/:id` |
| `enablePromoCode` | PATCH | `/admin/promo/:id/enable` |

### Membership Plans
| Function | Method | Endpoint |
|---|---|---|
| `addPlan` | POST | `/admin/membership` |
| `updatePlan` | PUT | `/admin/membership/:id` |
| `disablePlan` | PATCH | `/admin/membership/:id/disable` |
| `reactivatePlan` | PATCH | `/admin/membership/:id/reactivate` |
| `userMembershipStatus` | GET | `/admin/membership/users` |

---

## 🗺️ ROUTING MAP

```
/                          → redirect → /dashboard
/login                     → LoginPage
/register                  → RegisterPage
/verify-2fa               → TwoFactorPage

[Protected — AdminAuthGuard]
/dashboard                 → DashboardPage
/users                     → UsersPage
/users/deleted-by-admin    → DeletedByAdminPage
/users/deleted-by-user     → DeletedByUserPage
/users/both-deleted        → BothDeletedPage
/categories                → CategoriesPage
/categories/add            → AddCategoryPage
/categories/edit/:id       → EditCategoryPage
/products                  → ProductsPage
/products/add              → AddProductPage
/products/edit/:id         → EditProductPage
/orders                    → OrdersPage
/orders/:id                → OrderDetailPage
/payments                  → PaymentSettingsPage
/promo                     → PromoCodesPage
/promo/add                 → AddPromoPage
/membership                → MembershipPlansPage
/membership/add            → AddPlanPage
/membership/users          → UserMembershipPage

*                          → NotFoundPage (404)
```

---

## 🧩 REDUX STORE SHAPE

```js
{
  auth: {
    admin: { id, username, email, is2FaEnabled },
    token: "jwt_string",
    is2faverified: false,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  theme: {
    mode: "light" | "dark"
  },
  ui: {
    sidebarCollapsed: false,
    activeModal: null
  },
  // RTK Query managed state (auto-generated)
  usersApi: { ... },
  categoriesApi: { ... },
  productsApi: { ... },
  ordersApi: { ... },
  promoApi: { ... },
  membershipApi: { ... }
}
```

---

## ✅ YUP VALIDATION SCHEMAS

```js
// validators.js

export const registerSchema = Yup.object({
  username: Yup.string().min(4).max(20).required("Username required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(8, "Min 8 chars").required("Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password required"),
});

export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required(),
  password: Yup.string().min(8).required(),
});

export const categorySchema = Yup.object({
  name: Yup.string().min(2).max(50).required("Name required"),
  description: Yup.string().max(200),
  image: Yup.mixed().required("Image required"),
});

export const productSchema = Yup.object({
  name: Yup.string().min(2).max(100).required(),
  description: Yup.string().max(500),
  price: Yup.number().positive().required("Price required"),
  qty: Yup.number().integer().min(0).required("Quantity required"),
  maincategoryId: Yup.string().required("Main category required"),
  categoryId: Yup.string().required("Subcategory required"),
  image: Yup.mixed().required("Product image required"),
});

export const promoSchema = Yup.object({
  code: Yup.string().min(3).max(20).required("Code required"),
  type: Yup.number().oneOf([0, 1]).required(),
  discountType: Yup.string().oneOf(["flat", "percentage"]).required(),
  discountValue: Yup.number().positive().required(),
  startDate: Yup.date().when("type", {
    is: 0,
    then: (s) => s.required("Start date required for Auto type"),
  }),
  endDate: Yup.date().when("type", {
    is: 0,
    then: (s) =>
      s
        .min(Yup.ref("startDate"), "End date must be after start")
        .required("End date required for Auto type"),
  }),
});

export const membershipPlanSchema = Yup.object({
  name: Yup.string().min(2).required("Plan name required"),
  price: Yup.number().min(0).required(),
  duration_months: Yup.number().integer().positive().required(),
  discount_percent: Yup.number().min(0).max(100).required(),
  min_order_amount: Yup.number().min(0).required(),
});
```

---

## 🔐 AXIOS INSTANCE SETUP

```js
// services/axiosInstance.js

import axios from "axios";
import { getToken, removeToken } from "../utils/tokenHelper";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach JWT
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401 auto-logout
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 💡 ADVANCED ENHANCEMENTS CHECKLIST

| Feature | Priority | Notes |
|---|---|---|
| 2FA QR Code UI | High | Use `qrcode.react` library |
| Dark Mode | High | Tailwind `dark:` classes + themeSlice |
| CSV Export | Medium | `exportCSV.js` utility with `papaparse` |
| Notifications System | Medium | RTK Query polling or WebSocket |
| Role-based Permissions | Low | `permissionsSlice` for future sub-admins |
| Skeleton Loaders | High | Every list/table while RTK Query fetching |
| Empty States | High | Each module with zero-data illustration |

---

*System prompt and full structure for E-commerce Admin Panel Frontend — ready for developer handoff.*