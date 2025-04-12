import { db } from "~/server/db";
import { eq, gt, lt, like } from "drizzle-orm";
import { NewUser, users } from "~/server/db/schema/users";

export const getUsersImpl = async ({
  limit,
  cursor,
  direction,
  search,
  roleFilter,
}: {
  limit: number;
  cursor?: string | undefined;
  direction: "next" | "prev";
  search?: string;
  roleFilter?: string;
}) => {
  const baseQuery = db.query.users.findMany({
    with: {
      role: {
        columns: {
          role_description: false,
        },
      },
    },
    where: (users, { and, or, like, eq }) => {
      const conditions = [];
      
      if (cursor) {
        conditions.push(
          direction === "next" ? gt(users.id, cursor) : lt(users.id, cursor)
        );
      }
      
      if (search) {
        conditions.push(like(users.name, `%${search}%`));
      }

      if (roleFilter) {
        conditions.push(eq(users.role_id, roleFilter));
      }
      
      return conditions.length > 0 ? and(...conditions) : undefined;
    },
    limit: limit + 1, // Get one extra to determine if there are more results
  });

  const results = await baseQuery;
  const hasMore = results.length > limit;
  const items = results.slice(0, limit);
  
  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id : undefined,
    prevCursor: cursor,
  };
};

export const getUserImpl = async (id: string) =>
  await db.query.users.findFirst({
    where: (users) => eq(users.id, id),
    with:{
        role:{
          columns :{
            role_description:false
          }
        }
    },
  })

export const updateUserImpl = async (id: string, updateUser: Partial<NewUser>) => {
  console.log("updateUserImpl called with:", { id, updateUser });
  try {
    const result = await db.update(users).set({ ...updateUser}).where(eq(users.id, id)).returning();
    console.log("updateUserImpl result:", result);
    return result;
  } catch (error) {
    console.error("Error in updateUserImpl:", error);
    throw error;
  }
}

export const createUserImpl = async (newUser: NewUser) =>
  await db.insert(users).values(newUser).returning();

export const deleteUserImpl = async (id: string) =>await db.delete(users).where(eq(users.id, id));
