import { z } from "zod";
import { managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { handleError } from "~/server/helper/global_error";
import { createStockSaleImpl, deleteStockSaleImpl, getStockSaleImpl, getStockSalesImpl, updateStockSaleImpl } from "../queries/sale.queries";
import { TRPCError } from "@trpc/server";

const createSaleSchema = z.object({
  payment_mode: z.string().min(1, "Payment mode is required"),
  total_sale: z.number().min(0, "Total sale must be a positive number"),
  invoice_number: z.string().optional(),
  customer_name: z.string().optional(),
  notes: z.string().optional(),
});

const updateSaleSchema = createSaleSchema.partial();

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
    }),

  create: managerProcedure
    .input(createSaleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sale = await ctx.db.stock_sale.create({
          data: {
            ...input,
            createdBy: ctx.session.user.id,
            updatedBy: ctx.session.user.id,
          },
        });
        return { success: true, data: sale };
      } catch (error) {
        console.error("Error creating sale:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create sale",
        });
      }
    }),

  update: managerProcedure
    .input(z.object({
      id: z.string(),
      data: updateSaleSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const sale = await ctx.db.stock_sale.update({
          where: { id: input.id },
          data: {
            ...input.data,
            updatedBy: ctx.session.user.id,
          },
        });
        return { success: true, data: sale };
      } catch (error) {
        console.error("Error updating sale:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update sale",
        });
      }
    }),
});

export type SaleRouter = typeof saleRouter;
