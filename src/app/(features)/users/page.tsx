import "server-only";

import {columns } from "./column";
import { DataTable } from "./data_table";
import type { AppRouter } from "~/server/api/root";
import { inferRouterOutputs } from "@trpc/server";
import { api, HydrateClient } from "~/trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type GetUsersOutput = RouterOutputs["userRoutes"]["getUsers"];

async function getInitialData(): Promise<GetUsersOutput> {
  return await api.userRoutes.getUsers({ limit: 10, direction:"next"});
}

export default async function Page() {
  const initialData = await getInitialData();
  console.log(initialData)
  return (
    <HydrateClient>
      <div className="container px-4 py-5">
        <DataTable columns={columns} data={initialData} />
      </div>
    </HydrateClient>
  );
}