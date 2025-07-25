"use client"

import React from 'react'
import { useParams } from 'next/navigation'

const page = () => {
  const {categoryid}= useParams<{categoryid:string}>()
  return (
    <div></div>
  )
}

export default page;
