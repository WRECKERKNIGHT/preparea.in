# PrepArea - Authentication System Update

## Overview
PrepArea has been updated from an email OTP authentication system to a secure password-based authentication system with password reset functionality.

## Key Changes

### Authentication Flow
- **Before**: Register → Receive OTP email → Enter 6-digit code → Login
- **After**: Register → Set password → Login with email + password

### Security Improvements
- Password hashing using scrypt (industry-standard, slow hash)
- Constant-time comparison prevents timing attacks
- Password strength validation enforced (min 8 chars, letters + numbers)
- JWT tokens with 7-day expiry for session management

### User Experience Improvements
- Instant access after registration (no email waiting)
- Simple two-field login (email + password)
- Clear error messages for invalid credentials
- Password reset functionality for forgotten passwords

## Files Changed

### Core Authentication
- `apps/web/lib/password.ts` - Scrypt password hashing utilities
- `apps/web/lib/password-reset.ts` - Secure token handling for reset flow
- `apps/web/lib/store.ts` - Updated Store interface and implementations
- `apps/web/lib/sql-store.ts` - Updated to use scrypt verification
- `apps/web/lib/db.ts` - Added migrations for passwordHash column and reset tokens table

### API Routes
- `apps/web/app/api/auth/login/route.ts` - New password login endpoint
- `apps/web/app/api/register/route.ts` - Updated to hash passwords
- `apps/web/app/api/auth/reset-password/route.ts` - Request password reset
- `apps/web/app/api/auth/reset-password/[token]/route.ts` - Confirm password reset

### UI Components (Web)
- `apps/web/components/register-form.tsx` - Added password inputs
- `apps/web/components/dashboard-client.tsx` - Replaced OTP login with password login
- `apps/web/app/register/success/page.tsx` - Updated messaging

### UI Components (Mobile)
- `apps/app/src/lib/api.ts` - Replaced OTP functions with login/register
- `apps/app/src/app/login.tsx` - Email + password login form
- `apps/app/src/app/register.tsx` - Registration with password inputs
- `apps/app/src/app/forgot-password/page.tsx` - Request reset link
- `apps/app/src/app/reset-password/[token]/page.tsx` - Set new password

### Removed Files
- All OTP-related functionality: mailer.ts, otp.ts, rate-limit.ts, and associated API routes

## Testing
See `TESTING_GUIDE.md` for comprehensive step-by-step testing instructions.

## Deployment
1. Set environment variables:
   - `JWT_SECRET` = strong random string for JWT signing
   - `TURSO_DATABASE_URL` or `SQLITE_DB_PATH` = database connection

2. Deploy web app to Vercel:
   ```bash
   cd apps/web
   vercel --prod
   ```

3. Build mobile app with EAS:
   ```bash
   cd apps/app
   eas build --platform all
   ```

## Security Notes
- Passwords are never stored in plaintext
- Uses scrypt algorithm with unique salt per password
- Reset tokens are hashed, expire after 1 hour, and can only be used once
- Protected against email enumeration in reset flow
- Constant-time comparison prevents timing attacks on password verification