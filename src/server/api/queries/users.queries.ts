import { db } from "~/server/db";
import { eq, gt, lt } from "drizzle-orm";
import { NewUser, users } from "~/server/db/schema/users";

export const getUsersImpl = async ({limit,cursor,direction}:{limit:number, cursor?:string | undefined, direction:"next" | "prev"}) =>
  await db.query.users.findMany({
    with:{
      role:{
        columns :{
          role_description:false
        }
      }
  },
  where:(cursor ? (direction === 'next' ? gt(users.id, cursor) : lt(users.id,cursor)) : undefined),
  limit:limit,
  });

export const getUserImpl = async (id: string) =>
  await db.query.users.findFirst({
    with:{
        role:{
          columns :{
            role_description:false
          }
        }
    },
  })

export const updateUserImpl = async (id: string, updateUser: Partial<NewUser>) =>
  await db.update(users).set({ ...updateUser}).where(eq(users.id, id)).returning();

export const deleteUserImpl = async (id: string) =>await db.delete(users).where(eq(users.id, id));
