import "server-only";

import {columns } from "./column";
import { DataTable } from "./data_table";
import type { AppRouter } from "~/server/api/root";
import { inferRouterOutputs } from "@trpc/server";
import { api, HydrateClient } from "~/trpc/server";
import { SearchParams } from "next/dist/server/request/search-params";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type GetUsersOutput = RouterOutputs["userRoutes"]["getUsers"];

async function getData(): Promise<GetUsersOutput> {
  return await api.userRoutes.getUsers();
}

export default async function Page({params}:{params:Promise<SearchParams>}) {
  const data = await getData(); 
  return (
    <HydrateClient>
      <div className="container px-4 py-5">
        <DataTable columns={columns} data={data} />
      </div>
    </HydrateClient>
  );
}