import { db } from "~/server/db";
import { NewUnitPrice, unit_price } from "../../db/schema/unit_price";
import { eq } from "drizzle-orm";

export const getUnitPrices = async () => 
    await db.select().from(unit_price);

export const getUnitPrice = async (unitPriceId:string) => 
    await db.select().from(unit_price).where(eq(unit_price.id,unitPriceId));

export const createUnitPrice = async(userId:string, unitPrice : Omit<NewUnitPrice,"id">) => 
    await db.insert(unit_price).values({...unitPrice, createdBy:userId});

export const updateUnitPrice = async(userId:string, updatedUnitPrice: Partial<NewUnitPrice>) =>
    await db.update(unit_price).set({...updateUnitPrice, updatedBy:userId});

export const deleteUnitPrice = async(unitPriceId : string) => 
    await db.delete(unit_price).where(eq(unit_price.id,unitPriceId));
