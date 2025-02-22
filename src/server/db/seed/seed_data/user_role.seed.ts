import { randomUUID } from "crypto";

export const roles = [
    {
        id: randomUUID(),
        role_name: "Admin",
        role_description: "Administrator role with full access.",
    },
    {
        id: randomUUID(),
        role_name: "Manager",
        role_description: "Manager role with limited access.",
    },
    {
        id: randomUUID(),
        role_name: "Employee",
        role_description: "Employee role with restricted access.",
    },
];