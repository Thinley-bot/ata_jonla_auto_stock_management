"use client"
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import ActionCell from "~/components/ui/actioncell";

export type User= {
  id: string;
  name: string | null;
  email: string;
  image: string;
  createdAt: Date;
  role: { id: string; role_name: string } | null;
};


export const columns: ColumnDef<User>[] = [
  {
    accessorKey:"image",
    header:"Image",
    cell:({ row }) => {
      const imageSrc = row.getValue("image");
      return imageSrc && typeof imageSrc === "string" && imageSrc !== "" ? (
        <Image src={imageSrc} height={50} width={50} alt="user image" className="rounded-full"/>
      ) : (
        <span>No image</span>
      );
    },
  },
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
  },
  {
    header:"Action",
    cell: ({ row }) => {
      const userId = row.original.id;
      return <ActionCell itemId={userId} item="user"/>;
    }
  }
];