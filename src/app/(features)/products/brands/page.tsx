"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { columns, Brand } from "./column";
import { DataTable } from "./data_table";
import { toast } from "sonner";
import { BrandForm } from "~/components/forms/brand-form";
import { useDebounce } from "~/hooks/use-debounce";

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
      <DataTable 
        columns={columns} 
        data={formattedData}
        searchKey="name"
        isLoading={isLoading}
        onAddNew={() => setIsOpen(true)}
      />

      <BrandForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateBrand}
      />
    </div>
  );
} 
