import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { managerProcedure } from "~/middleware/user_role_auth";
import { eq, and, like, desc, asc } from "drizzle-orm";

export const supplierRouter = createTRPCRouter({
  getSuppliers: managerProcedure.query(async ({ ctx }) => {
    return ctx.db.query.supplier.findMany({
      orderBy: (supplier, { asc }) => [asc(supplier.supplier_name)],
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
      const { pageSize, pageIndex, sorting, filters } = input;
      
      // Build where conditions based on filters
      const whereConditions = [];
      if (filters && filters.length > 0) {
        for (const filter of filters) {
          if (filter.id === "supplier_name") {
            whereConditions.push(like(ctx.db.supplier.supplier_name, `%${filter.value}%`));
          }
        }
      }
      
      // Build order by based on sorting
      let orderBy = [asc(ctx.db.supplier.supplier_name)];
      if (sorting && sorting.length > 0) {
        orderBy = sorting.map(sort => {
          if (sort.id === "supplier_name") {
            return sort.desc ? desc(ctx.db.supplier.supplier_name) : asc(ctx.db.supplier.supplier_name);
          } else if (sort.id === "supplier_number") {
            return sort.desc ? desc(ctx.db.supplier.supplier_number) : asc(ctx.db.supplier.supplier_number);
          } else if (sort.id === "createdAt") {
            return sort.desc ? desc(ctx.db.supplier.createdAt) : asc(ctx.db.supplier.createdAt);
          }
          return asc(ctx.db.supplier.supplier_name);
        });
      }
      
      // Get total count for pagination
      const totalCount = await ctx.db.query.supplier.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      }).then(suppliers => suppliers.length);
      
      // Get paginated data
      const suppliers = await ctx.db.query.supplier.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
        orderBy,
        limit: pageSize,
        offset: pageIndex * pageSize,
      });
      
      return {
        success: true,
        data: suppliers,
        pageCount: Math.ceil(totalCount / pageSize),
        message: "Suppliers retrieved successfully",
      };
    }),

  getSupplierById: managerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.supplier.findFirst({
        where: (supplier, { eq }) => eq(supplier.id, input.id),
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
      return ctx.db.insert(ctx.db.supplier).values({
        ...input,
        createdBy: ctx.user?.id,
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
      const { id, ...data } = input;
      return ctx.db
        .update(ctx.db.supplier)
        .set({
          ...data,
          updatedBy: ctx.user?.id,
          updatedAt: new Date(),
        })
        .where(eq(ctx.db.supplier.id, id));
    }),

  deleteSupplier: managerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(ctx.db.supplier)
        .where(eq(ctx.db.supplier.id, input.id));
    }),
}); 