import { NextRequest } from "next/server";
import { db } from "../database/connection";
import { logger, authLogger } from "../logger";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-with-minimum-32-characters";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

if (!process.env.JWT_SECRET) {
  console.warn(
    "JWT_SECRET not set, using default development key. This is not secure for production!",
  );
}

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  login_attempts: number;
  locked_until?: Date;
  password_hash: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  role: "super_admin" | "editor" | "viewer";
  phone?: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthenticatedUser {
  user: User;
  profile: Profile;
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character",
    ),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  display_name: z.string().optional(),
});

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code: string = "AUTH_ERROR",
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(payload: {
  userId: string;
  email: string;
}): string {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    throw new AuthenticationError(
      "Failed to generate token",
      "TOKEN_GENERATION_ERROR",
    );
  }
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token", "INVALID_TOKEN");
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(query, [email.toLowerCase()]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    logger.error("Failed to get user by email", error as Error, { email });
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await db.query(query, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    logger.error("Failed to get user by ID", error as Error, { id });
    throw error;
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const query =
      "SELECT * FROM profiles WHERE user_id = $1 AND is_active = true";
    const result = await db.query(query, [userId]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    logger.error("Failed to get user profile", error as Error, { userId });
    throw error;
  }
}

// Check if user account is locked
export async function isAccountLocked(user: User): Promise<boolean> {
  if (!user.locked_until) return false;

  const now = new Date();
  const lockoutEnd = new Date(user.locked_until);

  if (now < lockoutEnd) {
    return true;
  }

  // Unlock account if lockout period has expired
  await unlockAccount(user.id);
  return false;
}

// Lock user account
export async function lockAccount(userId: string): Promise<void> {
  const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);

  const query = `
    UPDATE users
    SET locked_until = $1, login_attempts = $2
    WHERE id = $3
  `;

  await db.query(query, [lockedUntil, MAX_LOGIN_ATTEMPTS, userId]);

  authLogger.failed(
    "Account locked due to multiple failed attempts",
    undefined,
    undefined,
    "MAX_ATTEMPTS_EXCEEDED",
  );
}

// Unlock user account
export async function unlockAccount(userId: string): Promise<void> {
  const query = `
    UPDATE users
    SET locked_until = NULL, login_attempts = 0
    WHERE id = $1
  `;

  await db.query(query, [userId]);
}

// Update login attempts
export async function updateLoginAttempts(
  userId: string,
  increment: boolean = true,
): Promise<void> {
  const query = increment
    ? "UPDATE users SET login_attempts = login_attempts + 1 WHERE id = $1"
    : "UPDATE users SET login_attempts = 0, last_login = NOW() WHERE id = $1";

  await db.query(query, [userId]);
}

