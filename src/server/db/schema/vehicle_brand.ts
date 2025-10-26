import { varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { randomUUID } from "crypto";
import { InferInsertModel, relations } from "drizzle-orm";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";
import { part_catalogue } from "./part_catalogue";

export const vehicle_brand = createTable("vehicle_brand",{
    id:varchar("id",{length:255}).notNull().primaryKey().$defaultFn(()=>randomUUID()),
    brand_name: varchar("brand_name",{length:255}).notNull(),
    brand_desc : varchar("brand_desc",{length:255}).notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull().references(()=> users.id),
    updatedBy: varchar('updated_by', { length: 255 }).references(()=> users.id),
    ...timestamps,    
})

export const vehicle_brand_relations = relations(vehicle_brand,({many,one}) => ({
    part_catalogue : many(part_catalogue),
    createdBy: one(users, {
        fields: [vehicle_brand.createdBy],
        references: [users.id], 
      }),
    updatedBy: one(users, {
        fields: [vehicle_brand.updatedBy],
        references: [users.id], 
      }),
}))

export type vehicleBrand = Omit<InferInsertModel<typeof vehicle_brand>, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">
