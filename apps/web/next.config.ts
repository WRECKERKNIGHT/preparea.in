import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `@libsql/client` ships a native binding; it must stay outside the server
  // bundle or the Turso/LibSQL store fails to resolve its platform module.
  serverExternalPackages: ["@libsql/client", "libsql", "googleapis"],
};

export default nextConfig;
