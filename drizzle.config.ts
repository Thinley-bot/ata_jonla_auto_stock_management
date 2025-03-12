import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["auto_parts_stock_management_*"],
} satisfies Config;
