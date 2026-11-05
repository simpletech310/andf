import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fjxhsufvxseowczyzydy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "stream.mux.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/videos", destination: "/live", permanent: true },
      { source: "/videos/:id", destination: "/live", permanent: true },
      { source: "/sponsor/submit", destination: "/sponsor#inquire", permanent: true },
      { source: "/checkin/:token", destination: "/events", permanent: false },
      { source: "/programs/drone-experience", destination: "/programs", permanent: true },
      { source: "/programs/drone-experience/apply", destination: "/programs", permanent: true },
      { source: "/partner", destination: "/sponsor", permanent: true },
      { source: "/board", destination: "/leadership#board", permanent: true },
      { source: "/team", destination: "/leadership#team", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
