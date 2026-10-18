import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt with a random salt.
 * Returns the hash in the format: $scrypt$base64salt$base64hash
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64");
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return `$scrypt$salt=${salt}$key=${derivedKey.toString("base64")}`;
}

/**
 * Verify a password against a hash.
 * Returns true if the password matches.
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

    return timingSafeEqual(storedKey, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Validate password strength.
 * Minimum: 8 chars, at least 1 letter and 1 number.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  return null;
}
