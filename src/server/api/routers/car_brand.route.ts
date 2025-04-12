import { publicProcedure, managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import { getCarBrandById, getCarBrands, createCarBrand } from "../queries/car_brand.queries";
import { handleError } from "~/server/helper/global_error";

export const carBrandRouter = createTRPCRouter({
    getCarBrandById: publicProcedure.input(z.string()).query(async ({input}) => {
        return await getCarBrandById(input);
    }),
    getCarBrands: publicProcedure
        .input(z.object({
            search: z.string().optional(),
        }))
        .query(async ({input}) => {
            return await getCarBrands(input.search);
        }),
    createBrand: managerProcedure
        .input(z.object({
            name: z.string(),
            description: z.string(),
        }))
        .mutation(async ({input, ctx}) => {
            if (!ctx.user?.id) return { success: false, message: "Not Authorized" };
            try {
                await createCarBrand(ctx.user.id, input);
                return { success: true, message: "Brand created successfully" };
            } catch (error) {
                return handleError(error, "Failed to create brand");
            }
        }),
});
