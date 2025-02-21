import { varchar} from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { randomUUID } from "crypto"; 
import { creator_updater } from "./columns/create_update.helper";
import { timestamps } from "./columns/timestamp.helper";

export const user_role = createTable("user_role", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  role_name: varchar("role_name", { length: 255 }).notNull(),
  role_description: varchar("role_description", { length: 255 }).notNull(),
  ...timestamps,
  ...creator_updater
});

export const userRoleRelations = relations(user_role,({ one }) => ({
  users: one(users),
}));
