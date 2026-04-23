# Admin Panel Frontend — E-commerce Platform

> A complete React-based Admin Panel strictly aligned with backend APIs and MongoDB schemas. This panel serves the **Admin role only** and covers authentication, analytics, user/product/order management, payments, promo codes, and membership plans.

---

## 🔐 1. Admin Authentication Module

**Model Fields:** `username`, `email`, `password`, `is2FaEnabled`, `is2faverified`

### Pages

#### Admin Registration
- **Fields:** Username, Email, Password, Confirm Password
- **Validation:**
  - Username: 4–20 characters
  - Email: valid format
  - Password: minimum 8 characters
- **API:** `registeradmin`

#### Admin Login
- **Fields:** Email, Password
- **API:** `loginAdmin`

#### Two-Factor Authentication (2FA)
- Triggered when `is2FaEnabled = 1`
- Displays OTP / 2FA verification screen
- Handles `is2faverified` flag via backend validation

---

## 📊 2. Dashboard — Analytics Overview

### Stat Cards
| Metric | Description |
|---|---|
| Total Customers | All registered users |
| Total Categories | Parent categories only |
| Total Subcategories | Child categories |
| Total Products | All listed products |
| Completed Orders | Orders with completed status |

### Charts
- Orders trend (line/bar chart)
- Revenue trend (line chart)
- Product distribution (pie/donut chart)

### Recent Activity
- Latest registered users
- Recent orders with status

---

## 👥 3. User Management

**APIs:** `alluserList`, `searchList`, `adminDeleteuser`, `reactivateUser`, `userListdeletedbyAdmin`, `bothDeletedUser`

### User Table Columns
`Name` · `Email` · `Status` · `Created Date`

### Features
- Search users by name/email
- Soft delete user (sets `deletedAt`)
- Reactivate deleted user

### Special Views
| View | Description |
|---|---|
| Deleted by Admin | Users removed by admin |
| Deleted by User | Self-deleted accounts |
| Both Deleted | Deleted by both parties |

---

## 🗂️ 4. Category & Subcategory Management

**Model Fields:** `name`, `description`, `image`, `categoryId` (parent-child), `status`

**APIs:** `addCategory`, `addsubCategory`, `categoryList`, `editCategory&subCategory`, `deleteCategory&subCategory`, `reActivateCategory`, `searchCategory`

### Features
- Tree structure display: **Parent → Subcategory**
- Add / Edit / Delete category or subcategory
- Image upload with preview
- Toggle status: **Active / Inactive**

---

## 📦 5. Product Management

**Model Fields:** `name`, `description`, `image`, `qty`, `price`, `maincategoryId`, `categoryId`, `status`

**APIs:** `addProduct`, `updateProduct`, `deleteProduct`, `reActivateproduct`, `listProduct`, `searchProduct`

### Product Table Columns
`Image` · `Name` · `Price` · `Quantity` · `Category`

### Features
- Filter by Category / Subcategory
- Add / Edit product form
- Soft delete and restore (reactivate)

---

## 🛒 6. Order Management

**API:** `orderList`

### Order List Columns
`Order ID` · `User` · `Products` · `Amount` · `Status` · `Date`

### Order Detail Page
- Itemized product list
- Applied promo code (if any)
- Payment method used
- Current order status

---

## 💳 7. Payment Settings

**Model Fields:** `paymentMethod` (1: Stripe · 2: Razorpay · 3: Other), `stripeKey`, `razorpayKey`

**API:** `setPaymentMethod`

### Features
- Select active payment gateway
- Input and save API keys securely
- Enable / Disable individual gateway

---

## 🎟️ 8. Promo Code Management

**Model Fields:** `code`, `type` (0: Auto · 1: Manual), `discountType` (flat / percentage), `discountValue`, `startDate`, `endDate`, `status`

**APIs:** `addpromoCode`, `listPromoCode`, `updatePromocode`, `deletePromocode`, `enablePromocode`

### Features
- Create promo code form with date validation (required for Auto type)
- Enable / Disable toggle per code
- Optional: promo usage tracking via `UsedPromoCode`

---

## 💼 9. Subscription / Membership Plans

**Model Fields:** `plan_type` (1/2/3), `name`, `price`, `stripe_price_id`, `duration_months`, `discount_percent`, `max_discount_limit`, `min_order_amount`, `free_delivery`, `rewards` (points, slabs), `monthlyLimit`, `priority`

**APIs:** `addSubplan`, `updateMembershipPlan`, `disableSubscriptionPlan`, `reactivatePlan`, `userMembershipStatus`

### Features
- Plan Cards UI
- Add / Edit plan form
- Toggle active / inactive per plan
- View user subscription statuses

---

## 🔎 10. Global UI Features

### Sidebar Navigation
- Dashboard
- Users
- Categories
- Products
- Orders
- Promo Codes
- Membership Plans
- Settings

### Top Navbar
- Admin profile display
- Logout button

### Shared Components
- **Data Table** — pagination, sorting, search
- **Modal Forms** — add/edit records
- **Confirmation Dialogs** — for delete/deactivate actions

---

## 🎨 11. UI/UX Requirements

- Clean, modern SaaS-style admin UI
- Fully responsive (desktop, tablet, mobile)
- Status indicators: `Active` · `Inactive` · `Deleted`
- Image previews on upload
- Loading skeletons for async data
- Error handling with user-friendly messages

---

## ⚙️ 12. Technical Stack & Requirements

| Concern | Technology |
|---|---|
| Framework | React + Vite **or** Next.js |
| State Management | Redux Toolkit / Context API |
| API Layer | Axios with interceptors |
| Form Handling | Formik + Yup |
| Styling | Tailwind CSS / CSS Modules |

### Folder Structure

```
/src
  /components       # Reusable UI components
  /pages            # Route-level page components
  /services         # Axios API call functions
  /store            # Redux slices / Context providers
  /utils            # Helpers, constants, validators
```

---

## 💡 Advanced Enhancements

- **2FA QR Code UI** — if backend supports QR-based TOTP
- **Role-based permissions** — extendable for future roles
- **Dark Mode** — theme toggle
- **Export Reports** — CSV download for users, orders, products
- **Notifications System** — in-app alerts for key events

---

*Document generated from the Final Enhanced Prompt — Model-Based Admin Frontend specification.*