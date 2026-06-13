// POST /api/auth/web3auth
// Receives a Web3Auth idToken from the client after social login,
// verifies it server-side, upserts the Neo4j User node, and sets a
// signed httpOnly session cookie.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyWeb3AuthIdToken } from "@/lib/web3auth/verifyIdToken";
import { upsertFromWeb3Auth } from "@/lib/neo4j/repositories/users";
import { createSessionToken, makeSessionCookie } from "@/lib/auth/session";

const bodySchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = bodySchema.parse(body);

    const payload = await verifyWeb3AuthIdToken(idToken);
    const user = await upsertFromWeb3Auth(payload);

    const token = await createSessionToken({
      userId: user.id,
      authMethod: "web3auth",
    });

    const response = NextResponse.json({ success: true, userId: user.id });
    const cookie = makeSessionCookie(token);
    response.cookies.set(cookie);
    return response;
  } catch (err) {
    console.error("[api/auth/web3auth]", err);
    const message =
      err instanceof z.ZodError ? "Invalid request body" : "Authentication failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: err instanceof z.ZodError ? 400 : 401 }
    );
  }
}
