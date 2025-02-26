import { publicProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import { getCarBrandById, getCarBrands } from "../queries/car_brand";

export const carBrandRouter = createTRPCRouter({
    getCarBrandById: publicProcedure.input(z.string()).query(async ({input}) => {
        return await getCarBrandById(input);
    }),
    getCarBrands: publicProcedure.query(async () => {
        return await getCarBrands();
    }),
})
