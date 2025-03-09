import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { car_brand } from "~/server/db/schema/car_brand";
 
export const getCarBrandById = async (id: string) =>  
    await db.select().from(car_brand).where(eq(car_brand.id, id));

export const getCarBrands = async() => 
    await db.select().from(car_brand);
