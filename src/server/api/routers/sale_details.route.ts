import { createTRPCRouter } from "../trpc";
import { managerProcedure } from "~/middleware/user_role_auth";
import { z } from "zod";
import { handleError } from "~/server/helper/global_error";
import { deleteStockSaleDetailImpl, getStockSaleDetailImpl, getStockSaleDetailsImpl, newStockSaleDetailImpl, updateStockSaleDetailImpl } from "../queries/sale_detail.queries";

export const saleDetailRouter = createTRPCRouter({
    // Get all stock sale details
    getStockSaleDetails: managerProcedure.query(async () => {
        return await getStockSaleDetailsImpl();
    }),

    // Get single stock sale detail by ID
    getStockSaleDetail: managerProcedure
        .input(z.string())
        .query(async ({ input }) => {
            const detail = await getStockSaleDetailImpl(input);
            if (!detail) {
                return { success: false, message: "Stock sale detail not found" };
            }
            return detail;
        }),

    // Create new stock sale detail
    createStockSaleDetail: managerProcedure
        .input(z.object({
            sale_id: z.string().optional(),
            part_id: z.string().optional(),
            quantity: z.number().min(0,{message:"The quantity cannot be zero"}),
            sub_total:  z.number().min(0,{message:"The subtotal cannot be zero."}),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                if (!ctx.user?.id) {
                    return { success: false, message: "Not Authorized" };
                }
                const result = await newStockSaleDetailImpl(ctx.user.id, input);
                return { 
                    success: true, 
                    message: "Stock sale detail successfully created",
                    data: result[0]
                };
            } catch (error) {
                return handleError(error, "Failed to create stock sale detail");
            }
        }),

    // Update existing stock sale detail
    updateStockSaleDetail: managerProcedure
        .input(z.object({
            id: z.string({ message: "Stock sale detail ID is required" }),
            updates: z.object({
                sale_id: z.string().optional(),
                part_id: z.string().optional(),
                quantity: z.number().min(0,{message:"The quantity cannot be zero"}).optional(),
                sub_total: z.number().min(0,{message:"The subtotal cannot be zero."}).optional(),
            })
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.user?.id) {
                return { success: false, message: "Not Authorized" };
            }

            const existingDetail = await getStockSaleDetailImpl(input.id);
            if (!existingDetail) {
                return { success: false, message: "Stock sale detail doesn't exist" };
            }

            try {
                const result = await updateStockSaleDetailImpl(input.id, input.updates, ctx.user.id);
                return {
                    success: true,
                    message: "Stock sale detail successfully updated",
                    data: result[0]
                };
            } catch (error) {
                return handleError(error, "Failed to update stock sale detail");
            }
        }),

    // Delete stock sale detail
    deleteStockSaleDetail: managerProcedure
        .input(z.object({ 
            id: z.string() 
        }))
        .mutation(async ({ input }) => {
            const existingDetail = await getStockSaleDetailImpl(input.id);
            if (!existingDetail) {
                return { success: false, message: "Stock sale detail doesn't exist" };
            }

            try {
                await deleteStockSaleDetailImpl(input.id);
                return { 
                    success: true, 
                    message: "Stock sale detail successfully deleted" 
                };
            } catch (error) {
                return handleError(error, "Failed to delete stock sale detail");
            }
        })
});
