import { boolean, serial, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { users } from "./users";
import { timestamps } from "./columns/timestamp.helper";
import { relations } from "drizzle-orm";
import { estimateItems } from "./estimate_items";

export const services = createTable("Services", {
      id: serial('id').primaryKey(),
      name: varchar('name',{length: 255}).notNull(),
      description :  varchar('description', {length: 255}),
      isActive : boolean('is_active').default(true).notNull(),
      createdBy : varchar("created_by", {length: 255}).references(()=>users.id),
      updatedBy :  varchar("updated_by", {length : 255}).references(()=>users.id),
      ...timestamps
})

export const serviceRelations = relations(services, ({many}) => ({
    estimateItems : many(estimateItems)
}))