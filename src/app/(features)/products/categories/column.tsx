"use client"

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ActionCell from "~/components/ui/actioncell";

export type Category = {
  id: string;
  category_name: string;
  category_desc: string;
  unit: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export const columns: ColumnDef<Category>[] = [
  {
    header: "SI",
    cell : ({row})=>(
      <p>{row.index + 1}</p>
    )
  },
  {
    accessorKey: "category_name",
    header: "Name",
  },
  {
    accessorKey: "category_desc",
    header: "Description",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date | null;
      return  date === null ? "" : date.toLocaleDateString() ;
    },
  },
  {
    header: "Action",
    cell: ({ row, table }) => {
      const categoryId = row.original.id;
      const meta = table.options.meta as { onEdit: (category: Category) => void };
      return (
        <ActionCell
          itemId={categoryId}
          item="category"
        />
      );
    },
  },
]; 
