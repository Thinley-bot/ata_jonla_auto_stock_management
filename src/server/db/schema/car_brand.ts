import { timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./schema";
import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";

export const car_brand = createTable("car_brand",{
    id:varchar("id",{length:255}).notNull().primaryKey().$defaultFn(()=>randomUUID()),
    brand_name: varchar("brand_name",{length:255}).notNull(),
    brand_desc : varchar("brand_desc",{length:255}).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").$onUpdate(()=>new Date)
})

export const car_brand_relations = relations(car_brand,({many}) => ({
    part_catalogue : many(car_brand)
}))
