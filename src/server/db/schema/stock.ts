import { randomUUID } from "crypto";
import { createTable } from "./schema";
import { varchar, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { part_catalogue } from "./part_catalogue";
import { supplier } from "./supplier"; 
import { relations } from "drizzle-orm";

export const stock = createTable("stock", {
    id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
    quantity: integer("quantity").notNull().default(0),
    total_cost: numeric("total_cost", { precision: 10, scale: 2 }).notNull(), 
    part_id: varchar("part_id", { length: 255 }).notNull().references(() => part_catalogue.id, { onDelete: "restrict" }),
    supplier_id: varchar("supplier_id", { length: 255 }).notNull().references(() => supplier.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").$onUpdate(()=>new Date)
});

export const stock_relations = relations(stock, ({ one }) => ({
    part: one(part_catalogue, {
      fields: [stock.part_id],
      references: [part_catalogue.id],
    }),
    supplier: one(supplier, {
      fields: [stock.supplier_id],
      references: [supplier.id],
    }),
  }));
