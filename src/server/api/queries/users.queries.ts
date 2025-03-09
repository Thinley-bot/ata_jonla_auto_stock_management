import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { NewUser, users } from "~/server/db/schema/users";

export const getUsersImpl = async () =>
  await db.query.users.findMany({
    with:{
        role:true
    }
  })

export const getUserImpl = async (id: string) =>
  await db.query.users.findFirst({
    with:{
        role:true
    }
  })

export const updateUserImpl = async (id: string, updateUser: Partial<NewUser>) =>
  await db.update(users).set({ ...updateUser}).where(eq(users.id, id)).returning();

export const deleteUserImpl = async (id: string) =>await db.delete(users).where(eq(users.id, id));
