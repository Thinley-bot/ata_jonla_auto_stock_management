import { randomUUID } from "crypto";
import { createTable } from "../schema";
import { date, numeric, varchar } from "drizzle-orm/pg-core";
import { part_catalogue } from "./part_catalogue";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";
import { creator_updater } from "./columns/create_update.helper";

export const unit_price = createTable("unit_price",{
    id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
    part_id: varchar("part_id").references(() => part_catalogue.id, { onDelete: "restrict" }),
    unit_price:numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    start_date: date("start_date").notNull(),
    end_date: date("end_date").notNull(),
    ...timestamps,
    ...creator_updater
});

export const unitPriceRelations = relations(unit_price, ({ one }) => ({
    part: one(part_catalogue, {
      fields: [unit_price.part_id],
      references: [part_catalogue.id],
    }),
  }));
  