/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "eewehmznnchlhvesshkj.supabase.co",
            port: "", 
            pathname: "/storage/v1/object/public/userimage/**", 
          },
        ],
      },
};

export default config;
