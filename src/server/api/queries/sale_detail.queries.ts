import { db } from "~/server/db";
import { NewStockSaleDetail, stock_sale_detail } from "~/server/db/schema/sale_detail";
import { eq } from "drizzle-orm";

export const getStockSaleDetailsImpl = async () => await db.select().from(stock_sale_detail);

export const getStockSaleDetailImpl = async (id: string) => await db.select().from(stock_sale_detail).where(eq(stock_sale_detail.id, id));

export const newStockSaleDetailImpl = async (userId: string,input:NewStockSaleDetail ) => {
    return await db.insert(stock_sale_detail).values({
        ...input,
        createdBy: userId,
    }).returning();
};

export const updateStockSaleDetailImpl = async (saleId: string, updateSaleDetail:Partial<NewStockSaleDetail>, userId: string) => {
    return await db.update(stock_sale_detail)
        .set({
            ...updateSaleDetail,
            updatedBy: userId,
        })
        .where(eq(stock_sale_detail.id, saleId))
        .returning();
};

export const deleteStockSaleDetailImpl = async (id: string) => {
    return await db.delete(stock_sale_detail)
        .where(eq(stock_sale_detail.id, id))
        .returning();
};
