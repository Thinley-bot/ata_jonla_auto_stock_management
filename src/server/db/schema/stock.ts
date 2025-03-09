import { randomUUID } from "crypto";
import { createTable } from "../schema";
import { varchar, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { part_catalogue } from "./part_catalogue";
import { supplier } from "./supplier";
import { InferInsertModel, relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";
import { number } from "zod";

export const stock = createTable("stock", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  quantity: integer("quantity").notNull().default(0),
  total_cost: numeric("total_cost", { precision: 10, scale: 2 }).notNull().$type<number>(),
  part_id: varchar("part_id", { length: 255 }).notNull().references(() => part_catalogue.id),
  supplier_id: varchar("supplier_id", { length: 255 }).notNull().references(() => supplier.id),
  createdBy: varchar('created_by', { length: 255 }).notNull().references(() => users.id),
  updatedBy: varchar('updated_by', { length: 255 }).references(() => users.id),
  ...timestamps
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
  createdBy: one(users, {
    fields: [stock.createdBy],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [stock.updatedBy],
    references: [users.id],
  }),
}));

export type NewStock = Omit<InferInsertModel<typeof stock>, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">;
