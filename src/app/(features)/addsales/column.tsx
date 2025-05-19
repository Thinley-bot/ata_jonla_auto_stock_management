"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Stock = {
    part_id: string;
    quantity: number;
    unit_price: number;
    discount: number;
    sub_total: number;
};

export const columns: ColumnDef<Stock>[] = [
    {
        accessorKey: "part_id",
        header: "Part ID",
    },
    {
        accessorKey: "quantity",
        header: "quantity",
    },
    {
        accessorKey: "unit_price",
        header: "Unit Price",
    },
    {
        accessorKey: "discount",
        header: "Discount",
    },
    {
        accessorKey: "sub_total",
        header: "Sub Total",
    },
    {
        id: "actions",
        header: "Actions"
    },
]; 