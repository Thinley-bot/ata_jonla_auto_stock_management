import { randomUUID } from "crypto";
import { createTable } from "../schema";
import {varchar} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stock } from "./stock";
import { timestamps } from "./columns/timestamp.helper";
import { creator_updater } from "./columns/create_update.helper";

export const supplier =  createTable("supplier",{
    id:varchar("id",{length:255}).notNull().primaryKey().$defaultFn(()=>randomUUID()),
    supplier_name: varchar("supplier_name",{length:255}).notNull(),
    supplier_number: varchar("supplier_number",{length:255}).notNull(),
    ...timestamps,
    ...creator_updater
})

export const supplierRelations = relations(supplier, ({ many }) => ({
    stocks: many(stock)
  }));
