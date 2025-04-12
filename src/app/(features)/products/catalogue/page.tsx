"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { createColumns } from "./column";
import { DataTable } from "./data_table";
import CatalogueForm from "~/components/forms/catalogue-form";
import { Button } from "~/components/ui/button";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";

export default function ProductCataloguePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatalogue, setSelectedCatalogue] = useState<{
    id: string;
    part_name: string;
    part_number: string;
    category_id: string;
    brand_id: string;
  } | null>(null);

  const { data: catalogueResponse, isLoading } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  const deleteMutation = api.partCatalogueRoutes.deletePartCatalogue.useMutation({
    onSuccess: () => {
      toast.success("Part catalogue deleted successfully");
      utils.partCatalogueRoutes.getPartCatalogues.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const utils = api.useUtils();

  const handleEdit = (catalogue: {
    id: string;
    name: string;
    sku: string;
    category: string;
    brand: string;
  }) => {
    setSelectedCatalogue({
      id: catalogue.id,
      part_name: catalogue.name,
      part_number: catalogue.sku,
      category_id: catalogue.category,
      brand_id: catalogue.brand,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this part catalogue?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const formattedData = (() => {
    if (!catalogueResponse || !catalogueResponse.success) return [];
    
    if ('data' in catalogueResponse) {
      return catalogueResponse.data
        .filter((item) => 
          item.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.part_category?.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.car_brand?.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item) => ({
          id: item.id,
          name: item.part_name,
          sku: item.part_number,
          category: item.part_category?.category_name || "N/A",
          brand: item.car_brand?.brand_name || "N/A",
          price: 0,
          stock: 0,
          reorderLevel: 0,
          createdAt: item.createdAt,
        }));
    }
    return [];
  })();

  // Create columns with the action column logic now in column.tsx
  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="container px-4 py-5">
      <div className="flex items-center justify-between mb-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Part
        </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={formattedData}
        isLoading={isLoading}
      />

      {isOpen && (
        <CatalogueForm 
          closeDialog={() => {
            setIsOpen(false);
            setSelectedCatalogue(null);
          }}
          initialData={selectedCatalogue || undefined}
        />
      )}
    </div>
  );
} 