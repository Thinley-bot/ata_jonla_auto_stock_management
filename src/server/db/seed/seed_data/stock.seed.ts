import { randomUUID } from "crypto";

export const stocks = (
    adminUserId: string | undefined,
    partIds: string[],
    supplierIds: string[]
) => {
    const stocks = [];
    for (const partId of partIds) {
        for (const supplierId of supplierIds) {
            stocks.push({
                id: randomUUID(),
                quantity: Math.floor(Math.random() * 100),
                total_cost: (Math.random() * 1000).toFixed(2),
                part_id: partId,
                supplier_id: supplierId,
                createdBy: adminUserId,
                updatedBy: adminUserId,
            });
        }
    }
    return stocks;
};