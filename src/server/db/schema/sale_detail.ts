import { randomUUID } from "crypto";
import { createTable } from "../schema";
import { varchar, integer, numeric } from "drizzle-orm/pg-core";
import { stock_sale } from "./sale";
import { part_catalogue } from "./part_catalogue";
import { InferInsertModel, relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

export const stock_sale_detail = createTable("stock_sale_detail", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  sale_id: varchar("sale_id").references(() => stock_sale.id, { onDelete: "no action", onUpdate: "no action" }),
  part_id: varchar("part_id").references(() => part_catalogue.id, { onDelete: "no action", onUpdate: "no action" }),
  quantity: integer("quantity").notNull().$type<Number>(),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull().$type<Number>(),
  sub_total: numeric("sub_total", { precision: 10, scale: 2 }).notNull().$type<Number>(),
  createdBy: varchar('created_by', { length: 255 }).notNull().references(() => users.id),
  updatedBy: varchar('updated_by', { length: 255 }).references(() => users.id),
  ...timestamps,
});

export const stock_sale_detail_relations = relations(stock_sale_detail, ({ one }) => ({
  stock_sale: one(stock_sale, {
    fields: [stock_sale_detail.sale_id],
    references: [stock_sale.id],
  }),
  part_catalogue: one(part_catalogue, {
    fields: [stock_sale_detail.part_id],
    references: [part_catalogue.id],
  }),
  createdBy: one(users, {
    fields: [stock_sale_detail.createdBy],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [stock_sale_detail.updatedBy],
    references: [users.id],
  }),
}));

export type NewStockSaleDetail = Omit<InferInsertModel<typeof stock_sale_detail>, "id" | "createdAt" | "updatedAt" | "createdBy">;
