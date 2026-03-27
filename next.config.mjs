/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    styledJsx: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.mymelova.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "developers.google.com",
      },
       {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    qualities: [75, 90, 95, 100],
  },
  experimental: {
    serverActions: {},
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/login",
        destination: "https://api.mymelova.com/api/auth/login/",
      },
      {
        source: "/api/auth/register",
        destination: "https://api.mymelova.com/api/auth/register/",
      },
      {
        source: "/api/shop/products",
        destination: "https://api.mymelova.com/api/shop/products/",
      },
      {
        source: "/api/:path*",
        destination: "https://api.mymelova.com/api/:path*",
      },
      {
        source: "/media/:path*",
        destination: "https://api.mymelova.com/media/:path*",
      },
    ];
  },
};

export default nextConfig;
