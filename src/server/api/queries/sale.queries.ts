import { db } from "~/server/db";
import { eq, gt, ilike } from "drizzle-orm";
import { NewSale, stock_sale } from "~/server/db/schema/sale";
import generateInvoiceNumber from "~/server/helper/invoice_number";


export const getStockSalesImpl = async ({limit,cursor, direction,search}:{limit:number, cursor:string, direction:string, search: string}) =>{ 
    const baseQuery =  await db.query.stock_sale.findMany({
    where: (stock_sale,{and, ilike, lt}) => {
        const conditions = []
        if(cursor) {
            conditions.push(
                direction === "next" ? gt(stock_sale.id,cursor) : lt(stock_sale.id,cursor)
            )
        }
        if(search) {
            conditions.push(
                ilike(stock_sale.id,search)
            )
        }
        return and(...conditions)
    }, 
    limit: limit+1
});

}

export const getStockSaleImpl = async (id: string) => await db.select().from(stock_sale).where(eq(stock_sale.id, id));

export const createStockSaleImpl = async (userId: string, newStockSale: NewSale) => {
    const invoice_number = generateInvoiceNumber()
    const result = await db.insert(stock_sale).values({ ...newStockSale, createdBy: userId, invoice_number: invoice_number }).returning();
    return result[0];
};

export const updateStockSaleImpl = async (saleId: string, userId: string, updateSale: Partial<NewSale>) => {
    const result = await db.update(stock_sale).set({ ...updateSale, updatedBy: userId }).where(eq(stock_sale.id, saleId)).returning();
    return result[0];
};

export const deleteStockSaleImpl = async (id: string) => {
    await db.delete(stock_sale).where(eq(stock_sale.id, id));
};
