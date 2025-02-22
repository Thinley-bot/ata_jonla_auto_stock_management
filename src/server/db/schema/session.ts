import { text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";

export const sessions = createTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
  }));
  