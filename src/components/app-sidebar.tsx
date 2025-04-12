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
      url:"/dashboard",
      icon: LayoutDashboard,
      isActive: true
    },
    {
      title: "User Management",
      url: "/users",
      icon: UserRoundCog,
      isActive: false,
      items: [
        {
          title: "Users",
          url: "/users",
        },
      ],
    },
    {
      title: "Product",
      url: "/products",
      icon: ShoppingCart,
      isActive: false,
      items: [
        {
          title: "Product Categories",
          url: "/products/categories",
        },
        {
          title: "Car Brands",
          url: "/products/brands",
        },
        {
          title: "Product Catalogue",
          url: "/products/catalogue",
        },
      ],
    },
    {
      title: "Stock",
      url: "/stock",
      icon: ShoppingBasket,
      isActive: false,
      items: [
        {
          title: "Stock",
          url: "/stock",
        },
        {
          title: "Supplier",
          url: "/supplier",
        },
      ],
    },
    {
      title: "Sales",
      url: "/sales",
      icon: HandCoins,
      isActive: false,
      items: [
        {
          title: "Sales",
          url: "/sales",
        },
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
