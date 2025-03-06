import { managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { getPartCategories, getPartCategory } from "../queries/part_category";
import { z } from "zod";

export const PartCategotyRouter = createTRPCRouter({
    getPartCategories : managerProcedure.query(async () => {
        return await getPartCategories;
    }),

    getPartCategory : managerProcedure.input(z.string()).query(async ({input}) => {
        return await getPartCategory(input);
    })
})