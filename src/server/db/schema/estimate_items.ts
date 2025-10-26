import { integer, pgEnum, serial, text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { estimated } from "./estimates";
import { relations } from "drizzle-orm";
import { services } from "./services";
import { part_catalogue } from "./part_catalogue";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

const itemTypeEnum = pgEnum("ITEMTYPE", ["Service", "Parts"])

export const estimateItems = createTable("estimate_items", {
    id: serial("id").notNull().primaryKey(),
    estimateId: integer("estimate_id").notNull().references(() => estimated.id),
    itemType: itemTypeEnum("ITEMTYPE").notNull(),
    serviceId: integer("service_id").references(() => services.id),
    partsId: integer("parts_id").references(() => part_catalogue.id),
    quantity: integer("quantity").notNull().$type<Number>(),
    createdBy: varchar('created_by', { length: 255 }).notNull().references(() => users.id),
    updatedBy: varchar('updated_by', { length: 255 }).references(() => users.id),
    ...timestamps,
})

export const estimateItemsRelation = relations(estimateItems, ({ one }) => ({
    estimated: one(estimated, {
        fields: [estimateItems.estimateId],
        references: [estimated.id]
    })
}))