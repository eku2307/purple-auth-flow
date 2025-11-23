# UPI Backend Integration Guide

## ✅ What's Been Integrated

Your NovaPay frontend is now fully integrated with the UPI Backend API. Supabase has been removed and replaced with direct API calls to your backend team's Spring Boot server.

## 🔧 Setup Instructions

### 1. Configure Backend URL

Update the `.env.local` file with your backend server URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For production, update this to your deployed backend URL.

### 2. Start Your Backend Server

Make sure your UPI Backend is running on `http://localhost:8080` (or your configured URL).

Refer to: https://github.com/swarnim921/upi-backend

### 3. Start Frontend Development Server

```bash
npm run dev
```

## 📁 New File Structure

### API Services (`src/lib/`)

- **`api.ts`**: Core API client with JWT authentication
- **`auth.ts`**: Authentication services (login, register, profile)
- **`payment.ts`**: Payment services (send money, transactions)

### Context (`src/contexts/`)

- **`AuthContext.tsx`**: Global auth state management with React Context

### Updated Components

- **`App.tsx`**: Added AuthProvider wrapper
- **`Auth.tsx`**: Now uses UPI backend APIs
- **`Dashboard.tsx`**: Now uses AuthContext instead of Supabase

## 🔐 Authentication Flow

### Login
1. User enters email/password
2. POST request to `/api/auth/login`
3. JWT token stored in `localStorage`
4. User info stored for quick access
5. All subsequent API calls include `Authorization: Bearer <token>` header

### Register
1. User enters username, email, password
2. POST request to `/api/auth/register`
3. Automatically logs in after successful registration

### Logout
1. Clears JWT token from `localStorage`
2. Clears user info
3. Redirects to auth page

## 🚀 Available API Functions

### Authentication
```typescript
import { authService } from '@/lib/auth';

// Login
await authService.login({ email, password });

// Register
await authService.register({ username, email, password });

// Get current user profile
const profile = await authService.getProfile();

// Get wallet info
const wallet = await authService.getWallet();

// Logout
authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### Payments
```typescript
import { paymentService } from '@/lib/payment';

// Send payment
await paymentService.sendPayment({
  recipientUpiId: 'user@upi',
  amount: 100.00,
  description: 'Payment for services'
});

// Get transaction history
const transactions = await paymentService.getTransactions();
```

### Using Auth Context in Components
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  
  // user contains: { id, username, email, token, roles }
  // isAuthenticated is true/false
}
```

## 🔗 Backend API Endpoints Used

Based on the UPI Backend documentation:

### Auth Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth (needs backend setup)

### User Endpoints (Authenticated)
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/wallet` - Get wallet information

### Payment Endpoints (Authenticated)
- `POST /api/payments/send` - Send payment
- `GET /api/payments/transactions` - Get transaction history

## 🎨 Features Implemented

✅ JWT-based authentication
✅ Email/password login and registration
✅ Persistent login (JWT stored in localStorage)
✅ Automatic token injection in API calls
✅ Error handling and toast notifications
✅ Theme toggle (dark/light mode)
✅ Responsive design
✅ Google OAuth UI (backend configuration needed)

## 📝 Next Steps

You can now extend the application by:

1. **Add Payment Features**: Create pages for sending money and viewing transactions
2. **Add Wallet Display**: Show user's wallet balance on dashboard
3. **Add Transaction History**: Display transaction list with filters
4. **Profile Management**: Allow users to update their profile
5. **Google OAuth**: Configure Google OAuth in your backend

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors, make sure your backend allows requests from your frontend origin:
```java
// In your Spring Boot backend
@CrossOrigin(origins = "http://localhost:5173")
```

### 401 Unauthorized
- Check if JWT token is being sent in headers
- Verify token hasn't expired
- Check backend JWT validation

### Connection Refused
- Ensure backend is running on correct port
- Verify `VITE_API_BASE_URL` in `.env.local`

## 📚 Documentation References

- UPI Backend Docs: https://github.com/swarnim921/upi-backend/tree/main/docs
- API Reference: Check backend's `/docs/api/API_REFERENCE.md`
- Integration Guide: Check backend's `/docs/integration/FRONTEND_BACKEND_INTEGRATION.md`
