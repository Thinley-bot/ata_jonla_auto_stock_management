"use client";

import { columns } from "./column";
import { DataTable } from "./data_table";
import { api } from "~/trpc/react";
import { User } from "./column";
import { useState, useMemo } from "react";
import AddUserForm from "~/components/forms/user-form";

export default function Page() {
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | undefined>();
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);

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
  
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleCloseUserForm = () => {
    setSelectedUser(null);
    setShowUserForm(false);
    refetch();
  };
  
  // Use useMemo to create the columns array only when handleViewUser changes
  const userColumns = useMemo(() => columns(handleViewUser), [handleViewUser]);
  
  return (
    <div className="container px-4 py-5">
      <DataTable 
        columns={userColumns}
        data={formattedData}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        hasNextPage={!!userData?.nextCursor}
        hasPrevPage={!!userData?.prevCursor}
        isLoading={isLoading}
      />
      
      {showUserForm && selectedUser && (
        <AddUserForm 
          closeDialog={handleCloseUserForm} 
          user={{
            id: selectedUser.id,
            name: selectedUser.name || "",
            email: selectedUser.email,
            image_url: selectedUser.image,
            role_id: selectedUser.role?.id || "",
          }}
        />
      )}
    </div>
  );
}
