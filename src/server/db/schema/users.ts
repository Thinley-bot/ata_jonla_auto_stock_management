import { relations} from "drizzle-orm";
import { createTable } from "../schema";
import { boolean, text, varchar } from "drizzle-orm/pg-core";
import { user_role } from "./user_role";
import { randomUUID } from "crypto";
import { accounts } from "./account";
import { sessions } from "./session";
import { creator_updater } from "./columns/create_update.helper";
import { timestamps } from "./columns/timestamp.helper";

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 255 }),
  username: text('username').unique(),
  password : varchar('password'),
  email : varchar('email').notNull(),
  emailVerified : boolean("email_verified"),
  image: text('image'),
  role_id: varchar("roleId", { length: 255 }).notNull().references(() => user_role.id, { onDelete: "set null", onUpdate: "set null" }).$default(()=>"1"),
  ...timestamps,
  ...creator_updater
});

export const usersRelations = relations(users, ({ one,many }) => ({
  role: one(user_role, {
    fields: [users.role_id],
    references: [user_role.id],
  }),
  account : many(accounts),
  session: many(sessions),
}));
