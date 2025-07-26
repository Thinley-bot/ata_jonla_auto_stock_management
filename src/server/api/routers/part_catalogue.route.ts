import { managerProcedure, publicProcedure } from "~/middleware/user_role_auth";
import { 
    createPartCatalogue, 
    deletePartCatalogue, 
    getPartCatalogue, 
    getPartCatalogues, 
    updatePartCatalogue 
} from "../queries/part_catalogue.queries";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";
import { handleError } from "~/server/helper/global_error";

export const partCatalogueRouter = createTRPCRouter({
    getPartCatalogues: publicProcedure.query(async () => {
        try {
            const catalogues = await getPartCatalogues();
            return { success: true, data: catalogues, message: "Part catalogues retrieved successfully" };
        } catch (error) {
            return handleError(error, "Failed to retrieve part catalogues");
        }
    }),

    getPartCatalogue: publicProcedure.input(z.string()).query(async ({ input }) => {
        try {
            const part = await getPartCatalogue(input);
            if (!part) {
                return { success: false, message: "Part not found" };
            }
            return { success: true, data: part, message: "Part retrieved successfully" };
        } catch (error) {
            return handleError(error, "Failed to retrieve part");
        }
    }),

    createPartCatalogue: managerProcedure.input(
        z.object({
            part_name: z.string(),
            part_number: z.string().optional(),
            category_id: z.string(),
            brand_id: z.string(),
            unit_price: z.number()
        })
    ).mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false, message: "Not Authorized" };

        try {
            await createPartCatalogue(ctx.user.id, input);
            return { success: true, message: "Part successfully created" };
        } catch (error) {
            return handleError(error, "Failed to create part");
        }
    }),

    updatePartCatalogue: managerProcedure.input(
        z.object({
            id: z.string({ message: "Part ID is missing." }),
            updates: z.object({
                part_name: z.string().optional(),
                part_number: z.string().optional(),
                category_id: z.string().optional(),
                brand_id: z.string().optional(),
            }).strict(),
        })
    ).mutation(async ({ input, ctx }) => {
        if (!ctx.user) return { success: false, message: "Not Authorized" };

        const { id, updates } = input;
        const isPartExist = await getPartCatalogue(id);
        if (!isPartExist) {
            return { success: false, message: "The part doesn't exist" };
        }

        try {
            await updatePartCatalogue(id, updates, ctx.user.id);
            return { success: true, message: "Part successfully updated" };
        } catch (error) {
            return handleError(error, "Failed to update part");
        }
    }),

    deletePartCatalogue: managerProcedure.input(
        z.object({ id: z.string() })
    ).mutation(async ({ input }) => {
        const isPartExist = await getPartCatalogue(input.id);
        if (!isPartExist) {
            return { success: false, message: "The part doesn't exist" };
        }
        try {
            await deletePartCatalogue(input.id);
            return { success: true, message: "Part successfully deleted" };
        } catch (error) {
            return handleError(error, "Failed to delete part");
        }
    }),
});
