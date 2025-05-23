"use client"

import React, { useEffect, useState } from 'react'
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
import { DataTable } from './data-table';
import { columns } from './column';
import { api } from '~/trpc/react';
import toast from 'react-hot-toast';

export interface SaleDetails {
    part_id: string;
    quantity: number;
    unit_price: number;
    discount: number;
    sub_total: number;
}

const AddSale = () => {
    const [showSaleDetail, setShowSaleDetail] = useState<boolean>(false)
    const [saleDetails, setSaleDetails] = useState<SaleDetails[]>([])

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
        },
    });

    const getTotals = () => {
        return saleDetails.reduce(
            (acc, sale) => {
                acc.totalSale += sale.sub_total;
                acc.totalDiscount += sale.discount;
                return acc;
            },
            { totalSale: 0, totalDiscount: 0 }
        );
    };

    useEffect(() => {
        const total = getTotals();
        form.setValue("total_sale", total.totalSale);
        form.setValue("total_discount", total.totalDiscount);
    }, [saleDetails, form]);
    const createSaleMutation = api.saleRoutes.createStockSale.useMutation();
    const createSaleDetailMutation = api.saleDetailRoutes.createStockSaleDetail.useMutation();

    const handleSubmit = (values: z.infer<typeof createSaleSchema>) => {
        createSaleMutation.mutate(values, {
            onSuccess: (saleData) => {
                const saleId = saleData?.data;

                const detailPromises = saleDetails.map((saleDetail) =>
                    createSaleDetailMutation.mutateAsync({
                        ...saleDetail,
                        sale_id: saleId
                    })
                );

                Promise.all(detailPromises)
                    .then(() => {
                        toast.success("All sale records saved successfully");
                    })
                    .catch((error) => {
                        toast.error("Error saving some sale details");
                        console.error(error);
                    });
            },
            onError: (error) => {
                toast.error("Failed to create sale");
                console.error("Error creating sale:", error);
            }
        });
    };

    return (
        <div className="container px-4 py-5 h-full overflow-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 bg-white px-6 py-6 rounded-lg">
                    <div className="flex gap-8">
                        <div className="flex-1 space-y-4">
                            <div className={`grid ${form.watch("payment_mode") === "Mobile Payment" ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
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
                                {form.watch("payment_mode") === "Mobile Payment" && (
                                    <FormField
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
                                )}
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

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="total_discount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Discount</FormLabel>
                                            <FormControl>
                                                <Input disabled {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="total_sale"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Sale Amount</FormLabel>
                                            <FormControl>
                                                <Input disabled {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white">
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => setShowSaleDetail(true)}
                        >
                            <CirclePlus className="mr-2 h-4 w-4" /> Add Item
                        </Button>

                        <DataTable columns={columns} data={saleDetails} />

                        <div className="mt-6 w-full flex justify-end">
                            <Button type="submit" className="w-32">
                                Create Sale
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            {showSaleDetail && (
                <SaleDetailForm
                    isOpen={showSaleDetail}
                    onClose={() => setShowSaleDetail(false)}
                    setSaleDetails={setSaleDetails}
                />
            )}
        </div>
    )
}

export default AddSale;
