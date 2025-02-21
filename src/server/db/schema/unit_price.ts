import { randomUUID } from "crypto";
import { createTable } from "../schema";
import { date, numeric, varchar } from "drizzle-orm/pg-core";
import { part_catalogue } from "./part_catalogue";
import { relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

export const unit_price = createTable("unit_price",{
    id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
    part_id: varchar("part_id").references(() => part_catalogue.id, { onDelete: "restrict" }),
    unit_price:numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    start_date: date("start_date").notNull(),
    end_date: date("end_date").notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull().references(()=> users.id),
    updatedBy: varchar('updated_by', { length: 255 }).references(()=> users.id),
    ...timestamps,
});

export const unitPriceRelations = relations(unit_price, ({ one }) => ({
    part: one(part_catalogue, {
      fields: [unit_price.part_id],
      references: [part_catalogue.id],
    }),
    createdBy: one(users, {
      fields: [unit_price.createdBy],
      references: [users.id], 
    }),
  updatedBy: one(users, {
      fields: [unit_price.updatedBy],
      references: [users.id], 
    }),
  }));
  