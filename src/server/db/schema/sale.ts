    import { randomUUID } from "crypto";
    import { createTable } from "../schema";
    import { varchar, numeric } from "drizzle-orm/pg-core";
    import { relations } from "drizzle-orm";
    import { stock_sale_detail } from "./sale_detail";
    import { timestamps } from "./columns/timestamp.helper";
    import { users } from "./users";

    export const stock_sale = createTable("stock_sale", {
        id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
        payment_mode: varchar("payment_mode", { length: 50 }),
        total_sale: numeric("total_sale", { precision: 10, scale: 2 }).notNull(),
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
