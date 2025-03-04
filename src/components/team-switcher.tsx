"use client"

import { StaticImageData } from "next/image"
import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({name,logo,plan}:{
    name: string
    logo:  StaticImageData
    plan: string
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Image src={logo} height={35} width={35} alt="logo"/>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {name}
                </span>
                <span className="truncate text-xs">{plan}</span>
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
