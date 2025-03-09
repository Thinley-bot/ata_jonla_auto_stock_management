import { db } from "~/server/db";
import { NewStock, stock } from "../../db/schema/stock";
import { eq } from "drizzle-orm";

export const getStocksImpl = async() => 
    await db.select().from(stock);

export const getStockImpl = async(stockId:string)=>
    await db.select().from(stock).where(eq(stock.id,stockId));

export const createStockImpl = async(userId:string, newStock:NewStock) => 
    await db.insert(stock).values({createdBy: userId,...newStock}).returning();

export const updateStockImpl = async (userId: string,stockId: string,updateStock: Partial<NewStock>) =>
    await db.update(stock).set({ updatedBy: userId, ...updateStock }).where(eq(stock.id, stockId));