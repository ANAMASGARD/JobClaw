// Server-only session helpers — httpOnly cookie backed by a signed JWT.
// Import only from API routes, Server Actions, and Server Components.

import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SESSION_COOKIE = "jc_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is not set");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  userId: string;
  authMethod: "web3auth" | "metamask";
  walletAddress?: string;
  smartAccountAddress?: string;
}

export async function createSessionToken(
  payload: Omit<SessionPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized — no active session");
  return session.userId;
}

export function makeSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}
