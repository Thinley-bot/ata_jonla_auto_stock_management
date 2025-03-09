import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { NewSale, stock_sale } from "~/server/db/schema/sale";

export const getStockSalesImpl = async () =>
    await db.select().from(stock_sale);

export const getStockSaleImpl = async (id: string) =>
    await db.select().from(stock_sale).where(eq(stock_sale.id, id));

export const createStockSaleImpl = async (userId: string, newStockSale: NewSale) => {
    const result = await db.insert(stock_sale).values({ ...newStockSale, createdBy: userId, }).returning();
    return result[0];
};

export const updateStockSaleImpl = async (saleId: string, userId: string, updateSale: Partial<NewSale>) => {
    const result = await db.update(stock_sale).set({ ...updateSale, updatedBy: userId }).where(eq(stock_sale.id, saleId)).returning();
    return result[0];
};

export const deleteStockSaleImpl = async (id: string) => {
    await db.delete(stock_sale).where(eq(stock_sale.id, id));
};
