"use client"

import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "~/components/ui/actioncell";

export type Brand = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

export const columns: ColumnDef<Brand>[] = [
  {
    header: "ID",
    cell: ({row})=>(
      <p>{row.index + 1}</p>
    )
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
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
      const brandId = row.original.id;
      return <ActionCell itemId={brandId} item="brand"/>;
    },
  },
]; 