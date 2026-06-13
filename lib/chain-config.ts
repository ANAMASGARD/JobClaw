// Chain configuration — client-safe (NEXT_PUBLIC_ env vars only).
// Used by both Web3Auth config and MetaMask/wagmi setup.

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "84532");
export const IS_MAINNET = CHAIN_ID === 8453;

export const CHAIN_HEX_ID = IS_MAINNET ? "0x2105" : "0x14A34"; // 8453 | 84532
export const RPC_URL = IS_MAINNET
  ? "https://mainnet.base.org"
  : "https://sepolia.base.org";
export const BLOCK_EXPLORER_URL = IS_MAINNET
  ? "https://basescan.org"
  : "https://sepolia.basescan.org";
export const CHAIN_DISPLAY_NAME = IS_MAINNET ? "Base" : "Base Sepolia";
