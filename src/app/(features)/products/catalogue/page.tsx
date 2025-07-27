"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { columns } from "./column";
import { DataTable } from "./data_table";
import CatalogueForm from "~/components/forms/catalogue-form";
import { Button } from "~/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";

export default function ProductCataloguePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: catalogueResponse, isLoading } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  console.log("xxxx", catalogueResponse)
  const utils = api.useUtils();
  
  const deleteMutation = api.partCatalogueRoutes.deletePartCatalogue.useMutation({
    onSuccess: () => {
      toast.success("Part catalogue deleted successfully");
      utils.partCatalogueRoutes.getPartCatalogues.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formattedData = (() => {
    if (!catalogueResponse || !catalogueResponse.success) return [];
    
    if ('data' in catalogueResponse) {
      return catalogueResponse.data
        .filter((item) => 
          item.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.part_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.part_category?.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.car_brand?.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item) => ({
          id: item.id,
          name: item.part_name,
          partnumber: item.part_number || "N/A",
          category: item.part_category?.category_name || "N/A",
          brand: item.car_brand?.brand_name || "N/A",
          price: +item.unit_price || 0,
          createdAt: item.createdAt,
        }));
    }
    return [];
  })();

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
          <CirclePlus className="h-4 w-4" />
          Part
        </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={formattedData}
        isLoading={isLoading}
      />

        <CatalogueForm 
          isOpen = {isOpen}
          onClose = {()=>setIsOpen(false)}
        />
    </div>
  );
}
