import { z } from "zod";
import { managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { handleError } from "~/server/helper/global_error";
import { createStockSaleImpl, deleteStockSaleImpl, getStockSaleImpl, getStockSalesImpl, updateStockSaleImpl } from "../queries/sale.queries";
import { createSaleSchema, getSalesSchema, updateSaleSchema } from "../route_schemas/sale.schema";

export const saleRouter = createTRPCRouter({
  getStockSales: managerProcedure.input(getSalesSchema).query(async ({input}) => await getStockSalesImpl(input)),

  getStockSale: managerProcedure.input(z.string({message:"The sale id should be present."})).query(async ({ input }) => await getStockSaleImpl(input)),

  createStockSale: managerProcedure.input(createSaleSchema).mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) return { success: false, message: "Not Authorized" };
      try {
        const {...saleData } = input;
        const result = await createStockSaleImpl(ctx.user.id, saleData);
        return { 
          success: true, 
          message: "Stock sale and details successfully created",
          data: result?.id
        };
      } catch (error) {
        return handleError(error, "Failed to create stock sale");
      }
    }),
    
  updateStockSale: managerProcedure.input(z.object({id: z.string({ message: "Sale ID is missing" }),updates: updateSaleSchema })).mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) return { success: false, message: "Not Authorized" };
      const { id, updates } = input;
      const existingSale = await getStockSaleImpl(id);
      
      if (!existingSale[0]) {
        return { success: false, message: "The stock sale doesn't exist" };
      }
      
      try {
        const {...saleUpdates } = updates;
        const result = await updateStockSaleImpl(id, ctx.user.id, saleUpdates);
        return { 
          success: true, 
          message: "Stock sale and details successfully updated",
          data: result
        };
      } catch (error) {
        return handleError(error, "Failed to update stock sale");
      }
    }),

  deleteStockSale: managerProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
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
    }),


});

export type SaleRouter = typeof saleRouter;
