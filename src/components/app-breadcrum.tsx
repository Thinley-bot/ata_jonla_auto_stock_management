"use client"
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react';

const Breadcrum = () => {
    const pathUrl = usePathname();
    const pathSegments = pathUrl.split("/").filter((segment) => segment !== "");
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLastPath = index === pathSegments.length - 1;
                    const upperCaseSegment = segment.charAt(0)?.toUpperCase() + segment.slice(1);
                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                {isLastPath ? (
                                    <BreadcrumbPage>{upperCaseSegment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink className='flex flex-row justify-center items-center gap-3 '>{upperCaseSegment}<ChevronRight className='h-4 w-4' color='#000'/></BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrum;
