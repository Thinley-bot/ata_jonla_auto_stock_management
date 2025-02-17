import { randomUUID } from "crypto";
import { createTable } from "./schema";
import { timestamp, varchar} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stock } from "./stock";

export const supplier =  createTable("supplier",{
    id:varchar("id",{length:255}).notNull().primaryKey().$defaultFn(()=>randomUUID()),
    supplier_name: varchar("supplier_name",{length:255}).notNull(),
    supplier_number: varchar("supplier_number",{length:255}).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").$onUpdate(()=>new Date)
})

export const supplierRelations = relations(supplier, ({ many }) => ({
    stocks: many(stock)
  }));
