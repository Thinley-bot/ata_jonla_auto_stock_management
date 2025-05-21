"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname();
  
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach(item => {
      if (item.isActive) {
        initial[item.title] = true;
      }
    });
    return initial;
  });

  const toggleItem = useCallback((title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  }, []);

  useEffect(() => {
    const newOpenItems: Record<string, boolean> = { ...openItems };
    let hasChanges = false;
    
    items.forEach(item => {
      const isActive = pathname === item.url || 
        item.items?.some(subItem => pathname === subItem.url) ||
        item.items?.some(subItem => pathname.startsWith(subItem.url + '/'));
      
      if (isActive && !openItems[item.title]) {
        newOpenItems[item.title] = true;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setOpenItems(newOpenItems);
    }
  }, [pathname, items, openItems]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {!item.items ? (
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <Collapsible
                open={openItems[item.title]}
                onOpenChange={() => toggleItem(item.title)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild className={`${pathname.startsWith(subItem.url) ? "bg-gray-200" : ""}`}>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
