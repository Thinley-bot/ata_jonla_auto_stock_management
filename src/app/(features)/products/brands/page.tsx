"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { columns, Brand } from "./column";
import { DataTable } from "./data_table";
import { toast } from "sonner";
import { BrandForm } from "~/components/forms/brand-form";
import { useDebounce } from "~/hooks/use-debounce";
import { CirclePlus, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function CarBrandsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const utils = api.useUtils();
  const { data: brandsData, isLoading } = api.carBrandRoutes.getCarBrands.useQuery({
    search: debouncedSearch,
  });
  const createBrand = api.carBrandRoutes.createBrand.useMutation({
    onSuccess: () => {
      utils.carBrandRoutes.getCarBrands.invalidate();
      setIsOpen(false);
      toast.success("Brand created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateBrand = (data: { name: string; description: string }) => {
    createBrand.mutate(data);
  };

  const formattedData: Brand[] = brandsData?.map(brand => ({
    id: brand.id,
    name: brand.brand_name,
    description: brand.brand_desc,
    createdAt: brand.createdAt,
  })) || [];

  return (
    <div className="container px-4 py-5">
      <div className="flex items-center justify-between mb-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search car brands..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-8"
          />
        </div>
       <Button onClick={() => setIsOpen(true)}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add New Brand
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={formattedData}
        isLoading={isLoading}
      />
      <BrandForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateBrand}
      />
    </div>
  );
} 
