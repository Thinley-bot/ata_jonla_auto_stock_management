import { randomUUID } from "crypto";
import { createTable } from "../schema";
import { numeric, varchar } from "drizzle-orm/pg-core";
import { part_category } from "./part_category";
import { car_brand } from "./car_brand";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

export const part_catalogue = createTable("part_catalogue", {
    id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
    part_name: varchar("part_name", { length: 255 }).notNull(),
    part_number: varchar("part_number", { length: 255 }).notNull(),
    category_id: varchar("category_id").notNull().references(() => part_category.id, { onDelete: "restrict" }),
    brand_id: varchar("brand_id").notNull().references(() => car_brand.id, { onDelete: "restrict" }),
    unit_price: numeric("unit_price",  { precision: 10, scale: 2 }).notNull().$type<Number>(),
    createdBy: varchar('created_by', { length: 255 }).notNull().references(()=> users.id),
    updatedBy: varchar('updated_by', { length: 255 }).references(()=> users.id),
    ...timestamps,
})

export const part_catalogue_relations = relations(part_catalogue, ({ one }) => ({
    part_category: one(part_category, {
        fields: [part_catalogue.category_id],
        references: [part_category.id]
    }),
    car_brand: one(car_brand, {
        fields: [part_catalogue.brand_id],
        references: [car_brand.id],
    }),
    createdBy: one(users, {
        fields: [part_catalogue.createdBy],
        references: [users.id],
    }),
    updatedBy: one(users, {
        fields: [part_catalogue.updatedBy],
        references: [users.id],
    }),
}))

export type PartCatalogue = InferSelectModel<typeof part_catalogue>;
export type NewPartCatalogue = Omit<InferInsertModel<typeof part_catalogue>,"id" | "createdAt" | "updatedAt" | "createdBy">;
