import { varchar } from "drizzle-orm/mysql-core";
import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(()=>new Date),
  }
