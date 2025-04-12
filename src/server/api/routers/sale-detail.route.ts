const createSaleDetailSchema = z.object({
  sale_id: z.string().min(1, "Sale ID is required"),
  part_id: z.string().min(1, "Part ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit_price: z.number().min(0, "Unit price must be a positive number"),
  sub_total: z.number().min(0, "Subtotal must be a positive number"),
});

const updateSaleDetailSchema = createSaleDetailSchema.partial();

export const saleDetailRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSaleDetailSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if part exists and has sufficient stock
        const part = await ctx.db.part_catalogue.findUnique({
          where: { id: input.part_id },
          select: { stock: true },
        });

        if (!part) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Part not found",
          });
        }

        if (part.stock < input.quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient stock",
          });
        }

        // Create sale detail and update stock in a transaction
        const result = await ctx.db.$transaction(async (tx) => {
          const saleDetail = await tx.stock_sale_detail.create({
            data: {
              ...input,
              createdBy: ctx.session.user.id,
              updatedBy: ctx.session.user.id,
            },
          });

          await tx.part_catalogue.update({
            where: { id: input.part_id },
            data: { stock: { decrement: input.quantity } },
          });

          return saleDetail;
        });

        return { success: true, data: result };
      } catch (error) {
        console.error("Error creating sale detail:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create sale detail",
        });
      }
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updateSaleDetailSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const currentDetail = await ctx.db.stock_sale_detail.findUnique({
          where: { id: input.id },
          include: { part: true },
        });

        if (!currentDetail) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sale detail not found",
          });
        }

        // If quantity is being updated, check stock
        if (input.data.quantity) {
          const quantityDiff = input.data.quantity - currentDetail.quantity;
          if (quantityDiff > 0 && currentDetail.part.stock < quantityDiff) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Insufficient stock",
            });
          }
        }

        // Update sale detail and stock in a transaction
        const result = await ctx.db.$transaction(async (tx) => {
          const saleDetail = await tx.stock_sale_detail.update({
            where: { id: input.id },
            data: {
              ...input.data,
              updatedBy: ctx.session.user.id,
            },
          });

          if (input.data.quantity) {
            const quantityDiff = input.data.quantity - currentDetail.quantity;
            await tx.part_catalogue.update({
              where: { id: currentDetail.part_id },
              data: { stock: { decrement: quantityDiff } },
            });
          }

          return saleDetail;
        });

        return { success: true, data: result };
      } catch (error) {
        console.error("Error updating sale detail:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update sale detail",
        });
      }
    }),

  // ... existing code ...
}); 