import { decimal, integer, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../schema";
import { vehicles } from "./vehicle";
import { relations } from "drizzle-orm";
import { customers } from "./customers";
import { timestamps } from "./columns/timestamp.helper";
import { users } from "./users";

export const estimated = createTable("estimates", {
    id: serial('id').primaryKey(),
    customerId: integer('customer_id').references(() => customers.id).notNull(),
    vehicleId: integer('vehicle_id').references(() => vehicles.id).notNull(),
    estimateNo: varchar('estimate_no', { length: 20 }).notNull().unique(),
    date: timestamp('date').notNull().defaultNow(),
     // 'draft', 'sent', 'accepted', 'rejected'
    status: text('status').default('draft').notNull(),
   
    notes: text('notes'),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    createBy: integer('created_by').notNull().references(() => users.id),
    updatedBy: integer('updated_by').notNull().references(() => users.id),
    ...timestamps
});

export const estimatedRelations = relations(estimated,({one}) => ({
    customer: one(customers,{
        fields : [estimated.id],
        references : [customers.id]
    }),
    vehicle: one(vehicles,{
        fields: [estimated.vehicleId],
        references: [vehicles.id]
    }),
    createBy: one(users,{
        fields: [estimated.createBy],
        references: [users.id]
    }),
    updatedBy: one(users,{
        fields: [estimated.updatedBy],
        references: [users.id]
    })
}));    