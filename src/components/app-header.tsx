import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import Breadcrum from './app-breadcrum'

const Header = () => {
    return (
        <div className='px-4'>
        <header className="mt-2 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border border-[hsl(var(--sidebar-border))] rounded-lg bg-sidebar">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrum/>
            </div>
        </header>
        </div>
    )
}

export default Header