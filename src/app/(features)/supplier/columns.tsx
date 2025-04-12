"use client";

import { ColumnDef } from "@tanstack/react-table";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import ActionCell from "~/components/ui/actioncell";

export type Supplier = {
  id: string;
  supplier_name: string;
  supplier_number: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
};

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "supplier_name",
    header: "Supplier Name",
  },
  {
    accessorKey: "supplier_number",
    header: "Supplier Number",
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
      const supplier = row.original;
      const utils = api.useUtils();

      const deleteSupplier = api.supplierRoutes.deleteSupplier.useMutation({
        onSuccess: () => {
          utils.supplierRoutes.getPaginatedSuppliers.invalidate();
          toast.success("Supplier deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });

      const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
          deleteSupplier.mutate({ id: supplier.id });
        }
      };

      return (
        <ActionCell 
          item="supplier" 
          itemId={supplier.id} 
          onEdit={() => {
            // Handle edit functionality
            console.log("Edit supplier", supplier.id);
          }} 
        />
      );
    },
  },
]; 