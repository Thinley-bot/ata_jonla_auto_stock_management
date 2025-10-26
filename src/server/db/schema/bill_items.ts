import { createTable } from "../schema";
import { serial, integer, text, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { services } from "./services";
import { bills } from "./bill";
import { part_catalogue } from "./part_catalogue";
import { relations } from "drizzle-orm";

export const itemTypeEnum = pgEnum("item_type", ["service", "part"]);

export const billItems = createTable("bill_items", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id")
    .notNull()
    .references(() => bills.id, { onDelete: "cascade" }),
  itemType: itemTypeEnum("item_type").notNull(),
  serviceId: integer("service_id").references(() => services.id),
  partId: integer("part_id").references(() => part_catalogue.id),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billItemsRelations = relations(billItems, ({ one }) => ({
  bill: one(bills, {
    fields: [billItems.billId],
    references: [bills.id],
  }),
  service: one(services, {
    fields: [billItems.serviceId],
    references: [services.id],
  }),
  part: one(part_catalogue, {
    fields: [billItems.partId],
    references: [part_catalogue.id],
  }),
}));
