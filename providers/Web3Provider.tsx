"use client";

// Combined Web3 provider — wraps Web3Auth (social login) + wagmi (MetaMask connector).
// Must be "use client". Wraps the entire app in app/layout.tsx.
//
// Auth paths:
//   1. Social login  → Web3AuthProvider handles it; Web3Auth syncs its connector into wagmi.
//   2. MetaMask ext  → wagmi metaMask() connector; used on /onboarding/connect-wallet.
//
// IMPORTANT: Web3Auth must only initialize on the client (not during SSR).
// We use a `mounted` guard so the provider renders only after hydration.

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { createConfig, http } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { web3AuthContextConfig } from "@/lib/web3auth/config";

// Wagmi config: MetaMask extension connector + Base chains.
// Web3Auth's WagmiProvider injects a Web3Auth connector automatically at runtime.
const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [metaMask()],
  ssr: true,
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
    [base.id]: http("https://mainnet.base.org"),
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and the first client render, skip Web3Auth init entirely.
  // Pages that depend on Web3Auth context (login, onboarding, dashboard)
  // are "use client" components and will only mount after hydration.
  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Web3AuthProvider config={web3AuthContextConfig}>
        {/* WagmiProvider from web3auth syncs Web3Auth connection into wagmi */}
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </Web3AuthProvider>
    </QueryClientProvider>
  );
}
