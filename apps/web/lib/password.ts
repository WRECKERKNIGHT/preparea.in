import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt with a random salt.
 * Returns the hash in the format: $scrypt$base64salt$base64hash
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32).toString("base64");
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return `$scrypt$salt=${salt}$key=${derivedKey.toString("base64")}`;
}

/**
 * Verify a password against a hash.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const [prefix, saltPart, keyPart] = hash.split("$");
    if (prefix !== "scrypt" || !saltPart || !keyPart) return false;

    const salt = saltPart.replace("salt=", "");
    const storedKey = Buffer.from(keyPart.replace("key=", ""), "base64");
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer;

    // Timing-safe comparison
    return timingSafeEqual(storedKey, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Validate password strength.
 * Requirements: 8-128 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8 || password.length > 128) {
    return "Password must be between 8 and 128 characters.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  if (email.length > 254) {
    return "Email address is too long.";
  }
  return null;
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .slice(0, 1000);
}
