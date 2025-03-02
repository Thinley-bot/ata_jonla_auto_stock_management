"use client"
import React from 'react'
import { api } from '~/trpc/react';

const page =() => {
  const { data, isLoading ,error} = api.partCatalogueRoutes.getPartCatalogues.useQuery();
    console.log("oiii",data)
  return (
    <div>page</div>
  )
}

export default page