
import { serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { relations } from "drizzle-orm";
import { vehicles } from "./vehicle";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

export const customers = createTable("customers", {
    id: serial('id').primaryKey(),
    fullname: text('name').notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }),
    address: text('address'),
    createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
    updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
    ...timestamps
});

export const customersRelations = relations(customers, ({ many }) => ({
    vehicles: many(vehicles)
}));
