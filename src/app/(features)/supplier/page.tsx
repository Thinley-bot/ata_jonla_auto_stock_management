"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { columns, Supplier } from "./columns";
import { DataTable } from "./data-table";
import { PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { SupplierForm } from "../../../components/forms/supplier-form";

type PaginatedResponse = {
  success: boolean;
  data: Supplier[];
  pageCount: number;
  message: string;
};

export default function SupplierPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);

  const { data: suppliersResponse, isLoading: suppliersLoading } = api.supplierRoutes.getPaginatedSuppliers.useQuery({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    sorting,
    filters: filters.map(filter => ({
      id: filter.id,
      value: String(filter.value)
    })),
  });

  const suppliers = (suppliersResponse as PaginatedResponse)?.data ?? [];
  const pageCount = (suppliersResponse as PaginatedResponse)?.pageCount ?? 0;

  return (
    <div className="container px-4 py-5 h-full overflow-auto">
      <DataTable 
        columns={columns} 
        data={suppliers} 
        pageCount={pageCount}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onFiltersChange={setFilters}
        isLoading={false}
        addButton={<SupplierForm />}
      />
    </div>
  );
} 
