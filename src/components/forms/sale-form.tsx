"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { api } from "~/trpc/react";

const saleFormSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  sale_date: z.string().min(1, "Sale date is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  total_amount: z.string().min(1, "Total amount is required"),
  status: z.string().min(1, "Status is required"),
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

interface SaleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function SaleForm({ open, onOpenChange, sale, onClose, onSuccess }: SaleFormProps) {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      invoice_number: "",
      customer_name: "",
      sale_date: new Date().toISOString().split("T")[0],
      payment_method: "cash",
      total_amount: "0",
      status: "pending",
    },
  });

  // Create sale mutation
  const createSaleMutation = api.sales.create.useMutation({
    onSuccess: () => {
      toast.success("Sale created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Error creating sale: ${error.message}`);
    },
  });

  // Update sale mutation
  const updateSaleMutation = api.sales.update.useMutation({
    onSuccess: () => {
      toast.success("Sale updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Error updating sale: ${error.message}`);
    },
  });

  // Reset form when sale changes
  useEffect(() => {
    if (sale) {
      form.reset({
        invoice_number: sale.invoice_number,
        customer_name: sale.customer_name,
        sale_date: new Date(sale.sale_date).toISOString().split("T")[0],
        payment_method: sale.payment_method,
        total_amount: sale.total_amount.toString(),
        status: sale.status,
      });
    } else {
      form.reset({
        invoice_number: "",
        customer_name: "",
        sale_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        total_amount: "0",
        status: "pending",
      });
    }
  }, [sale, form]);

  // Handle form submission
  const onSubmit = (data: SaleFormValues) => {
    const saleData = {
      ...data,
      total_amount: parseFloat(data.total_amount),
    };

    if (sale) {
      updateSaleMutation.mutate({ id: sale.id, ...saleData });
    } else {
      createSaleMutation.mutate(saleData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sale ? "Edit Sale" : "Create Sale"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="invoice_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {sale ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 