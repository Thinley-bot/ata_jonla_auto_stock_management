import { managerProcedure, publicProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";

export const unitPriceRouter = createTRPCRouter({
    getUnitPrices : managerProcedure.query(async()=>{
        return await 
    })
})