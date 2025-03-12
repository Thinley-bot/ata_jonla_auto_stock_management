import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { carBrandRouter } from "./routers/car_brand.route";
import { partCatalogueRouter } from "./routers/part_catalogue.route";
import { unitPriceRouter } from "./routers/unitprice.route";
import { PartCategoryRouter } from "./routers/part_category.route";
import { saleRouter } from "./routers/sale.route";
import { saleDetailRouter } from "./routers/sale_details.route";
import { stockRouter } from "./routers/stock.route";
import { userRouter } from "./routers/user.route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  userRoutes : userRouter,
  carBrandRoutes: carBrandRouter,
  partCatalogueRoutes : partCatalogueRouter,
  unitPriceRoutes : unitPriceRouter,
  partCategoryRoutes : PartCategoryRouter,
  saleRoutes : saleRouter,
  saleDetailRoutes : saleDetailRouter,
  stockRoutes : stockRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
