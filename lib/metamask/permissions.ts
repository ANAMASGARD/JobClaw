// ERC-7715 Advanced Permissions — type definitions and permission builders.
// These are the permission specs sent to MetaMask's wallet_grantPermissions RPC call.
// Called from: /onboarding/permissions (client component) and lib/metamask/smartAccount.ts

import { type Hex, parseEther, toHex } from "viem";

// ── Permission request types ───────────────────────────────────────────────────

export interface PermissionRequest {
  expiry: number; // Unix timestamp
  permissions: Erc7715Permission[];
}

export interface Erc7715Permission {
  type: string;
  data?: Record<string, unknown>;
  required?: boolean;
}

// ── JobClaw agent permission spec ─────────────────────────────────────────────
// Grants the delegated smart account permission to:
//   1. Pay up to 0.01 ETH for gas across hunt/apply actions
//   2. Transfer up to $1.00 USDC for x402-gated agent actions
// These are human-readable and shown to the user on /onboarding/permissions.

export const PERMISSION_EXPIRY_DAYS = 7;

export function buildAgentPermissionRequest(): PermissionRequest {
  const expiry =
    Math.floor(Date.now() / 1000) + PERMISSION_EXPIRY_DAYS * 86400;

  return {
    expiry,
    permissions: [
      {
        // Native ETH — covers gas for Smart Account user operations
        type: "native-token-transfer",
        data: {
          allowance: toHex(parseEther("0.01")), // 0.01 ETH max
        },
        required: true,
      },
    ],
  };
}

// ── ERC-7715 wallet RPC request helper ────────────────────────────────────────
// Call this from the client to trigger MetaMask's permission prompt.
// Returns the permission context (delegation) to store in Neo4j.

export async function requestErc7715Permissions(
  walletProvider: { request: (args: { method: string; params: unknown[] }) => Promise<unknown> },
  request: PermissionRequest
): Promise<{ permissionContext: Hex; grantedAt: number } | null> {
  try {
    const result = (await walletProvider.request({
      method: "wallet_grantPermissions",
      params: [request],
    })) as Array<{ permissionsContext: Hex }> | null;

    if (!result || result.length === 0) return null;

    return {
      permissionContext: result[0].permissionsContext,
      grantedAt: Math.floor(Date.now() / 1000),
    };
  } catch (err) {
    console.error("[permissions] wallet_grantPermissions failed:", err);
    return null;
  }
}
