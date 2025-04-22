"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Sale, getSaleColumns } from "./columns";
import { DataTable } from "./data_table";

export default function SalesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: sales, isLoading } = api.saleRoutes.getStockSales.useQuery();
  console.log("This is the sales data",sales)
  const deleteSale = api.saleRoutes.deleteStockSale.useMutation({
    onSuccess: () => {
      toast.success("Sale deleted successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete sale");
    },
  });

  const createSale = api.saleRoutes.createStockSale.useMutation({
    onSuccess: (data) => {
      toast.success("Sale created successfully");
      setIsAddOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create sale");
    },
  });

  const updateSale = api.saleRoutes.updateStockSale.useMutation({
    onSuccess: () => {
      toast.success("Sale updated successfully");
      setIsEditOpen(false);
      setSelectedSale(null);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update sale");
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteSale.mutateAsync({ id });
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailsOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
  };

  const handleSaveSale = (saleData: any) => {
    if (saleData.id) {
      updateSale.mutate({
        id: saleData.id,
        updates: {
          payment_mode: saleData.payment_mode,
          total_sale: saleData.total_sale,
        },
      });
    } else {
      createSale.mutate({
        payment_mode: saleData.payment_mode,
        total_sale: saleData.total_sale,
      });
    }
  };


  const columns = getSaleColumns({
    onViewDetails: handleViewDetails,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full">
          <Input
            placeholder="Search sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAdd}>Add Sale</Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        // data={filteredSales}
        isLoading={isLoading}
      />
    </div>
  );
} 
