export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_2FA: '/verify-2fa',

  DASHBOARD: '/dashboard',
  USERS: '/customers',
  // USERS: '/users',
  USERS_DELETED_ADMIN: '/users/deleted-by-admin',
  USERS_DELETED_USER: '/users/deleted-by-user',
  USERS_BOTH_DELETED: '/users/both-deleted',

  CATEGORIES: '/categories',
  CATEGORIES_ADD: '/categories/add',
  CATEGORIES_EDIT: '/categories/edit/:id',
  SUBCATEGORIES: '/categories/:categoryId/subcategories',
  SUBCATEGORY_PRODUCTS: '/categories/:categoryId/subcategories/:subcategoryId/products',
  SUBSCRIPTIONS: '/subscriptions',

  PRODUCTS: '/products',
  PRODUCTS_ADD: '/products/add',
  PRODUCTS_EDIT: '/products/edit/:id',
  SETTINGS: '/settings',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',

  PAYMENTS: '/payments',

  PROMO: '/promo',
  PROMO_ADD: '/promo/add',

  MEMBERSHIP: '/membership',
  MEMBERSHIP_ADD: '/membership/add',
  MEMBERSHIP_USERS: '/membership/users',
};
