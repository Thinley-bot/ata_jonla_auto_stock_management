"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { catalogueFormSchema } from "~/form_schema/catalogue-form"
import { api } from '~/trpc/react'
import { useParams } from 'next/navigation'

export default function Page() {
    const { catalogueid } = useParams<{ catalogueid: string }>();
    const form = useForm({
        resolver: zodResolver(catalogueFormSchema),
        defaultValues: {
            part_name: "",
            part_number: "",
            category_id: "",
            brand_id: "",
            unit_price: 0,
        },
    })

    const { data: catalogue, isLoading: isCatalogueLoading } = api.partCatalogueRoutes.getPartCatalogue.useQuery(catalogueid)
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = api.partCategoryRoutes.getPartCategories.useQuery();
    const { data: brandsResponse, isLoading: isBrandsLoading } = api.carBrandRoutes.getCarBrands.useQuery({});

    const categories = categoriesResponse ?? [];
    const brands = brandsResponse ?? [];

    useEffect(() => {
        if (catalogue && !isCategoriesLoading && !isBrandsLoading) {
            form.reset({
                part_name: catalogue.part_name,
                part_number: catalogue.part_number || "",
                category_id: catalogue.category_id || "",
                brand_id: catalogue.brand_id || "",
                unit_price: +catalogue.unit_price || 0,
            })
        }
    }, [catalogue, form, isCategoriesLoading, isBrandsLoading])

    const onSubmit = (data: any) => {
        console.log(data)
    }

    if (isCatalogueLoading || isCategoriesLoading || isBrandsLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="py-10 px-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className='flex flex-row gap-5'>
                        <FormField
                            control={form.control}
                            name="part_name"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Part Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter part name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="part_number"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Part Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter part number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="brand_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a brand" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                {brand.brand_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="unit_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unit Price</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Enter unit price" 
                                        type="number"
                                        {...field} 
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button type="submit">
                            Update
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
