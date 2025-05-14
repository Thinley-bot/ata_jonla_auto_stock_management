"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSaleSchema } from '~/form_schema/addSale';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { z } from 'zod';
import { CirclePlus } from 'lucide-react';
import { SaleDetailForm } from '~/components/forms/sales-detail-form';

const addSale = () => {
    const [showSaleDetail, setSaleDetail] = useState(false)
    const form = useForm({
        resolver: zodResolver(createSaleSchema),
        defaultValues: {
            payment_mode: "Cash",
            journal_number: "",
            customer_name: "",
            customer_cid: "",
            customer_phone_num: "",
            payment_status: "",
            total_sale: 0,
            total_discount: 0,
            items: [],
        },
    });

    const handleSubmit = (values: z.infer<typeof createSaleSchema>) => {
        console.log(values)
    }
    return (
        <div className="container px-4 py-5 h-full overflow-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="payment_mode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Mode</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payment mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                                                <SelectItem value="Credit">Credit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="customer_phone_num"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Customer phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {form.watch("payment_mode") === "Credit" && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="customer_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Customer full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="payment_status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Paid">Paid</SelectItem>
                                                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        {form.watch("payment_mode") === "Mobile Payment" && <FormField
                            control={form.control}
                            name="journal_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Journal Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Journal Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        }
                    </div>
                </form>
                <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={()=>setSaleDetail(true)}
                >
                    <CirclePlus /> Add Item
                </Button>
                <div className="mt-6 w-full flex justify-end">
                    <Button type="submit" className="w-32">
                        Create Sale
                    </Button>
                </div>
            </Form>
            {showSaleDetail ? <SaleDetailForm isOpen={showSaleDetail} onClose={() => setSaleDetail(false)}/> : ""}
        </div>
    )
}
export default addSale
