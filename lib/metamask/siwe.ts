// SIWE (EIP-4361 Sign-In with Ethereum) helpers for MetaMask login + wallet linking.
// buildSiweMessage → client-safe.  verifySiweSignature → server-only (API route).

import {
  createSiweMessage,
  parseSiweMessage,
  verifySiweMessage,
} from "viem/siwe";
import { createPublicClient, http, type Address } from "viem";
import { baseSepolia, base } from "viem/chains";
import { IS_MAINNET } from "@/lib/chain-config";

export { parseSiweMessage };

// ── Client-side: build the SIWE message the user will sign ───────────────────

export function buildSiweMessage(params: {
  address: Address;
  chainId: number;
  nonce: string;
  uri?: string;
  domain?: string;
}): string {
  const domain =
    params.domain ??
    (typeof window !== "undefined"
      ? window.location.host
      : "jobclaw.vercel.app");
  const uri =
    params.uri ??
    (typeof window !== "undefined"
      ? window.location.href
      : "https://jobclaw.vercel.app");

  return createSiweMessage({
    domain,
    address: params.address,
    statement:
      "Sign in to JobClaw to authorize your autonomous job-hunting agent.",
    uri,
    version: "1",
    chainId: params.chainId,
    nonce: params.nonce,
  });
}

// ── Server-side: verify a signed SIWE message ─────────────────────────────────

const publicClient = createPublicClient({
  chain: IS_MAINNET ? base : baseSepolia,
  transport: http(IS_MAINNET ? "https://mainnet.base.org" : "https://sepolia.base.org"),
});

export async function verifySiweSignature(params: {
  message: string;
  signature: `0x${string}`;
  expectedNonce: string;
}): Promise<{ valid: boolean; address: Address | null }> {
  try {
    const valid = await verifySiweMessage(publicClient, {
      message: params.message,
      signature: params.signature,
    });
    if (!valid) return { valid: false, address: null };

    const parsed = parseSiweMessage(params.message);
    if (parsed.nonce !== params.expectedNonce) {
      return { valid: false, address: null };
    }
    return { valid: true, address: (parsed.address as Address) ?? null };
  } catch {
    return { valid: false, address: null };
  }
}

// ── Nonce generation (server-side) ───────────────────────────────────────────

export function generateNonce(): string {
  return crypto.randomUUID().replace(/-/g, "");
}
