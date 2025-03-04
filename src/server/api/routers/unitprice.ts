import { managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { createUnitPrice, deleteUnitPrice, getUnitPrice, getUnitPrices, updateUnitPrice } from "../queries/unitprice";
import { z } from "zod";
import { handleError } from "~/server/helper/global_error";

export const unitPriceRouter = createTRPCRouter({
    getUnitPrices: managerProcedure.query(async () => {
        try {
            const unitPrices = await getUnitPrices();
            return { success: true, data: unitPrices, message: "Unit prices retrieved successfully" };
        } catch (error) {
            return handleError(error, "Failed to retrieve unit prices");
        }
    }),

    getUnitPrice: managerProcedure.input(z.string()).query(async ({ input }) => {
        try {
            const unitPrice = await getUnitPrice(input);
            return { success: true, data: unitPrice, message: "Unit price retrieved successfully" };
        } catch (error) {
            return handleError(error, "Failed to retrieve unit price");
        }
    }),

    createUnitPrice: managerProcedure.input(z.object({
        part_id: z.string(),
        unit_price: z.number().positive("Unit price must be a positive number"),
        start_date: z.string(),
        end_date: z.string(),
    }).refine((data) => new Date(data.start_date) <= new Date(data.end_date), {
        message: "Start date cannot be greater than end date",
        path: ["start_date"],
    })).mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { success: false, message: "Not Authorized" };

        try {
            await createUnitPrice(ctx.user.id, input);
            return { success: true, message: "Unit price created successfully" };
        } catch (error) {
            return handleError(error, "Failed to create unit price");
        }
    }),

    updateUnitPrice: managerProcedure.input(
        z.object({
          part_id: z.string().optional(),
          unit_price: z.number().positive("Unit price must be a positive number").optional(),
          start_date: z.string().optional(),
          end_date: z.string().optional(),
        }).refine((data) => {
          if (data.start_date && data.end_date) {
            return new Date(data.start_date) <= new Date(data.end_date);
          }
          return true;
        }, {
          message: "Start date cannot be greater than end date",
          path: ["start_date"],
        })
      ).mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { success: false, message: "Not Authorized" };
      
        try {
            await updateUnitPrice(ctx.user.id,input)
          return { success: true, message: "Unit price updated successfully" };
        } catch (error) {
          return handleError(error, "Failed to update unit price");
        }
      }),   
    
    deleteUnitPrice : managerProcedure.input(z.string()).mutation(async({input}) => {
      try {
        await deleteUnitPrice(input)
        return  { success: true, message: "Unit price deleted successfully" };
      }catch(error){
        return handleError(error,"Failed to delete unit price")
      }
    })
});
