"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import ActionCell from "~/components/ui/actioncell";

export type Stock = {
  id: string;
  quantity: number;
  total_cost: number;
  part_id: string;
  supplier_id: string;
  part: {
    id: string;
    part_name: string;
  };
  supplier: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
};

export const columns: ColumnDef<Stock>[] = [
  {
    id: "partName",
    accessorFn: (row) => row.part.part_name,
    header: "Part Name",
  },
  {
    id: "supplierName",
    accessorFn: (row) => row.supplier.name,
    header: "Supplier",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "total_cost",
    header: "Total Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_cost"))
      return amount;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const stock = row.original;
      const utils = api.useUtils();

      const deleteStock = api.stockRoutes.deleteStock.useMutation({
        onSuccess: () => {
          utils.stockRoutes.getPaginatedStocks.invalidate();
          toast.success("Stock deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });

      return (
        <ActionCell 
          item="stock" 
          itemId={stock.id} 
        />
      );
    },
  },
]; 