"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Stock } from "./columns";
import { PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import StockForm from "~/components/forms/stock-form";


type PaginatedResponse = {
  success: boolean;
  data: Stock[];
  pageCount: number;
  message: string;
};

export default function StockPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);

  const { data: stocksResponse, isLoading: stocksLoading } = api.stockRoutes.getPaginatedStocks.useQuery({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    sorting,
    filters: filters.map(filter => ({
      id: filter.id,
      value: String(filter.value)
    })),
  });
  
  // Extract stocks data and page count
  const stocks = (stocksResponse as PaginatedResponse)?.data ?? [];
  const pageCount = (stocksResponse as PaginatedResponse)?.pageCount ?? 0;
  
  if (stocksLoading) {
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
          addButton={null}
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
        addButton={<StockForm />}
      />
    </div>
  );
} 