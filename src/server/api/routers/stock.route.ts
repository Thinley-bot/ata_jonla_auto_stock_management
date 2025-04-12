import { z } from "zod";
import { handleError } from "~/server/helper/global_error"; 
import { createStockImpl, getStockImpl, getStocksImpl, updateStockImpl, deleteStockImpl, getPaginatedStocksImpl } from "../queries/stock.queries";
import { createTRPCRouter } from "../trpc";
import { managerProcedure } from "~/middleware/user_role_auth";

export const stockRouter = createTRPCRouter({
    getStocks: managerProcedure.query(async () => await getStocksImpl()),

    getPaginatedStocks: managerProcedure
        .input(z.object({
            pageSize: z.number().min(1).max(100),
            pageIndex: z.number().min(0),
            sorting: z.array(z.object({
                id: z.string(),
                desc: z.boolean()
            })).optional(),
            filters: z.array(z.object({
                id: z.string(),
                value: z.string()
            })).optional()
        }))
        .query(async ({ input }) => {
            try {
                const result = await getPaginatedStocksImpl(input);
                return {
                    success: true,
                    data: result.data,
                    pageCount: result.pageCount,
                    message: "Stocks retrieved successfully"
                };
            } catch (error) {
                return handleError(error, "Failed to retrieve stocks");
            }
        }),

    getStock: managerProcedure.input(z.string()).query(async ({ input }) => {
        try {
            const stockItem = await getStockImpl(input);
            if (!stockItem || stockItem.length === 0) {
                return { success: false, message: "Stock not found" };
            }
            return {success: true,data: stockItem,message: "Stock retrieved successfully"};
        } catch (error) {
            return handleError(error, "Failed to retrieve stock");
        }
    }),

    createStock: managerProcedure.input(z.object({
        newStock: z.object({
            quantity: z.number().min(0, { message: "Quantity cannot be less than 0" }),
            total_cost: z.number().min(0, { message: "Total cost cannot be less than 0" }),
            part_id: z.string(),
            supplier_id: z.string()
        }),
    })
    ).mutation(async ({ input, ctx }) => {
            if (!ctx.user?.id) return { success: false, message: "Not Authorized" };

            try {
                const newStock = await createStockImpl(ctx.user.id, input.newStock);
                return {success: true,data: newStock, message: "Stock successfully created",
                };
            } catch (error) {
                return handleError(error, "Failed to create stock");
            }
        }),

    updateStock: managerProcedure.input(
            z.object({
                stockId: z.string(),
                updates: z.object({
                    quantity: z.number().min(0, { message: "Quantity cannot be less than 0" }).optional(),
                    total_cost: z.number().min(0, { message: "Total cost cannot be less than 0" }).optional(),
                    part_id: z.string().optional(),
                    supplier_id: z.string().optional()
                })
            })
        )
        .mutation(async ({ input, ctx }) => {
            if (!ctx.user?.id) return { success: false, message: "Not Authorized" };

            const { stockId, updates } = input;
            try {
                const existingStock = await getStockImpl(stockId);
                if (!existingStock || existingStock.length === 0) {
                    return { success: false, message: "Stock not found" };
                }
                await updateStockImpl(ctx.user.id, stockId, updates);
                return { success: true, message: "Stock successfully updated", };
            } catch (error) {
                return handleError(error, "Failed to update stock");
            }
        }),

    deleteStock: managerProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            try {
                const existingStock = await getStockImpl(input.id);
                if (!existingStock || existingStock.length === 0) {
                    return { success: false, message: "Stock not found" };
                }
                await deleteStockImpl(input.id);
                return { success: true, message: "Stock successfully deleted" };
            } catch (error) {
                return handleError(error, "Failed to delete stock");
            }
        }),
});
