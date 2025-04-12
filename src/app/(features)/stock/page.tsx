"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Stock } from "./columns";
import { PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table";

type Part = {
  id: string;
  part_name: string;
};

type DbSupplier = {
  id: string;
  supplier_name: string;
  supplier_number: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
};

type DisplaySupplier = {
  id: string;
  name: string;
};

type PaginatedResponse = {
  success: boolean;
  data: Stock[];
  pageCount: number;
  message: string;
};

export default function StockPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    part_id: "",
    supplier_id: "",
    quantity: "",
    total_cost: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);

  const utils = api.useUtils();
  const { data: partsResponse, isLoading: partsLoading } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  const { data: suppliers = [], isLoading: suppliersLoading } = api.supplierRoutes.getSuppliers.useQuery();
  
  const { data: stocksResponse, isLoading: stocksLoading } = api.stockRoutes.getPaginatedStocks.useQuery({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    sorting,
    filters: filters.map(filter => ({
      id: filter.id,
      value: String(filter.value)
    })),
  });
  
  // Extract the parts array from the response
  const parts = partsResponse?.success && 'data' in partsResponse ? partsResponse.data : [];
  
  // Extract stocks data and page count
  const stocks = (stocksResponse as PaginatedResponse)?.data ?? [];
  const pageCount = (stocksResponse as PaginatedResponse)?.pageCount ?? 0;
  
  const createStock = api.stockRoutes.createStock.useMutation({
    onSuccess: () => {
      utils.stockRoutes.getPaginatedStocks.invalidate();
      setIsOpen(false);
      setFormData({
        part_id: "",
        supplier_id: "",
        quantity: "",
        total_cost: "",
      });
      toast.success("Stock created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.part_id || !formData.supplier_id) {
      toast.error("Please select both part and supplier");
      return;
    }
    createStock.mutate({
      newStock: {
        part_id: formData.part_id,
        supplier_id: formData.supplier_id,
        quantity: Number(formData.quantity),
        total_cost: Number(formData.total_cost),
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (partsLoading || suppliersLoading || stocksLoading) {
    return (
      <div className="container px-4 py-5 h-full overflow-auto">
        <DataTable 
          columns={columns} 
          data={[]} 
          pageCount={0}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onFiltersChange={setFilters}
          isLoading={true}
          addButton={
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Add Stock</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Stock</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="part_id">Part</Label>
                      <Select
                        value={formData.part_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, part_id: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select part" />
                        </SelectTrigger>
                        <SelectContent>
                          {(parts as Part[]).map((part) => (
                            <SelectItem key={part.id} value={part.id}>
                              {part.part_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="supplier_id">Supplier</Label>
                      <Select
                        value={formData.supplier_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, supplier_id: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {(suppliers as unknown as DbSupplier[]).map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.supplier_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="total_cost">Total Cost</Label>
                      <Input
                        id="total_cost"
                        name="total_cost"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.total_cost}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={createStock.isPending}>
                    {createStock.isPending ? "Creating..." : "Create Stock"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          }
        />
      </div>
    );
  }

  return (
    <div className="container px-4 py-5 h-full overflow-auto">
      <DataTable 
        columns={columns} 
        data={stocks} 
        pageCount={pageCount}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onFiltersChange={setFilters}
        isLoading={false}
        addButton={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Stock</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Stock</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="part_id">Part</Label>
                    <Select
                      value={formData.part_id}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, part_id: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select part" />
                      </SelectTrigger>
                      <SelectContent>
                        {(parts as Part[]).map((part) => (
                          <SelectItem key={part.id} value={part.id}>
                            {part.part_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supplier_id">Supplier</Label>
                    <Select
                      value={formData.supplier_id}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, supplier_id: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {(suppliers as unknown as DbSupplier[]).map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.supplier_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_cost">Total Cost</Label>
                    <Input
                      id="total_cost"
                      name="total_cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.total_cost}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={createStock.isPending}>
                  {createStock.isPending ? "Creating..." : "Create Stock"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
    </div>
  );
} 