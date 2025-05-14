    import { randomUUID } from "crypto";
    import { createTable } from "../schema";
    import { varchar, numeric } from "drizzle-orm/pg-core";
    import { InferSelectModel, relations } from "drizzle-orm";
    import { stock_sale_detail } from "./sale_detail";
    import { timestamps } from "./columns/timestamp.helper";
    import { users } from "./users";

    export const stock_sale = createTable("stock_sale", {
        id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
        invoice_number: varchar('invoice_number', { length: 50 }).notNull(),
        payment_mode: varchar("payment_mode", { length: 50 }).notNull(),
        journal_number: varchar("journal_number", {length: 50}),
        customer_phone_num: varchar("customer_phone_num", {length:50}).notNull(),
        customer_name: varchar("customer_name", {length:50}),
        customer_cid: varchar("customer_cid" , {length:11}),
        payment_status: varchar("payment_status", { length: 50 }),
        total_discount: numeric("total_discount", { precision: 10, scale: 2 }).notNull().$type<Number>(),
        total_sale: numeric("total_sale", { precision: 10, scale: 2 }).notNull().$type<Number>(),
        createdBy: varchar('created_by', { length: 255 }).notNull().references(() => users.id),
        updatedBy: varchar('updated_by', { length: 255 }).references(() => users.id),
        ...timestamps,
    });

    export const stock_sale_relations = relations(stock_sale, ({ many, one }) => ({
        stock_sale_detail: many(stock_sale_detail),
        createdBy: one(users, {
            fields: [stock_sale.createdBy],
            references: [users.id],
        }),
        updatedBy: one(users, {
            fields: [stock_sale.updatedBy],
            references: [users.id],
        }),
    }));

export type NewSale = Omit<InferSelectModel<typeof stock_sale>, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "invoice_number">;
