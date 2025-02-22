import { randomUUID } from "crypto";

export const stockSaleDetails = (
    adminUserId: string | undefined,
    saleIds: string[],
    partIds: string[]
) => {
    const details = [];
    for (const saleId of saleIds) {
        for (const partId of partIds) {
            details.push({
                id: randomUUID(),
                sale_id: saleId,
                part_id: partId,
                quantity: Math.floor(Math.random() * 10) + 1,
                sub_total: (Math.random() * 100).toFixed(2),
                createdBy: adminUserId,
                updatedBy: adminUserId,
            });
        }
    }

    return details;
};
