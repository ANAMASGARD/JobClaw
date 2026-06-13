// POST /api/auth/verify
// Two use-cases handled by this single route:
//   1. MetaMask direct login (no Web3Auth session) — creates a new User node.
//   2. Web3Auth upgrade — links a MetaMask wallet to an existing session user.
//
// In both cases: verifies the SIWE signature, then writes to Neo4j.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySiweSignature } from "@/lib/metamask/siwe";
import {
  upsertFromMetaMask,
  linkWalletToUser,
} from "@/lib/neo4j/repositories/users";
import {
  getSession,
  createSessionToken,
  makeSessionCookie,
} from "@/lib/auth/session";

const bodySchema = z.object({
  message: z.string().min(1),
  signature: z.string().regex(/^0x[0-9a-fA-F]+$/),
  nonce: z.string().min(1),
  smartAccountAddress: z.string().optional(),
});

// In production, nonces should be stored in a short-lived store (Redis / Neo4j).
// For the hackathon, we accept any nonce that is present in the signed message.
// TODO: replace with a proper nonce store before production use.
const NONCE_TTL_MS = 5 * 60 * 1000; // 5 min
const usedNonces = new Map<string, number>();

function consumeNonce(nonce: string): boolean {
  const now = Date.now();
  // Clean up expired nonces
  for (const [n, t] of usedNonces) {
    if (now - t > NONCE_TTL_MS) usedNonces.delete(n);
  }
  if (usedNonces.has(nonce)) return false; // replay
  usedNonces.set(nonce, now);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, signature, nonce, smartAccountAddress } =
      bodySchema.parse(body);

    if (!consumeNonce(nonce)) {
      return NextResponse.json(
        { success: false, error: "Nonce already used or expired" },
        { status: 400 }
      );
    }

    const { valid, address } = await verifySiweSignature({
      message,
      signature: signature as `0x${string}`,
      expectedNonce: nonce,
    });

    if (!valid || !address) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Check for existing Web3Auth session (upgrade path)
    const existingSession = await getSession();

    let userId: string;

    if (existingSession?.userId && existingSession.authMethod === "web3auth") {
      // Upgrade: link the MetaMask wallet to the existing Web3Auth user
      await linkWalletToUser({
        userId: existingSession.userId,
        walletAddress: address,
        smartAccountAddress,
      });
      userId = existingSession.userId;
    } else {
      // Direct MetaMask login: create or get User node by wallet address
      const user = await upsertFromMetaMask(address);
      userId = user.id;
    }

    const token = await createSessionToken({
      userId,
      authMethod: "metamask",
      walletAddress: address,
      smartAccountAddress,
    });

    const response = NextResponse.json({ success: true, userId });
    const cookie = makeSessionCookie(token);
    response.cookies.set(cookie);
    return response;
  } catch (err) {
    console.error("[api/auth/verify]", err);
    const message =
      err instanceof z.ZodError ? "Invalid request body" : "Verification failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: err instanceof z.ZodError ? 400 : 401 }
    );
  }
}
