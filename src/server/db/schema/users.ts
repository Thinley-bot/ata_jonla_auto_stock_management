import { relations} from "drizzle-orm";
import { createTable } from "../schema";
import { boolean, text, varchar } from "drizzle-orm/pg-core";
import { user_role } from "./user_role";
import { randomUUID } from "crypto";
import { accounts } from "./account";
import { sessions } from "./session";
import { timestamps } from "./columns/timestamp.helper";
import { car_brand } from "./car_brand";
import { part_catalogue } from "./part_catalogue";
import { part_category } from "./part_category";
import { stock_sale_detail } from "./sale_detail";
import { stock_sale } from "./sale";
import { stock } from "./stock";
import { supplier } from "./supplier";
import { unit_price } from "./unit_price";

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 255 }),
  email : varchar('email').notNull(),
  emailVerified : boolean("email_verified"),
  image: text('image'),
  role_id: varchar("roleId").references(() => user_role.id,{ onDelete: "set null", onUpdate: "set null" }).$default(()=>"1"),
  ...timestamps,
});

export const usersRelations = relations(users, ({ one,many }) => ({
  role: one(user_role, {
    fields: [users.role_id],
    references: [user_role.id],
  }),
  account : many(accounts),
  session: many(sessions),
  carBrands: many(car_brand),
  part_catalogue: many(part_catalogue),
  part_category:many(part_category),
  stock_sale_detail:many(stock_sale_detail),
  stock_sale:many(stock_sale),
  stock :many(stock),
  supplier : many(supplier),
  unit_price : many(unit_price),
}));
