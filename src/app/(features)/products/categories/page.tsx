"use client";

import { useState } from "react";
import { columns } from "./column";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import type { Category } from "./column";
import { CategoryForm } from "~/components/forms/category-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { Input } from "~/components/ui/input";

export default function Page() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading } = api.partCategoryRoutes.getPartCategories.useQuery();

  const formattedData: Category[] = categories?.map((category) => ({
    id: category.id,
    category_name: category.category_name,
    category_desc: category.category_desc,
    unit: category.unit,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  })) || [];

  // Filter data based on search query
  const filteredData = searchQuery
    ? formattedData.filter((category) =>
        category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : formattedData;

  return (
    <div className="container px-4 py-5">
      <div className="flex items-center justify-between mb-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <div className="mt-2">
        <DataTable
          columns={columns}
          data={filteredData}
        />
      </div>
      <CategoryForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async () => {}}
      />
      {selectedCategory && (
        <CategoryForm
          isOpen={true}
          onClose={() => setSelectedCategory(null)}
          onSubmit={async () => {}}
          initialData={{
            id: selectedCategory.id,
            name: selectedCategory.category_name,
            description: selectedCategory.category_desc,
            unit: selectedCategory.unit,
          }}
        />
      )}
    </div>
  );
}
