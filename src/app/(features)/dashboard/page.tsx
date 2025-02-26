"use client"
import React from 'react'
import { api } from '~/trpc/react';

const page =() => {
  const { data, isLoading ,error} = api.car_brand.getCarBrandById.useQuery("021cff59-be87-482b-b23a-65d1dfc5df6b")
    console.log("oiii",data)
  return (
    <div>page</div>
  )
}

export default page