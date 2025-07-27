"use client"

import { ColumnDef } from "@tanstack/react-table";
import { n } from "node_modules/better-auth/dist/auth-BBnJHOLM";
import ActionCell from "~/components/ui/actioncell";

export type Product = {
  id: string;
  name: string;
  partnumber: string;
  category: string;
  brand: string;
  price: number;
  createdAt: Date;
};

export const columns : ColumnDef<Product>[] = [
  {
    header: "ID",
    cell: ({row}) => (
      <p>{row.index + 1}</p>
    )
  },
  {
    accessorKey: "name",
    header: "Name",
  },
    {
    accessorKey: "partnumber",
    header: "Part Number",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "price",
    header: "Unit Price (Nu)"
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const itemId = row.original.id;
      return <ActionCell item="catalogue" itemId={itemId}/>;
    },
  },
];
