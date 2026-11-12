import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que `next dev` genere AGENTS.md; las instrucciones viven en CLAUDE.md.
  agentRules: false,
};

export default nextConfig;
