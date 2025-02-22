import { randomUUID } from "crypto";

export const stockSales = (adminUserId: string | undefined) => [
    {
        id: randomUUID(),
        payment_mode: "Cash",
        total_sale: (Math.random() * 1000).toFixed(2), 
        createdBy: adminUserId,
        updatedBy: adminUserId,
    },
    {
        id: randomUUID(),
        payment_mode: "Credit Card",
        total_sale: (Math.random() * 1000).toFixed(2), 
        createdBy: adminUserId,
        updatedBy: adminUserId,
    },
];
