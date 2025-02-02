/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "statics.solscan.io",
        pathname: "/cdn/imgs/**",
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/coins/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost:3000",
        pathname: "/assets/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        winston: false,
      };
    }
    return config;
  },
};

export default nextConfig;
