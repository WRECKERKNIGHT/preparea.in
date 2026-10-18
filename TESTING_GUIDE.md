# PrepArea Authentication Testing Guide

## Overview
This guide provides steps to test the password-based authentication system implemented for PrepArea.

## Prerequisites
- Node.js 18+
- SQLite or Turso database configured
- Environment variables set (JWT_SECRET, etc.)

## Testing the Web Application

### 1. User Registration
1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form:
   - Name: Test User
   - Email: test@example.com
   - Class: 12
   - Exam: JEE
   - Daily Target: 300
   - Password: securePass123
   - Confirm Password: securePass123
3. Click "Create account"
4. Expected: Success message and redirect to login

### 2. User Login
1. Navigate to `http://localhost:3000/login` (or try to access a protected route)
2. Enter:
   - Email: test@example.com
   - Password: securePass123
3. Click "Log in"
4. Expected: Redirect to dashboard

### 3. Invalid Login
1. Try logging in with:
   - Email: test@example.com
   - Password: wrongPassword
2. Expected: Error message "Email or password is incorrect."

### 4. Password Strength Validation
1. During registration, try:
   - Password: 123 (too short)
   - Expected: "Password must be at least 8 characters long."
2. Try:
   - Password: 12345678 (no letters)
   - Expected: "Password must contain at least one letter."
3. Try:
   - Password: password (no numbers)
   - Expected: "Password must contain at least one number."

### 5. Password Reset Flow
1. Navigate to `/forgot-password`
2. Enter email: test@example.com
3. Click "Send reset link"
4. Expected: Success message
5. Check console for reset link (in development)
6. Visit the reset link: `http://localhost:3000/reset-password?token=xxx`
7. Enter new password and confirm
8. Click "Reset password"
9. Expected: Success message and redirect to login
10. Login with new password

### 6. Session Management
1. Login successfully
2. Access protected routes (dashboard, etc.)
3. Expected: Access granted
4. Logout (if implemented)
5. Try accessing protected routes again
6. Expected: Redirected to login

## Testing the Mobile Application

### 1. User Registration
1. In Expo Go or emulator, navigate to registration screen
2. Fill in form with valid data including password
3. Submit
4. Expected: Success message and option to log in

### 2. User Login
1. Navigate to login screen
2. Enter email and password
3. Submit
4. Expected: Navigate to main app tabs

### 3. Password Reset
1. Navigate to forgot password screen
2. Enter email
3. Submit
4. Check console for reset link (development)
5. Visit reset link in browser or copy to app
6. Enter new password and confirm
7. Submit
8. Expected: Success message
9. Login with new password

## Database Verification

### 1. Password Storage
1. Check database directly:
   ```sql
   SELECT id, email, passwordHash FROM students WHERE email = 'test@example.com';
   ```
2. Verify:
   - passwordHash is not null
   - passwordHash starts with `$scrypt$`
   - Same email always produces different hash (due to salt)

### 2. Migration Check
1. Verify migrations table:
   ```sql
   SELECT * FROM _migrations ORDER BY id;
   ```
2. Should see migrations 001 through 005

## Security Checks

### 1. Timing Attack Protection
- Password verification uses `timingSafeEqual` for constant-time comparison

### 2. Password Hashing
- Uses scrypt algorithm with 16-byte salt and 64-bit derived key
- Never stores plaintext passwords

### 3. Token Security
- Reset tokens are hashed before storage
- Reset tokens expire after 1 hour
- Reset tokens can only be used once

## Common Issues

### 1. "Cannot find module './otp'" errors
- Ensure all OTP imports have been removed
- Check: apps/web/lib/store.ts, apps/web/lib/sql-store.ts

### 2. TypeScript errors about passwordHash
- Ensure RegisterInput interface includes passwordHash property
- Check: packages/shared/src/index.ts

### 3. Database migration not running
- Ensure migration 004 and 005 are in MIGRATIONS array
- Check: apps/web/lib/db.ts

## Performance Notes

- Password hashing (scrypt) is intentionally slow for security
- Consider adjusting work factor if registration/login becomes too slow
- Current settings: salt=16 bytes, cost=64 (derived key length)

## Deployment Checklist

Before deploying to production:

1. [ ] Set strong JWT_SECRET environment variable
2. [ ] Configure database URL (TURSO_DATABASE_URL or SQLITE_DB_PATH)
3. [ ] Verify all OTP references removed
4. [ ] Run database migrations
5. [ ] Test registration and login flows
6. [ ] Test password reset flow
7. [ ] Check that demo accounts still work (if needed)
8. [ ] Monitor logs for authentication errors

## Test Credentials

For testing, you can use:
- Email: test@example.com
- Password: securePass123

Remember to change these in production!