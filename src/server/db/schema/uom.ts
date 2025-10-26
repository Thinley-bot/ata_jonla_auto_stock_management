import { createTable } from "../schema";
import { serial, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns/timestamp.helper";
import { relations } from "drizzle-orm";
import { part_catalogue } from "./part_catalogue";

export const uom = createTable("uom",{
    id: serial('id').notNull().primaryKey(),
    code: varchar("code", { length: 50 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    updatedBy: varchar('updated_by', { length: 255 }),
    ...timestamps,
});               

export const uomRelations = relations(uom, ({many}) => ({
    part_catalogues : many(part_catalogue),
}));
