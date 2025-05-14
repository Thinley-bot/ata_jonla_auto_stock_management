import { db } from "~/server/db";
import { eq, like } from "drizzle-orm";
import { car_brand } from "~/server/db/schema/car_brand";
 
export const getCarBrandById = async (id: string) =>  
    await db.select().from(car_brand).where(eq(car_brand.id, id));

export const getCarBrands = async (search?: string) => {
    const query = db.select().from(car_brand);
    if (search) {
        return await query.where(like(car_brand.brand_name, `%${search}%`));
    }
    return await query;
};

export const createCarBrand = async (userId: string, data: { name: string; description: string }) => {
    return await db.insert(car_brand).values({
        brand_name: data.name,
        brand_desc: data.description,
        createdBy: userId,
        updatedBy: userId,
    }).returning();
};

export const deleteCarBrand = async(carBrandId: string) => {
    try {
        await db.delete(car_brand).where(eq(car_brand.id, carBrandId)).returning()
    }
    catch(error){
      return error
    }
}
