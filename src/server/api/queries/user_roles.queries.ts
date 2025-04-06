import { db } from "~/server/db"
import { user_role } from "../../db/schema/user_role"
import { eq } from "drizzle-orm"

export const getUserRoles = async () => {
    return db.select().from(user_role)
}

export const getUserRole = async (userId:string) => {
    return db.select().from(user_role).where(eq(user_role.id, userId))
}
