"use client";

import { columns } from "./column";
import { DataTable } from "./data_table";
import { api } from "~/trpc/react";
import { User } from "./column";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | undefined>();
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const { data: userData, isLoading, refetch } = api.userRoutes.getUsers.useQuery({
    limit: 10,
    direction,
    cursor,
    search: search || undefined,
  });

  const formattedData: User[] = userData?.items?.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image || "",
    createdAt: user.createdAt,
    role: user.role ? {
      id: user.role.id,
      role_name: user.role.role_name || ""
    } : null
  })) || [];

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setCursor(undefined);
    setDirection("next");
  };

  const handlePageChange = (newDirection: "next" | "prev") => {
    setDirection(newDirection);
    if (newDirection === "next") {
      setCursor(userData?.nextCursor);
    } else {
      setCursor(userData?.prevCursor);
    }
  };
  
  return (
    <div className="container px-4 py-5">
      <DataTable 
        columns={columns} 
        data={formattedData}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        hasNextPage={!!userData?.nextCursor}
        hasPrevPage={!!userData?.prevCursor}
        isLoading={isLoading}
      />
    </div>
  );
}
