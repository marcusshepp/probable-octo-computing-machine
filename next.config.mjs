/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/a/<APP_ID>/*",
      },
    ],
  },
};

export default nextConfig;
