"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableRowActions } from "~/components/ui/data-table-row-actions";

export interface Sale {
  id: string;
  payment_mode: string | null;
  total_sale: Number;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  invoice_number?: string;
  details?: any[];
}

interface SaleColumnsProps {
  onViewDetails: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

export const getSaleColumns = ({
  onViewDetails,
  onEdit,
  onDelete,
}: SaleColumnsProps): ColumnDef<Sale>[] => [
  {
    accessorKey: "payment_mode",
    header: "Payment Mode",
  },
  {
    accessorKey: "total_sale",
    header: "Total Sale",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_sale"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPP"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "View Details",
              onClick: () => onViewDetails(sale),
            },
            {
              label: "Edit",
              onClick: () => onEdit(sale),
            },
            {
              label: "Delete",
              onClick: () => onDelete(sale.id),
              className: "text-red-600",
            },
          ]}
        />
      );
    },
  },
]; 