import { pgEnum, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { relations } from "drizzle-orm";
import { randomUUID } from "crypto";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

export const rolesEnum = pgEnum("roles", ["Admin", "Manager", "Employee"]);

export const user_role = createTable("user_role", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  role_name: rolesEnum(),
  role_description: varchar("role_description", { length: 255 }).notNull(),
  ...timestamps,
});

export const userRoleRelations = relations(user_role, ({ one }) => ({
  users: one(users),
}));
