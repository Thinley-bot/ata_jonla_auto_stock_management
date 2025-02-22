import { randomUUID } from "crypto";

export const suppliers = (adminUserId: string | undefined) => [
    {
        id: randomUUID(),
        supplier_name: "Karma",
        supplier_number: "77873210",
        createdBy: adminUserId,
        updatedBy: adminUserId,
    },
    {
        id: randomUUID(),
        supplier_name: "Pema",
        supplier_number: "77873210",
        createdBy: adminUserId,
        updatedBy: adminUserId,
    },
    {
        id: randomUUID(),
        supplier_name: "Sangay",
        supplier_number: "77873210",
        createdBy: adminUserId,
        updatedBy: adminUserId,
    },
];
