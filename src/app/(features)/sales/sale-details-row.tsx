"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { api } from "~/trpc/react";
import { Sale } from "./columns";

const saleDetailsSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit_price: z.string().min(1, "Unit price is required"),
});

const saleSchema = z.object({
  payment_mode: z.string().min(1, "Payment mode is required"),
  total_sale: z.number().min(0, "Total sale must be a positive number"),
  invoice_number: z.string().optional(),
  customer_name: z.string().optional(),
  notes: z.string().optional(),
});

type SaleDetailsValues = z.infer<typeof saleDetailsSchema>;
type SaleValues = z.infer<typeof saleSchema>;

interface SaleDetailsRowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale;
  onClose: () => void;
  mode?: "view" | "edit";
  onSaveSale?: (saleData: any) => void;
}

export function SaleDetailsRow({ open, onOpenChange, sale, onClose, mode = "edit", onSaveSale }: SaleDetailsRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [saleDetails, setSaleDetails] = useState<any[]>([]);

  const saleForm = useForm<SaleValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      payment_mode: sale.payment_mode || "",
      total_sale: Number(sale.total_sale) || 0,
      invoice_number: sale.invoice_number || "",
      customer_name: sale.customer_name || "",
      notes: sale.notes || "",
    },
  });

  const form = useForm<SaleDetailsValues>({
    resolver: zodResolver(saleDetailsSchema),
    defaultValues: {
      product_id: "",
      quantity: "1",
      unit_price: "0",
    },
  });

  // Fetch products for dropdown
  const { data: products } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  
  // Fetch sale details
  const { data: details, refetch: refetchDetails } = api.saleDetailRoutes.getStockSaleDetails.useQuery(
    undefined,
    {
      enabled: open && !!sale.id,
    }
  );

  // Update sale details when data is fetched
  useEffect(() => {
    if (details && Array.isArray(details)) {
      const filteredDetails = details.filter(detail => detail.sale_id === sale.id);
      setSaleDetails(filteredDetails);
      
      // Calculate and update total sale
      const total = filteredDetails.reduce((sum, detail) => sum + (detail.sub_total || 0), 0);
      saleForm.setValue('total_sale', total);
    }
  }, [details, sale.id, saleForm]);

  // Add detail mutation
  const addDetailMutation = api.saleDetailRoutes.createStockSaleDetail.useMutation({
    onSuccess: () => {
      toast.success("Detail added successfully");
      setIsEditing(false);
      setSelectedDetail(null);
      form.reset();
      refetchDetails();
    },
    onError: (error) => {
      toast.error(`Error adding detail: ${error.message}`);
    },
  });

  // Update detail mutation
  const updateDetailMutation = api.saleDetailRoutes.updateStockSaleDetail.useMutation({
    onSuccess: () => {
      toast.success("Detail updated successfully");
      setIsEditing(false);
      setSelectedDetail(null);
      form.reset();
      refetchDetails();
    },
    onError: (error) => {
      toast.error(`Error updating detail: ${error.message}`);
    },
  });

  // Delete detail mutation
  const deleteDetailMutation = api.saleDetailRoutes.deleteStockSaleDetail.useMutation({
    onSuccess: () => {
      toast.success("Detail deleted successfully");
      refetchDetails();
    },
    onError: (error) => {
      toast.error(`Error deleting detail: ${error.message}`);
    },
  });

  // Handle form submission
  const onSubmit = (data: SaleDetailsValues) => {
    const detailData = {
      quantity: parseInt(data.quantity),
      unit_price: parseFloat(data.unit_price),
      sale_id: sale.id,
      part_id: data.product_id,
      sub_total: parseInt(data.quantity) * parseFloat(data.unit_price),
    };

    if (selectedDetail) {
      updateDetailMutation.mutate({
        id: selectedDetail.id,
        updates: {
          quantity: detailData.quantity,
          sale_id: detailData.sale_id,
          part_id: detailData.part_id,
          sub_total: detailData.sub_total,
        },
      });
    } else {
      addDetailMutation.mutate(detailData);
    }
  };

  // Handle sale form submission
  const onSaleSubmit = (data: SaleValues) => {
    if (onSaveSale) {
      onSaveSale({
        ...sale,
        ...data,
      });
    }
    onClose();
  };

  // Handle edit detail
  const handleEditDetail = (detail: any) => {
    setSelectedDetail(detail);
    setIsEditing(true);
    form.reset({
      product_id: detail.part_id,
      quantity: detail.quantity.toString(),
      unit_price: detail.unit_price.toString(),
    });
  };

  // Handle delete detail
  const handleDeleteDetail = (detail: any) => {
    if (confirm("Are you sure you want to delete this detail?")) {
      deleteDetailMutation.mutate(detail.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Sale Details - Invoice #{sale.invoice_number || sale.id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Sale Form */}
          <div>
            <Form {...saleForm}>
              <form onSubmit={saleForm.handleSubmit(onSaleSubmit)} className="space-y-4">
                <FormField
                  control={saleForm.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter invoice number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleForm.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter customer name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleForm.control}
                  name="payment_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          {...field}
                        >
                          <option value="">Select a payment mode</option>
                          <option value="Cash">Cash</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Mobile Money">Mobile Money</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleForm.control}
                  name="total_sale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Sale</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          disabled
                          value={field.value.toFixed(2)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="mt-4"
                  >
                    + Add Item
                  </Button>
                </div>

                <FormField
                  control={saleForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter any additional notes" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {sale.id ? "Update Sale" : "Create Sale"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>

          {/* Sale Details */}
          <div>
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="product_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            {...field}
                          >
                            <option value="">Select a product</option>
                            {(products as { success: boolean; data: Array<{ id: string; part_name: string }> })?.data?.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.part_name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // Auto-calculate subtotal when quantity changes
                              const quantity = parseInt(e.target.value);
                              const unitPrice = parseFloat(form.getValues("unit_price"));
                              if (!isNaN(quantity) && !isNaN(unitPrice)) {
                                const subtotal = quantity * unitPrice;
                                form.setValue("sub_total", subtotal.toString());
                              }
                            }}
                          />
                        </FormControl>
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
                            type="number" 
                            step="0.01" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // Auto-calculate subtotal when unit price changes
                              const unitPrice = parseFloat(e.target.value);
                              const quantity = parseInt(form.getValues("quantity"));
                              if (!isNaN(unitPrice) && !isNaN(quantity)) {
                                const subtotal = quantity * unitPrice;
                                form.setValue("sub_total", subtotal.toString());
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedDetail(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedDetail ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <>
                <div className="mb-4">
                  <Button onClick={() => setIsEditing(true)}>Add Detail</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saleDetails.length > 0 ? (
                      saleDetails.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell>{detail.part?.part_name ?? "Unknown Product"}</TableCell>
                          <TableCell>{detail.quantity}</TableCell>
                          <TableCell>${(detail.unit_price ?? 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ${((detail.unit_price ?? 0) * (detail.quantity ?? 0)).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditDetail(detail)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteDetail(detail)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No details found for this sale.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}