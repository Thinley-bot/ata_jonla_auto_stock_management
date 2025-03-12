"use client"

import * as React from "react"
import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import { TeamSwitcher } from "~/components/team-switcher"
import {Sidebar,SidebarContent,SidebarFooter,SidebarHeader,SidebarRail,} from "~/components/ui/sidebar"
import logo from "../../public/assets/logo/logo.png"
import {LayoutDashboard, UserRoundCog, ShoppingCart, ShoppingBasket, HandCoins} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title:"Dashboard",
      url:"#",
      icon: LayoutDashboard,
      isActive:false
    },
    {
      title: "User Management",
      url: "#",
      icon: UserRoundCog,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/users",
        },
        {
          title: "Users Report",
          url: "#",
        },
      ],
    },
    {
      title: "Product",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Product Catagory",
          url: "#",
        },
        {
          title: "Car Brand",
          url: "#",
        },
        {
          title: "Product Catalogue",
          url: "#",
        },
      ],
    },
    {
      title: "Stock",
      url: "#",
      icon: ShoppingBasket,
      items: [
        {
          title: "Suppliers",
          url: "#",
        },
        {
          title: "Stocks",
          url: "#",
        },
      ],
    },
    {
      title: "Sales",
      url: "#",
      icon: HandCoins,
      items: [
        {
          title: "Sales",
          url: "#",
        },
        {
          title: "Sales Details",
          url: "#",
        },
        {
          title: "Sales Report",
          url: "#",
        }
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher name="Ata Jonla Stock" logo={logo} plan="Management System"/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
