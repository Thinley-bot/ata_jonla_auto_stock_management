import { managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import { handleError } from "~/server/helper/global_error";
import { createPartCategoryImpl, deletePartCategoryImpl, getPartCategoriesImpl, getPartCategoryImpl, updatePartCategoryImpl } from "../queries/part_category.queries";

export const PartCategoryRouter = createTRPCRouter({

getPartCategories: managerProcedure.query(async () => await getPartCategoriesImpl),

getPartCategory: managerProcedure.input(z.string()).query(async ({ input }) => await getPartCategoryImpl(input)),

createPartCategory: managerProcedure.input(z.object({
        category_name: z.string(),
        category_desc: z.string(),
        unit: z.string(),
    })).mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false, message: "Not Authorized" }
        try {
            await createPartCategoryImpl(ctx.user.id, input)
            return { success: true, message: "Part successfully created" };
        } catch (error) {
            handleError(error, "Failed to create part")
        }
    }),

    updatePartCategory: managerProcedure.input(
        z.object({
            id: z.string({ message: "Category ID is missing." }),
            updates: z.object({
                category_name: z.string().optional(),
                category_desc: z.string().optional(),
                unit: z.string().optional(),
            })
        })).mutation(async ({ input, ctx }) => {
            if (!ctx.user?.id) return { success: false, message: "Not Authorized" }
            const { id, updates } = input;
            const isCategoryExist = await getPartCategoryImpl(id);
            if (!isCategoryExist) {
                return { success: false, message: "The category doesn't exist" };
            }
            try {
                await updatePartCategoryImpl(id, ctx.user.id, updates)
                return { success: true, message: "Category successfully updated" }
            } catch (error) {
                return handleError(error, "Failed to update part");
            }
        }),

    deletePartCategory: managerProcedure.input(
        z.object({ id: z.string() })
    ).mutation(async ({ input }) => {
        const isCategoryExist = await getPartCategoryImpl(input.id);
        if (!isCategoryExist) {
            return { success: false, message: "The category doesn't exist" };
        }
        try {
            await deletePartCategoryImpl(input.id);
            return { success: true, message: "Part category successfully deleted" };
        } catch (error) {
            return handleError(error, "Failed to delete part category");
        }
    })
})
