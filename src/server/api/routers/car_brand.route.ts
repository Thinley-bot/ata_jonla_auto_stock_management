import { publicProcedure, managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import { getCarBrandById, getCarBrands, createCarBrand, deleteCarBrand, updateCarBrand } from "../queries/car_brand.queries";
import { handleError } from "~/server/helper/global_error";

export const carBrandRouter = createTRPCRouter({
    getCarBrandById: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await getCarBrandById(input);
    }),
    getCarBrands: publicProcedure
        .input(z.object({
            search: z.string().optional(),
        }))
        .query(async ({ input }) => {
            return await getCarBrands(input.search);
        }),
    createBrand: managerProcedure
        .input(z.object({
            name: z.string(),
            description: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.user?.id) return { success: false, message: "Not Authorized" };
            try {
                await createCarBrand(ctx.user.id, input);
                return { success: true, message: "Brand created successfully" };
            } catch (error) {
                return handleError(error, "Failed to create brand");
            }
        }),
    deleteCarBrand: managerProcedure
        .input(z.object({
            id: z.string({ message: "The brand id should be included" })
        }))
        .mutation(async ({ input, ctx }) => {
            return await deleteCarBrand(input.id);
        }),

    updateCarBrand: managerProcedure.input(z.object({
        id: z.string({ message: "Brand ID is missing." }),
        updates: z.object({
            brand_name: z.string(),
            brand_desc: z.string()
        })
    })).mutation(async ({ input, ctx }) => {
        if(!ctx.user?.id) return { success: false, message: "Not Authorized" };
        const {id, updates} = input;

        const brandExist = await getCarBrandById(id);
        if(!brandExist){
            return { success: false, message: "The car brand doesn't exist" };
        }
        try {
            await updateCarBrand(id,updates,ctx.user.id)
             return { success: true, message: "Brand updated successfully" };
        }
        catch(error){
             return handleError(error, "Failed to update brand");
        }
    })
});
