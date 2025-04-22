"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ActionCell from "~/components/ui/actioncell";

export interface Sale {
  id: string;
  payment_mode: string | null;
  journal_number: string;
  customer_name:string;
  cid_number:string;
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
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "CID number",
    header: "CID Number",
  },
  {
    accessorKey: "journal_number",
    header: "Journal Number",
  },
  {
    accessorKey: "payment_mode",
    header: "Payment Mode",
  },
  {
    accessorKey: "total_sale",
    header: "Total Sale",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_sale"));
      return amount;
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
      <ActionCell item="sale" itemId={sale.id}/>
      );
    },
  },
]; 
