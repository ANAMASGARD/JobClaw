// Server-only — verifies the Web3Auth idToken issued to the client after social login.
// Called from POST /api/auth/web3auth to authenticate users.

import { createRemoteJWKSet, jwtVerify } from "jose";

// Web3Auth signs idTokens with ES256; JWKS is stable for all v11 projects.
const JWKS_URL = "https://api.openlogin.com/jwks";
const jwks = createRemoteJWKSet(new URL(JWKS_URL));

export interface Web3AuthTokenPayload {
  sub: string; // unique per user per Web3Auth project (web3authSub)
  email?: string;
  name?: string;
  picture?: string;
  wallets?: Array<{ type: string; address: string; public_key?: string }>;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export async function verifyWeb3AuthIdToken(
  idToken: string
): Promise<Web3AuthTokenPayload> {
  const { payload } = await jwtVerify<Web3AuthTokenPayload>(idToken, jwks, {
    algorithms: ["ES256"],
  });
  return payload;
}
