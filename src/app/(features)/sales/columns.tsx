"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ActionCell from "~/components/ui/actioncell";

export interface Sale {
  id: string;
  payment_mode: string | null;
  journal_number: string;
  customer_name:string;
  customer_phone_num:string;
  cid_number:string;
  total_sale: Number;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  invoice_number?: string;
}

export const Columns: ColumnDef<Sale>[] = [
  {
    header:"ID",
    cell: ({row}) => <div>{row.index + 1}</div>
  },
  {
    header:"Phone Number",
    accessorKey: "customer_phone_num"
  },
  {
    accessorKey: "payment_mode",
    header: "Payment Mode",
  },
  {
    accessorKey: "journal_number",
    header: "Journal Number",
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
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "customer_cid",
    header: "CID Number",
  },
  {
    id: "actions",
    header:"Actions",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <ActionCell item="sale" itemId={sale.id} />
      );
    },
  },
];
