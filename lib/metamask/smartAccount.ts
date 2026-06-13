// Smart Account creation and ERC-7715 delegation via MetaMask Smart Accounts Kit.
// Called from /onboarding/permissions (client component).
// Stores Delegation + OnchainLog nodes in Neo4j via /api/auth/verify.

import {
  toMetaMaskSmartAccount,
  Implementation,
  type MetaMaskSmartAccount,
  getSmartAccountsEnvironment,
} from "@metamask/smart-accounts-kit";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Address,
  type Hex,
} from "viem";
import { baseSepolia, base } from "viem/chains";
import { IS_MAINNET, RPC_URL, CHAIN_ID } from "@/lib/chain-config";
import { buildAgentPermissionRequest, requestErc7715Permissions } from "./permissions";

const chain = IS_MAINNET ? base : baseSepolia;

// ── Smart Account creation ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SmartAccountResult = {
  smartAccount: MetaMaskSmartAccount<Implementation>;
  smartAccountAddress: Address;
  environment: ReturnType<typeof getSmartAccountsEnvironment>;
};

export async function createMetaMaskSmartAccount(
  ownerAddress: Address,
  ethereumProvider: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }
): Promise<SmartAccountResult> {
  const publicClient = createPublicClient({
    chain,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account: ownerAddress,
    chain,
    transport: custom(ethereumProvider),
  });

  // HybridDeleGator: [owner, keyIds[], xValues[], yValues[]]
  // For a plain EOA signer, keyIds/xValues/yValues are empty (no passkey).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    client: publicClient,
    implementation: Implementation.Hybrid,
    // HybridDeleGatorDeployParams: [owner, keyIds[], xValues[], yValues[]]
    // Empty arrays = plain EOA signer (no passkey).
    deployParams: [ownerAddress as Hex, [] as string[], [] as bigint[], [] as bigint[]],
    signer: { walletClient },
  };
  const smartAccount = await toMetaMaskSmartAccount(params);

  // getSmartAccountsEnvironment takes the numeric chainId
  const environment = getSmartAccountsEnvironment(CHAIN_ID);

  return {
    smartAccount,
    smartAccountAddress: smartAccount.address,
    environment,
  };
}

// ── ERC-7715 Advanced Permissions ─────────────────────────────────────────────

export interface DelegationResult {
  permissionContext: Hex;
  smartAccountAddress: Address;
  grantedAt: number;
  expiresAt: number;
}

export async function requestAgentPermissions(
  ethereumProvider: { request: (args: { method: string; params: unknown[] }) => Promise<unknown> },
  smartAccountAddress: Address
): Promise<DelegationResult | null> {
  const request = buildAgentPermissionRequest();
  const result = await requestErc7715Permissions(ethereumProvider, request);
  if (!result) return null;

  return {
    permissionContext: result.permissionContext,
    smartAccountAddress,
    grantedAt: result.grantedAt,
    expiresAt: request.expiry,
  };
}
