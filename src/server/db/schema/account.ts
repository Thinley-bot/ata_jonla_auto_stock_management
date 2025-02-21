import { text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";
import { creator_updater } from "./columns/create_update.helper";

export const accounts = createTable("account", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    ...timestamps,
});

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
  }));
  