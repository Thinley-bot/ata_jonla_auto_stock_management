import { varchar } from "drizzle-orm/pg-core";

export const creator_updater = {
    updated_by:varchar("update_by").notNull(),
    created_by: varchar("created_by").notNull(),
  }
