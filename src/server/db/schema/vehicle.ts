import { integer, serial, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { timestamps } from "./columns/timestamp.helper";
import { vehicle_brand } from "./vehicle_brand";
import { customers } from "./customers";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const vehicles = createTable("vehicles", {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  vehicleNo: varchar('vehicle_no', { length: 20 }).notNull(),
  vehicleBrandId: integer('brand_id').notNull().references(() => vehicle_brand.id),
  createdBy: integer('created_by').notNull().references(() => users.id),
  updatedBy: integer('updated_by').notNull().references(() => users.id),
  ...timestamps,
});

export const vehicleRelations = relations(vehicles, ({ one}) => ({
  customer: one(customers, {
    fields: [vehicles.customerId],
    references: [customers.id],
  }),
  vehicleBrand: one(vehicle_brand, {
    fields: [vehicles.vehicleBrandId], 
    references: [vehicle_brand.id],
  }),
  createdBy: one(users,{
    fields:[vehicles.createdBy],
    references : [users.id]
  }),
  updatedBy : one(users,{
    fields:[vehicles.updatedBy],
    references: [users.id]
  })
}));
