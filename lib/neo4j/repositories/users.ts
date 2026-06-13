// User repository — all Cypher for the User node and related auth nodes.
// Server-only. Every query is scoped to an authenticated user.

import { withSession } from "../client";
import type { Web3AuthTokenPayload } from "@/lib/web3auth/verifyIdToken";

export interface UserNode {
  id: string;
  walletAddress?: string;
  smartAccountAddress?: string;
  web3authSub?: string;
  email?: string;
  name?: string;
  picture?: string;
  authMethod: "web3auth" | "metamask";
  onboardingStep: "resume" | "connect_wallet" | "permissions" | "complete";
  createdAt: number;
  updatedAt: number;
}

// ── Upsert user from Web3Auth idToken payload ─────────────────────────────────

export async function upsertFromWeb3Auth(
  payload: Web3AuthTokenPayload
): Promise<UserNode> {
  return withSession(async (session) => {
    const result = await session.run(
      `
      MERGE (u:User {web3authSub: $web3authSub})
      ON CREATE SET
        u.id            = randomUUID(),
        u.createdAt     = timestamp(),
        u.onboardingStep = 'resume'
      SET
        u.email       = $email,
        u.name        = $name,
        u.picture     = $picture,
        u.authMethod  = 'web3auth',
        u.updatedAt   = timestamp()
      RETURN u
      `,
      {
        web3authSub: payload.sub,
        email: payload.email ?? null,
        name: payload.name ?? null,
        picture: payload.picture ?? null,
      }
    );
    return result.records[0].get("u").properties as UserNode;
  });
}

// ── Upsert user from MetaMask SIWE (direct MetaMask login) ───────────────────

export async function upsertFromMetaMask(
  walletAddress: string
): Promise<UserNode> {
  return withSession(async (session) => {
    const result = await session.run(
      `
      MERGE (u:User {walletAddress: $walletAddress})
      ON CREATE SET
        u.id            = randomUUID(),
        u.createdAt     = timestamp(),
        u.onboardingStep = 'resume'
      SET
        u.authMethod  = 'metamask',
        u.updatedAt   = timestamp()
      RETURN u
      `,
      { walletAddress: walletAddress.toLowerCase() }
    );
    return result.records[0].get("u").properties as UserNode;
  });
}

// ── Link a MetaMask wallet to an existing Web3Auth user ───────────────────────

export async function linkWalletToUser(params: {
  userId: string;
  walletAddress: string;
  smartAccountAddress?: string;
}): Promise<void> {
  await withSession(async (session) => {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      SET
        u.walletAddress         = $walletAddress,
        u.smartAccountAddress   = $smartAccountAddress,
        u.onboardingStep        = 'permissions',
        u.updatedAt             = timestamp()
      `,
      {
        userId: params.userId,
        walletAddress: params.walletAddress.toLowerCase(),
        smartAccountAddress: params.smartAccountAddress ?? null,
      }
    );
  });
}

// ── Store ERC-7715 delegation ─────────────────────────────────────────────────

export async function storeDelegation(params: {
  userId: string;
  permissionContext: string;
  smartAccountAddress: string;
  grantedAt: number;
  expiresAt: number;
}): Promise<void> {
  await withSession(async (session) => {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (d:Delegation {
        id:                   randomUUID(),
        erc7715Permission:    $permissionContext,
        smartAccountAddress:  $smartAccountAddress,
        status:               'active',
        grantedAt:            $grantedAt,
        expiresAt:            $expiresAt,
        createdAt:            timestamp()
      })
      CREATE (u)-[:HAS_DELEGATION]->(d)
      SET u.onboardingStep = 'complete', u.updatedAt = timestamp()
      `,
      params
    );
  });
}

// ── Get user by session userId ────────────────────────────────────────────────

export async function getUserById(userId: string): Promise<UserNode | null> {
  return withSession(async (session) => {
    const result = await session.run(
      `MATCH (u:User {id: $userId}) RETURN u`,
      { userId }
    );
    if (result.records.length === 0) return null;
    return result.records[0].get("u").properties as UserNode;
  });
}

// ── Check if user has an active delegation ────────────────────────────────────

export async function getActiveDelegation(
  userId: string
): Promise<{ permissionContext: string; expiresAt: number } | null> {
  return withSession(async (session) => {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_DELEGATION]->(d:Delegation)
      WHERE d.status = 'active' AND d.expiresAt > timestamp() / 1000
      RETURN d
      ORDER BY d.grantedAt DESC
      LIMIT 1
      `,
      { userId }
    );
    if (result.records.length === 0) return null;
    const d = result.records[0].get("d").properties;
    return {
      permissionContext: d.erc7715Permission as string,
      expiresAt: d.expiresAt as number,
    };
  });
}
