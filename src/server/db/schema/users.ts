import { relations} from "drizzle-orm";
import { createTable } from "./schema";
import { timestamp, varchar } from "drizzle-orm/pg-core";
import { user_role } from "./user_role";
import { randomUUID } from "crypto";

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 255 }),
  role_id: varchar("roleId", { length: 255 }).notNull().references(() => user_role.id, { onDelete: "set null", onUpdate: "set null" }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(()=>new Date)
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(user_role, {
    fields: [users.role_id],
    references: [user_role.id],
  }),
}));
