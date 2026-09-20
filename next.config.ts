import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1024, 1440, 1920],
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/projects.html", destination: "/projects", permanent: true },
      { source: "/knowledge.html", destination: "/knowledge", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/reviews.html", destination: "/reviews", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/projects/:slug.html", destination: "/projects/:slug", permanent: true },
      { source: "/:slug(boq-construction-guide|build-home-nonthaburi|choose-contractor-nonthaburi|concrete-road-cost-guide|concrete-road-guide|construction-contract-guide|construction-process-guide|contractor-nonthaburi|extend-home-nonthaburi|faq|renovation-budget-guide|renovation-nonthaburi|renovation-service-nonthaburi|renovation-structure-check-guide|why-us).html", destination: "/:slug", permanent: true }
    ];
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" }
      ]
    }, {
      source: "/assets/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
    }, {
      source: "/legacy/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }]
    }];
  }
};

export default nextConfig;
