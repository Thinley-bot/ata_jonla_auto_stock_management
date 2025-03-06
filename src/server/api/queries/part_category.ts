import { db } from "~/server/db";
import { part_category } from "../../db/schema/part_category";
import { eq } from "drizzle-orm";

export const getPartCategories = async() => await db.select().from(part_category)

export const getPartCategory =  async(categoryId:string) => await db.select().from(part_category).where(eq(part_category.id,categoryId))