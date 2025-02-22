import { randomUUID } from "crypto";
import { createTable } from "../schema";
import {varchar} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stock } from "./stock";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

export const supplier =  createTable("supplier",{
    id:varchar("id",{length:255}).notNull().primaryKey().$defaultFn(()=>randomUUID()),
    supplier_name: varchar("supplier_name",{length:255}).notNull(),
    supplier_number: varchar("supplier_number",{length:255}).notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull().references(()=> users.id),
    updatedBy: varchar('updated_by', { length: 255 }).references(()=> users.id),
    ...timestamps,
})

export const supplierRelations = relations(supplier, ({ many,one }) => ({
    stocks: many(stock),
    createdBy: one(users, {
        fields: [supplier.createdBy],
        references: [users.id], 
      }),
    updatedBy: one(users, {
        fields: [supplier.updatedBy],
        references: [users.id], 
      }),
  }));
