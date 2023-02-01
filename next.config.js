/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.slack-edge.com",
      },
    ],
  },
};

module.exports = nextConfig;
