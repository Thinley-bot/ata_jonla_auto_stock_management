import { ColumnDef } from "@tanstack/react-table";

export type User= {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  role: { id: string; role_name: string } | null;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role.role_name",
    header: "Role",
  },
  {
    accessorKey:"createdAt",
    header:"Created At"
  }
];