import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que `next dev` genere AGENTS.md; las instrucciones viven en CLAUDE.md.
  agentRules: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
