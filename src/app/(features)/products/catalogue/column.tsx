"use client"

import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "~/components/ui/actioncell";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  reorderLevel: number;
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
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return `$${price.toFixed(2)}`;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "reorderLevel",
    header: "Reorder Level",
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
