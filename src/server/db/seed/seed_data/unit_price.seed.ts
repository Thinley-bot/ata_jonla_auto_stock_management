import { randomUUID } from "crypto";

export const unitPrices = (
    adminUserId: string,
    partIds: string[]
) => {
    const prices = [];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setFullYear(today.getFullYear() + 1);

    for (const partId of partIds) {
        prices.push({
            id: randomUUID(),
            part_id: partId,
            unit_price: (Math.random() * 100).toFixed(2),
            start_date: today.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
            createdBy: adminUserId,
            updatedBy: adminUserId,
        });
    }
    return prices;
};