import { createTable } from "../schema";
import { serial, varchar, integer, decimal, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { customers } from "./customers";
import { estimated } from "./estimates";
import { timestamps } from "./columns/timestamp.helper";
import { relations } from "drizzle-orm";
import { billItems } from "./bill_items";

export const bills = createTable("bills", {
    id: serial("id").primaryKey(),
    billNumber: varchar("bill_number", { length: 50 }).unique(),
    estimateId: integer("estimate_id").references(() => estimated.id),
    customerId: integer("customer_id").notNull().references(() => customers.id),
    status: varchar("status", { length: 20 }).default("pending").$default(() => "pending"),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0"),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).default("0"),
    paymentMethod: varchar("payment_method", { length: 50 }),
    notes: text("notes"),
    createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
    updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
    ...timestamps
});

export const billsRelation = relations(bills,({one, many}) => (
    {
        billItems : many(billItems),
        estimated : one(estimated),
        customers : many(customers),
    }
))
