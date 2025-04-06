import { managerProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import {getUserRole, getUserRoles} from "../queries/user_roles.queries"
import { handleError } from "~/server/helper/global_error";
import { z } from "zod";

export const userRoleRoutes=  createTRPCRouter({
    getUserRole : managerProcedure.input(z.string()).query( async ({input})=> {
        if(!input){
            return {success:false, message: "The user role id should be present.", error: "Missing user role id."}
        }
        try {
            const userRole = await getUserRole(input)
            return { success: true, data: userRole, message: "User Role retrieved successfully" };
        } catch (error) {
            return handleError(error, "Failed to retrieve user roles");
        }
    }),
    getUserRoles : managerProcedure.query(async () => {
        try {
            const userRoles = await getUserRoles();
            return { success: true, data: userRoles, message: "User Roles retrieved successfully" };
        } catch (error) {
            return handleError(error, "Failed to retrieve user roles");
        }
    })
})