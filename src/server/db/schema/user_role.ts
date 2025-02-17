import { varchar, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "./schema";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { randomUUID } from "crypto"; 

export const user_role = createTable("user_role", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  role_name: varchar("role_name", { length: 255 }).notNull(),
  role_description: varchar("role_description", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(()=>new Date)
});

export const userRoleRelations = relations(user_role,({ many }) => ({
  users: many(users),
}));
