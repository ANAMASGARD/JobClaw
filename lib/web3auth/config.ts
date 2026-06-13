// Web3Auth v11 configuration — client-safe (NEXT_PUBLIC_ values only).
// Used by providers/Web3Provider.tsx.

import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES } from "@web3auth/base";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";
import {
  CHAIN_HEX_ID,
  RPC_URL,
  BLOCK_EXPLORER_URL,
  CHAIN_DISPLAY_NAME,
} from "@/lib/chain-config";

export const WEB3AUTH_CLIENT_ID =
  process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? "";

const networkEnv = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK;
export const WEB3AUTH_NETWORK_VALUE =
  networkEnv === "sapphire_mainnet"
    ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
    : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;

// Web3Auth v11 uses a `chains` array instead of the legacy `chainConfig`.
export const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: WEB3AUTH_CLIENT_ID,
    web3AuthNetwork: WEB3AUTH_NETWORK_VALUE,
    chains: [
      {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: CHAIN_HEX_ID,
        rpcTarget: RPC_URL,
        displayName: CHAIN_DISPLAY_NAME,
        blockExplorerUrl: BLOCK_EXPLORER_URL,
        ticker: "ETH",
        tickerName: "Ethereum",
        logo: "https://images.toruswallet.io/eth.svg",
      },
    ],
    defaultChainId: CHAIN_HEX_ID,
    enableLogging: process.env.NODE_ENV === "development",
  },
};
