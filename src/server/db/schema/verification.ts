import { text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { timestamps } from "./columns/timestamp.helper";

export const verification = createTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    ...timestamps
});