// Register new user
export async function registerUser(
  userData: z.infer<typeof registerSchema>,
): Promise<AuthenticatedUser> {
  try {
    // Validate input
    const validatedData = registerSchema.parse(userData);

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      throw new AuthenticationError(
        "User with this email already exists",
        "USER_EXISTS",
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Use transaction for user creation
    return await db.transaction(async (client) => {
      // Create user
      const userQuery = `
        INSERT INTO users (email, password_hash, email_verified, created_at, updated_at)
        VALUES ($1, $2, false, NOW(), NOW())
        RETURNING *
      `;

      const userResult = await client.query(userQuery, [
        validatedData.email.toLowerCase(),
        passwordHash,
      ]);

      const user = userResult.rows[0];

      // Create profile
      const profileQuery = `
        INSERT INTO profiles (
          user_id, first_name, last_name, display_name, role, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, 'viewer', true, NOW(), NOW())
        RETURNING *
      `;

      const displayName =
        validatedData.display_name ||
        `${validatedData.first_name} ${validatedData.last_name}`;

      const profileResult = await client.query(profileQuery, [
        user.id,
        validatedData.first_name,
        validatedData.last_name,
        displayName,
      ]);

      const profile = profileResult.rows[0];

      authLogger.register("New user registered", user.id, user.email);

      return { user, profile };
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AuthenticationError(
        "Invalid registration data",
        "VALIDATION_ERROR",
      );
    }

    logger.error("Failed to register user", error as Error, {
      email: userData.email,
    });
    throw error;
  }
}

// Login user
export async function loginUser(
  credentials: z.infer<typeof loginSchema>,
  ip?: string,
): Promise<{
  user: AuthenticatedUser;
  token: string;
}> {
  try {
    // Validate input
    const validatedCredentials = loginSchema.parse(credentials);

    // Get user
    const user = await getUserByEmail(validatedCredentials.email);
    if (!user) {
      authLogger.failed(
        "Login attempt with non-existent email",
        validatedCredentials.email,
        ip,
        "USER_NOT_FOUND",
      );
      throw new AuthenticationError(
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    // Check if account is locked
    if (await isAccountLocked(user)) {
      authLogger.failed(
        "Login attempt on locked account",
        validatedCredentials.email,
        ip,
        "ACCOUNT_LOCKED",
      );
      throw new AuthenticationError(
        "Account is temporarily locked due to multiple failed attempts",
        "ACCOUNT_LOCKED",
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      validatedCredentials.password,
      user.password_hash,
    );

    if (!isValidPassword) {
      // Increment login attempts
      await updateLoginAttempts(user.id, true);

      // Lock account if max attempts reached
      if (user.login_attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        await lockAccount(user.id);
      }

      authLogger.failed(
        "Invalid password attempt",
        validatedCredentials.email,
        ip,
        "INVALID_PASSWORD",
      );

      throw new AuthenticationError(
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    // Get user profile
    const profile = await getUserProfile(user.id);
    if (!profile) {
      throw new AuthenticationError(
        "User profile not found",
        "PROFILE_NOT_FOUND",
      );
    }

    // Check if profile is active
    if (!profile.is_active) {
      authLogger.failed(
        "Login attempt on inactive profile",
        validatedCredentials.email,
        ip,
        "PROFILE_INACTIVE",
      );
      throw new AuthenticationError("Account is inactive", "ACCOUNT_INACTIVE");
    }

    // Reset login attempts and update last login
    await updateLoginAttempts(user.id, false);

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    authLogger.login("User logged in successfully", user.id, user.email, ip);

    return {
      user: { user, profile },
      token,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AuthenticationError("Invalid login data", "VALIDATION_ERROR");
    }

    if (error instanceof AuthenticationError) {
      throw error;
    }

    logger.error("Failed to login user", error as Error, credentials);
    throw new AuthenticationError("Login failed", "LOGIN_ERROR");
  }
}

// Authenticate user from request
export async function authenticateUser(
  request: NextRequest,
): Promise<AuthenticatedUser | null> {
  try {
    // Get token from header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyToken(token);

    // Get user and profile
    const user = await getUserById(payload.userId);
    if (!user) {
      throw new AuthenticationError("User not found", "USER_NOT_FOUND");
    }

    const profile = await getUserProfile(user.id);
    if (!profile || !profile.is_active) {
      throw new AuthenticationError(
        "Profile not found or inactive",
        "PROFILE_INACTIVE",
      );
    }

    return { user, profile };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      logger.warn("Authentication failed", {
        error: error.message,
        code: error.code,
      });
    } else {
      logger.error("Authentication error", error as Error);
    }
    return null;
  }
}

// Check if user has required role
export function requireRole(
  profile: Profile,
  allowedRoles: Profile["role"][],
): boolean {
  return allowedRoles.includes(profile.role);
}

// Role hierarchy check (higher roles include lower permissions)
export function hasPermissionLevel(
  profile: Profile,
  requiredLevel: Profile["role"],
): boolean {
  const roleHierarchy: Record<Profile["role"], number> = {
    viewer: 1,
    editor: 2,
    super_admin: 3,
  };

  const userLevel = roleHierarchy[profile.role] || 0;
  const requiredLevelNum = roleHierarchy[requiredLevel] || 0;

  return userLevel >= requiredLevelNum;
}

// Middleware to require authentication
export async function requireAuth(
  request: NextRequest,
): Promise<AuthenticatedUser> {
  const userInfo = await authenticateUser(request);
  if (!userInfo) {
    throw new AuthenticationError("Authentication required", "AUTH_REQUIRED");
  }
  return userInfo;
}

// Middleware to require specific role
export async function requireRoleMiddleware(
  request: NextRequest,
  allowedRoles: Profile["role"][],
): Promise<AuthenticatedUser> {
  const userInfo = await requireAuth(request);

  if (!requireRole(userInfo.profile, allowedRoles)) {
    throw new AuthorizationError("Insufficient permissions");
  }

  return userInfo;
}

// Log audit trail for authentication events
export async function logAuditEvent(
  userId: string,
  action: string,
  details?: Record<string, any>,
  ip?: string,
): Promise<void> {
  try {
    const query = `
      INSERT INTO audit_logs (user_id, action, table_name, old_values, new_values, ip_address, created_at)
      VALUES ($1, $2, 'auth', NULL, $3, $4, NOW())
    `;

    await db.query(query, [
      userId,
      action,
      details ? JSON.stringify(details) : null,
      ip,
    ]);
  } catch (error) {
    logger.error("Failed to log audit event", error as Error, {
      userId,
      action,
      details,
    });
  }
}

// Change password
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  try {
    // Get user
    const user = await getUserById(userId);
    if (!user) {
      throw new AuthenticationError("User not found", "USER_NOT_FOUND");
    }

    // Verify current password
    const isValidPassword = await verifyPassword(
      currentPassword,
      user.password_hash,
    );
    if (!isValidPassword) {
      throw new AuthenticationError(
        "Current password is incorrect",
        "INVALID_CURRENT_PASSWORD",
      );
    }

    // Validate new password
    const passwordSchema = z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character",
      );

    passwordSchema.parse(newPassword);

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    const query =
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2";
    await db.query(query, [newPasswordHash, userId]);

    // Log audit event
    await logAuditEvent(userId, "PASSWORD_CHANGED");

    authLogger.login("Password changed successfully", userId, user.email);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AuthenticationError(
        "Invalid password format",
        "INVALID_PASSWORD_FORMAT",
      );
    }

    logger.error("Failed to change password", error as Error, { userId });
    throw error;
  }
}

// Logout user (mainly for logging purposes in stateless JWT setup)
export async function logoutUser(userId: string, email: string): Promise<void> {
  authLogger.logout("User logged out", userId, email);
  await logAuditEvent(userId, "LOGOUT");
}
