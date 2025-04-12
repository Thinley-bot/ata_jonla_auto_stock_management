import { z } from "zod";
import { managerProcedure, publicProcedure } from "~/middleware/user_role_auth";
import { createTRPCRouter } from "../trpc";
import { handleError } from "~/server/helper/global_error";
import { getUsersImpl,getUserImpl,updateUserImpl,deleteUserImpl} from "../queries/users.queries";
import { db } from "~/server/db";
import { users } from "~/server/db/schema/users";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.input(z.object({
    limit: z.number().min(1).max(100).default(10),
    cursor: z.string().optional(),
    direction: z.enum(["next", "prev"]).default("next"),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    search: z.string().optional(),
    roleFilter: z.string().optional(),
  })).query(async ({input}) => await getUsersImpl(input)),

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
      console.log("Update User Request:", { id, updates });
      
      const existingUser = await getUserImpl(id);
      console.log("Existing User:", existingUser);
      
      if (!existingUser) {
        console.log("User not found with ID:", id);
        return { success: false, message: "The user doesn't exist" , error : "User doesn't exist in the user table." };;
      }
      
      try {
        console.log("Attempting to update user with:", { id, updates });
        const result = await updateUserImpl(id, updates);
        console.log("Update result:", result);
        
        return { 
          success: true, 
          data: result,
          message: "User successfully updated",
        };
      } catch (error) {
        console.error("Error updating user:", error);
        return handleError(error, "Failed to update user");
      }
    }),

  deleteUser: managerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existingUser = await getUserImpl(input.id);
      
      if (!existingUser) {
        return { success: false, message: "The user doesn't exist" , error : "User doesn't exist in the user table." };
      }
      
      try {
        await deleteUserImpl(input.id);
        return { success: true, message: "User successfully deleted" };
      } catch (error) {
        return handleError(error, "Failed to delete user");
      }
    }),

  createUser: managerProcedure
    .input(z.object({
      id: z.string({ message: "User ID is required" }),
      name: z.string({ message: "Name is required" }),
      email: z.string().email({ message: "Valid email is required" }),
      image: z.string().optional(),
      role_id: z.string({ message: "Role ID is required" }),
    }))
    .mutation(async ({ input }) => {
      try {
        // Override the id in the database with the auth id
        const result = await db.insert(users).values({
          id: input.id, // Explicitly set the ID from auth
          name: input.name,
          email: input.email,
          image: input.image,
          role_id: input.role_id,
        }).returning();
        
        return { 
          success: true, 
          data: result,
          message: "User successfully created",
        };
      } catch (error) {
        return handleError(error, "Failed to create user");
      }
    })
});

export type UserRouter = typeof userRouter;
