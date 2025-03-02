import { managerProcedure, publicProcedure } from "~/middleware/user_role_auth";
import { 
    createPartCatalogue, 
    deletePartCatalogue, 
    getPartCatalogue, 
    getPartCatalogues, 
    updatePartCatalogue 
} from "../queries/part_catalogue";
import { createTRPCRouter } from "../trpc";
import { z } from "zod";

export const partCatalogueRouter = createTRPCRouter({
    getPartCatalogues: publicProcedure.query(async () => {
        try {
            const catalogues = await getPartCatalogues();
            return { success: true, data: catalogues, message: "Part catalogues retrieved successfully" };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { success: false, message: "Failed to retrieve part catalogues", error: errorMessage };
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
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { success: false, message: "Failed to retrieve part", error: errorMessage };
        }
    }),

    createPartCatalogue: managerProcedure.input(
        z.object({
            part_name: z.string(),
            part_number: z.string(),
            category_id: z.string(),
            brand_id: z.string(),
        })
    ).mutation(async ({ input, ctx }) => {
        if (!ctx.user) return { success: false, message: "Not Authorized" };

        try {
            await createPartCatalogue(ctx.user.id, input);
            return { success: true, message: "Part successfully created" };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { success: false, message: "Failed to create part", error: errorMessage };
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
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { success: false, message: "Failed to update part", error: errorMessage };
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
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return { success: false, message: "Failed to delete part", error: errorMessage };
        }
    }),
});
