import { randomUUID } from "crypto";
import { createTable } from "../schema";
import { varchar,numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stock_sale_detail } from "./sale_detail";
import { timestamps } from "./columns/timestamp.helper";
import { creator_updater } from "./columns/create_update.helper";

export const stock_sale = createTable("stock_sale", {
    id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
    payment_mode:varchar("payment_mode",{length:50}),
    total_sale:numeric("total_sale",{ precision: 10, scale: 2 }).notNull(),
    ...timestamps,
    ...creator_updater
});

export const stock_sale_relations = relations(stock_sale, ({ many }) => ({
    stock_sale_detail: many(stock_sale_detail)
  }));
