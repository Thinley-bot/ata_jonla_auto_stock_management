import { db } from "~/server/db";
import { NewStock, stock } from "../../db/schema/stock";
import { eq, ilike, and, sql } from "drizzle-orm";
import { part_catalogue } from "../../db/schema/part_catalogue";
import { supplier } from "../../db/schema/supplier";

export const getStocksImpl = async() => 
    await db.select().from(stock);

export const getPaginatedStocksImpl = async({
    pageSize,
    pageIndex,
    sorting,
    filters,
}: {
    pageSize: number;
    pageIndex: number;
    sorting?: { id: string; desc: boolean }[];
    filters?: { id: string; value: string }[];
}) => {
    let query = db
        .select({
            id: stock.id,
            quantity: stock.quantity,
            total_cost: stock.total_cost,
            part_id: stock.part_id,
            supplier_id: stock.supplier_id,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
            createdBy: stock.createdBy,
            updatedBy: stock.updatedBy,
            part_name: part_catalogue.part_name,
            supplier_name: supplier.supplier_name,
        })
        .from(stock)
        .leftJoin(part_catalogue, eq(stock.part_id, part_catalogue.id))
        .leftJoin(supplier, eq(stock.supplier_id, supplier.id));

    // Apply filters
    if (filters) {
        const filterConditions = filters.map((filter) => {
            switch (filter.id) {
                case 'partName':
                    return ilike(part_catalogue.part_name, `%${filter.value}%`);
                case 'supplierName':
                    return ilike(supplier.supplier_name, `%${filter.value}%`);
                default:
                    return undefined;
            }
        }).filter(Boolean);

        if (filterConditions.length > 0) {
            query = query.where(and(...filterConditions));
        }
    }

    // Apply sorting
    if (sorting && sorting.length > 0) {
        const { id, desc } = sorting[0];
        switch (id) {
            case 'partName':
                query = query.orderBy(desc ? sql`${part_catalogue.part_name} DESC` : part_catalogue.part_name);
                break;
            case 'supplierName':
                query = query.orderBy(desc ? sql`${supplier.supplier_name} DESC` : supplier.supplier_name);
                break;
            case 'quantity':
                query = query.orderBy(desc ? sql`${stock.quantity} DESC` : stock.quantity);
                break;
            case 'total_cost':
                query = query.orderBy(desc ? sql`${stock.total_cost} DESC` : stock.total_cost);
                break;
            case 'createdAt':
                query = query.orderBy(desc ? sql`${stock.createdAt} DESC` : stock.createdAt);
                break;
        }
    }

    // Get total count for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(stock);
    const [{ count }] = await countQuery;
    const pageCount = Math.ceil(count / pageSize);

    // Apply pagination
    query = query.limit(pageSize).offset(pageSize * pageIndex);

    const data = await query;

    // Transform data to match the Stock type
    const transformedData = data.map(item => ({
        id: item.id,
        quantity: Number(item.quantity),
        total_cost: Number(item.total_cost),
        part_id: item.part_id,
        supplier_id: item.supplier_id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        part: {
            id: item.part_id,
            part_name: item.part_name || "Unknown",
        },
        supplier: {
            id: item.supplier_id,
            name: item.supplier_name || "Unknown",
        },
    }));

    return {
        data: transformedData,
        pageCount,
    };
};

export const getStockImpl = async(stockId:string)=>
    await db.select().from(stock).where(eq(stock.id,stockId));

export const createStockImpl = async(userId:string, newStock:NewStock) => 
    await db.insert(stock).values({createdBy: userId,...newStock}).returning();

export const updateStockImpl = async (userId: string,stockId: string,updateStock: Partial<NewStock>) =>
    await db.update(stock).set({ updatedBy: userId, ...updateStock }).where(eq(stock.id, stockId));

export const deleteStockImpl = async (id: string) =>
    await db.delete(stock).where(eq(stock.id, id));
