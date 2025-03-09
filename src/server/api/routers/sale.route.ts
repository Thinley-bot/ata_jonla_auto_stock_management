import { z } from "zod";
import { managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { handleError } from "~/server/helper/global_error";
import { createStockSaleImpl, deleteStockSaleImpl, getStockSaleImpl, getStockSalesImpl, updateStockSaleImpl } from "../queries/sale.queries";

export const saleRouter = createTRPCRouter({
  getStockSales: managerProcedure.query(async () => await getStockSalesImpl()),

  getStockSale: managerProcedure.input(z.string()).query(async ({ input }) => await getStockSaleImpl(input)),

  createStockSale: managerProcedure
  .input(z.object({
    payment_mode : z.string(),
    total_sale : z.number().positive({message:"The total sale should be postive."})})).mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) return { success: false, message: "Not Authorized" };
      try {
        const result = await createStockSaleImpl(ctx.user.id, input);
        return { 
          success: true, 
          message: "Stock sale successfully created",
          data: result
        };
      } catch (error) {
        return handleError(error, "Failed to create stock sale");
      }
    }),

  updateStockSale: managerProcedure
    .input(z.object({
      id: z.string({ message: "Sale ID is missing" }),
      updates: z.object({
        payment_mode : z.string().optional(),
        total_sale : z.number().positive({message:"The total sale should be postive."}).optional()
      })
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) return { success: false, message: "Not Authorized" };
      const { id, updates } = input;
      const existingSale = await getStockSaleImpl(id);
      
      if (!existingSale[0]) {
        return { success: false, message: "The stock sale doesn't exist" };
      }
      
      try {
        const result = await updateStockSaleImpl(id, ctx.user.id, updates);
        return { 
          success: true, 
          message: "Stock sale successfully updated",
          data: result
        };
      } catch (error) {
        return handleError(error, "Failed to update stock sale");
      }
    }),

  deleteStockSale: managerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existingSale = await getStockSaleImpl(input.id);
      
      if (!existingSale) {
        return { success: false, message: "The stock sale doesn't exist" };
      }
      
      try {
        await deleteStockSaleImpl(input.id);
        return { success: true, message: "Stock sale successfully deleted" };
      } catch (error) {
        return handleError(error, "Failed to delete stock sale");
      }
    })
});

export type SaleRouter = typeof saleRouter;
