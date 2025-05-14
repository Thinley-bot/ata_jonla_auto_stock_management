"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { DataTable } from "./data_table";
import { Columns } from "./columns"

export default function SalesPage() {
  const [search, setSearch] = useState<string>("")
  const [cursor, setCursor] = useState<string | undefined>("")
  const [direction, setDirection] = useState<"next" | "prev">("next")
  
  const input = {
    search,
    limit: 10,
    cursor,
    direction
  }

  const { data: sales, isLoading } = api.saleRoutes.getStockSales.useQuery(input);

  return (
    <div className="container px-4 py-5">
      <DataTable
        columns={Columns}
        data={sales?.items ?? []}
        isLoading={isLoading}
        search = {search}
        setSearch={setSearch}
      />
    </div>
  );
} 
