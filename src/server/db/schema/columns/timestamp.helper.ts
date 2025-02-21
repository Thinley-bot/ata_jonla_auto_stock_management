import { varchar } from "drizzle-orm/mysql-core";
import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").$onUpdate(()=>new Date),
  }
