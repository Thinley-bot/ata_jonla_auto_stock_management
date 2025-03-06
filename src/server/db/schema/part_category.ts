import { varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { randomUUID } from "crypto";
import { InferInsertModel, relations } from "drizzle-orm";
import { part_catalogue } from "./part_catalogue";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";


export const part_category = createTable("part_category", {
    //ex. brake, tyre, engineoil
    id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
    category_name: varchar("category_name", { length: 255 }).notNull(),
    category_desc: varchar("category_desc", { length: 255 }).notNull(),
    unit: varchar("unit", { length: 255 }).notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull().references(() => users.id),
    updatedBy: varchar('updated_by', { length: 255 }).references(() => users.id),
    ...timestamps,
})

export const part_category_relations = relations(part_category, ({ many,one }) => ({
    part_catalogues: many(part_catalogue),
    createdBy: one(users, {
        fields: [part_category.createdBy],
        references: [users.id],
    }),
    updatedBy: one(users, {
        fields: [part_category.updatedBy],
        references: [users.id],
    }),
}))

export type NewParCategory = InferInsertModel<typeof part_category>;