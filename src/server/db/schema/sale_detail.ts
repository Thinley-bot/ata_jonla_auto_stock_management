import { randomUUID } from "crypto";
import { createTable } from "../schema";
import { varchar,integer, numeric } from "drizzle-orm/pg-core";
import { stock_sale } from "./sale";
import { part_catalogue } from "./part_catalogue";
import { relations } from "drizzle-orm";
import { creator_updater } from "./columns/create_update.helper";
import { timestamps } from "./columns/timestamp.helper";

export const stock_sale_detail = createTable("stock_sale_detail", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  sale_id: varchar("sale_id").references(() => stock_sale.id, { onDelete: "no action", onUpdate: "no action" }),
  part_id: varchar("part_id").references(() => part_catalogue.id, { onDelete: "no action", onUpdate: "no action" }),
  quantity: integer("quantity").notNull(),
  sub_total: numeric("sub_total", { precision: 10, scale: 2 }).notNull(),
  ...timestamps,
  ...creator_updater
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
}));
