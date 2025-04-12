import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { managerProcedure } from "~/middleware/user_role_auth";
import { eq, and, like, desc, asc } from "drizzle-orm";
import { supplier } from "~/server/db/schema/supplier";

export const supplierRouter = createTRPCRouter({
  getSuppliers: managerProcedure.query(async ({ ctx }) => {
    return ctx.db.query.supplier.findMany({
      orderBy: (supplierTable, { asc }) => [asc(supplierTable.supplier_name)],
    });
  }),

  getPaginatedSuppliers: managerProcedure
    .input(
      z.object({
        pageSize: z.number().min(1).max(100).default(10),
        pageIndex: z.number().min(0).default(0),
        sorting: z.array(
          z.object({
            id: z.string(),
            desc: z.boolean(),
          })
        ).optional(),
        filters: z.array(
          z.object({
            id: z.string(),
            value: z.string(),
          })
        ).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { pageSize, pageIndex } = input;
      
      try {
        // Get total count for pagination
        const allSuppliers = await ctx.db.query.supplier.findMany();
        const totalCount = allSuppliers.length;
        
        // Get paginated data with simple pagination
        const suppliers = await ctx.db.query.supplier.findMany({
          limit: pageSize,
          offset: pageIndex * pageSize,
        });
        
        return {
          success: true,
          data: suppliers,
          pageCount: Math.ceil(totalCount / pageSize),
          message: "Suppliers retrieved successfully",
        };
      } catch (error) {
        console.error("Error in getPaginatedSuppliers:", error);
        return {
          success: false,
          data: [],
          pageCount: 0,
          message: "Error retrieving suppliers: " + (error instanceof Error ? error.message : String(error)),
        };
      }
    }),

  getSupplierById: managerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.supplier.findFirst({
        where: (supplierTable, { eq }) => eq(supplierTable.id, input.id),
      });
    }),

  createSupplier: managerProcedure
    .input(
      z.object({
        supplier_name: z.string().min(1),
        supplier_number: z.string().optional(),
        contact: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new Error("User not authenticated");
      }
      
      return ctx.db.insert(supplier).values({
        supplier_name: input.supplier_name,
        supplier_number: input.supplier_number || "",
        createdBy: ctx.user.id,
        contact: input.contact || "",
        email: input.email || "",
        phone: input.phone || "",
        address: input.address || "",
      });
    }),

  updateSupplier: managerProcedure
    .input(
      z.object({
        id: z.string(),
        supplier_name: z.string().min(1).optional(),
        supplier_number: z.string().optional(),
        contact: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};
      
      if (data.supplier_name) updateData.supplier_name = data.supplier_name;
      if (data.supplier_number) updateData.supplier_number = data.supplier_number;
      if (data.contact) updateData.contact = data.contact;
      if (data.email) updateData.email = data.email;
      if (data.phone) updateData.phone = data.phone;
      if (data.address) updateData.address = data.address;
      
      updateData.updatedBy = ctx.user.id;
      
      return ctx.db
        .update(supplier)
        .set(updateData)
        .where(eq(supplier.id, id));
    }),

  deleteSupplier: managerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(supplier)
        .where(eq(supplier.id, input.id));
    }),
}); 