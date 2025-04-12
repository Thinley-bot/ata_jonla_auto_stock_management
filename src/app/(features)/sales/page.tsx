"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SaleDetailsRow } from "./sale-details-row";
import { Sale, getSaleColumns } from "./columns";

export default function SalesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: sales = [], isLoading } = api.saleRoutes.getStockSales.useQuery();
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

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSale(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedSale(null);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
  };

  const handleSaveSale = (saleData: any) => {
    if (saleData.id) {
      // Update existing sale
      updateSale.mutate({
        id: saleData.id,
        updates: {
          payment_mode: saleData.payment_mode,
          total_sale: saleData.total_sale,
        },
      });
    } else {
      // Create new sale
      createSale.mutate({
        payment_mode: saleData.payment_mode,
        total_sale: saleData.total_sale,
      });
    }
  };

  // Filter sales based on search query
  const filteredSales = (sales || []).filter((sale) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (sale.payment_mode?.toLowerCase() || "").includes(searchLower) ||
      sale.total_sale.toString().includes(searchLower)
    );
  }) as Sale[];

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
      
      <DataTable<Sale, unknown>
        columns={columns}
        data={filteredSales}
        isLoading={isLoading}
      />

      {selectedSale && (
        <>
          <SaleDetailsRow
            sale={selectedSale}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            onClose={handleCloseDetails}
            mode="view"
          />
          <SaleDetailsRow
            sale={selectedSale}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onClose={handleCloseEdit}
            mode="edit"
            onSaveSale={handleSaveSale}
          />
        </>
      )}
      
      <SaleDetailsRow
        sale={{
          id: "",
          payment_mode: "",
          total_sale: 0,
          details: [],
          createdBy: "",
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: null
        }}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onClose={handleCloseAdd}
        mode="edit"
        onSaveSale={handleSaveSale}
      />
    </div>
  );
} 