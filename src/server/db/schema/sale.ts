import { randomUUID } from "crypto";
import { createTable } from "./schema";
import { varchar,timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stock_sale_detail } from "./sale_detail";

export const stock_sale = createTable("stock_sale", {
    id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
    payment_mode:varchar("payment_mode",{length:50}),
    total_sale:numeric("total_sale",{ precision: 10, scale: 2 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").$onUpdate(()=>new Date)
});

export const stock_sale_relations = relations(stock_sale, ({ many }) => ({
    stock_sale_detail: many(stock_sale_detail)
  }));
