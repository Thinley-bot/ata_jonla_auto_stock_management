import { z } from "zod";
import { managerProcedure, publicProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { handleError } from "~/server/helper/global_error";
import { getUsersImpl,getUserImpl,updateUserImpl,deleteUserImpl} from "../queries/users.queries";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async () => await getUsersImpl()),

  getUser: managerProcedure
    .input(z.string())
    .query(async ({ input }) => await getUserImpl(input)),

  updateUser: managerProcedure
    .input(z.object({
      id: z.string({ message: "User ID is missing" }),
      updates: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        emailVerified: z.boolean().optional(),
        image: z.string().optional(),
        role_id: z.string().optional(),
      })
    }))
    .mutation(async ({ input }) => {
      const { id, updates } = input;
      const existingUser = await getUserImpl(id);
      
      if (!existingUser) {
        return { success: false, message: "The user doesn't exist" };
      }
      
      try {
        const result = await updateUserImpl(id, updates);
        return { 
          success: true, 
          message: "User successfully updated",
          data: result
        };
      } catch (error) {
        return handleError(error, "Failed to update user");
      }
    }),

  deleteUser: managerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existingUser = await getUserImpl(input.id);
      
      if (!existingUser) {
        return { success: false, message: "The user doesn't exist" };
      }
      
      try {
        await deleteUserImpl(input.id);
        return { success: true, message: "User successfully deleted" };
      } catch (error) {
        return handleError(error, "Failed to delete user");
      }
    })
});

export type UserRouter = typeof userRouter;
