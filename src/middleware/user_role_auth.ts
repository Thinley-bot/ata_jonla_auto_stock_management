import { t } from "~/server/api/trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

const enforceRoles = (requiredRoles: string[]) => t.middleware(async ({ ctx, next }) => {
  const userId = ctx.user?.id;
  if (!userId) {
    throw new AuthorizationError("Unauthorized: User ID is missing.");
  }

  try {
    const userWithRole = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: {},
      with: {
        role: {
          columns: {
            role_name: true,
          },
        },
      },
    });

    if (!userWithRole || !userWithRole.role) {
      throw new AuthorizationError("Unauthorized: User or role not found.");
    }

    const roleName = userWithRole.role.role_name;
    console.log("this is the role",roleName)

    if (!requiredRoles.includes(roleName)) {
      throw new AuthorizationError(
        `Forbidden: One of the following roles required: ${requiredRoles.join(", ")}.`
      );
    }

    return next();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      throw error;
    }
    throw new DatabaseError(`Database query failed: ${error.message}`);
  }
});

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100; 
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const errorHandlingMiddleware = t.middleware(async ({ next, path }) => {
  try {
    return await next();
  } catch (error) {
    console.error(`[TRPC Error] ${path}:`, error);

    if (error instanceof AuthorizationError) {
      throw new TRPCError({
        code: error.name === "AuthorizationError" ? "UNAUTHORIZED" : "FORBIDDEN",
        message: error.message,
      });
    }

    if (error instanceof DatabaseError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database operation failed.",
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong on the server.",
    });
  }
});

const isAdmin = enforceRoles(["Admin"]);
const isManager = enforceRoles(["Manager", "Admin"]);
const isEmployee = enforceRoles(["Employee", "Manager", "Admin"]);

const adminProcedure = t.procedure.use(errorHandlingMiddleware).use(isAdmin);
const managerProcedure = t.procedure.use(errorHandlingMiddleware).use(isManager);
const employeeProcedure = t.procedure.use(errorHandlingMiddleware).use(isEmployee);
const publicProcedure = t.procedure.use(errorHandlingMiddleware).use(timingMiddleware);

export { publicProcedure, adminProcedure, managerProcedure, employeeProcedure };
