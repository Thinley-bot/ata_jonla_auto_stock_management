import {varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { part_catalogue } from "./part_catalogue";
import { timestamps } from "./columns/timestamp.helper";
import { creator_updater } from "./columns/create_update.helper";


export const part_category = createTable("part_category",{
    //ex. brake, tyre, engineoil
    id : varchar("id",{length:255}).notNull().primaryKey().$defaultFn(()=>randomUUID()),
    category_name: varchar("category_name",{length:255}).notNull(),
    category_desc : varchar("category_desc",{length:255}).notNull(),
    unit: varchar("unit",{length:255}).notNull(),
    ...timestamps,
    ...creator_updater
})

export const part_category_relations = relations(part_category,({ many }) => ({
    part_catalogues: many(part_catalogue)
}))
