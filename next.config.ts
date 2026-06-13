import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is the default in Next.js 16. Setting `turbopack: {}` here lets Turbopack
  // coexist with the webpack config below (used only when `--webpack` flag is passed).
  turbopack: {},

  // Webpack fallbacks for `next build --webpack` and CI environments that opt out of Turbopack.
  // Web3Auth and viem reference Node.js built-ins that must be stubbed in the browser bundle.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
