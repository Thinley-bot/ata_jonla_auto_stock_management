import { randomUUID } from "crypto";

export const stockSales = (adminUserId: string | undefined) => [
    {
        id: randomUUID(),
        payment_mode: "Cash",
        total_sale: (Math.random() * 1000).toFixed(2), 
        total_discount:"0",
        invoice_number:"INV/2025/01",
        customer_phone_num:"77873210",
        createdBy: adminUserId,
        updatedBy: adminUserId,
    },
    {
        id: randomUUID(),
        payment_mode: "Credit Card",
        total_sale: (Math.random() * 1000).toFixed(2), 
        total_discount:"0",
        invoice_number:"INV/2025/02",
        customer_phone_num:"77873210",
        createdBy: adminUserId,
        updatedBy: adminUserId,
    },
];
