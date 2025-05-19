"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";
import { api } from "~/trpc/react";
import { ChevronsUpDown, CirclePlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { CommandGroup } from "cmdk";
import { cn } from "~/lib/utils";


interface SalesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof createSaleSchema>) => void;
}

// Schema for sale details matching backend schema
const itemsSchema = z.object({
  part_id: z.string(),
  quantity: z.number().min(1, { message: "The quantity should be greater than 1." }),
  discount: z.number().min(0, { message: "Discount cannot be negative" }).default(0),
  sub_total: z.number().min(0, { message: "The subtotal should be greater than 0." }),
  unit_price: z.number().min(0, { message: "Unit price must be a positive number" })
});

// Schema for creating a new sale matching backend schema
export const createSaleSchema = z.object({
  payment_mode: z.enum(["Cash", "Mobile Payment", "Credit"], {
    required_error: "Payment mode is required",
  }),
  journal_number: z.string().optional(),
  customer_name: z.string().optional(),
  customer_cid: z.string().optional(),
  customer_phone_num: z
    .string()
    .min(8, { message: "The phone number should have eight digits." }),
  payment_status: z.string().optional(),
  total_sale: z.number().min(0, "Total sale must be a positive number"),
  total_discount: z
    .number()
    .min(0, "The discount amount should be greater than 0")
    .default(0),
  items: z.array(itemsSchema)
    .min(1, { message: "At least one item is required" })
}).superRefine((data, ctx) => {
  if (data.payment_mode === "Credit" && !data.payment_status) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Payment status is required when payment mode is Credit",
      path: ["payment_status"]
    });
  }
  if (data.payment_mode === "Mobile Payment" && !data.journal_number) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Journal number is required for mobile payment",
      path: ["journal_number"]
    });
  }
});

export function SalesForm({
  isOpen,
  onClose,
  onSubmit,
}: SalesFormProps) {
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

  const [items, setItems] = useState<z.infer<typeof itemsSchema>[]>([]);

  const handleItemChange = (index: number, field: keyof z.infer<typeof itemsSchema>, value: string | number) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const updatedItems = [...items];
    if (!updatedItems[index]) {
      updatedItems[index] = {
        sale_id: crypto.randomUUID(),
        part_id: "",
        quantity: 1,
        discount: 0,
        sub_total: 0
      };
    }
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'discount' || field === 'sub_total' ? numericValue : value
    };

    // Calculate sub_total when quantity or discount changes
    if (field === 'quantity' || field === 'discount') {
      const selectedProduct = products.find(p => p.id === updatedItems[index].part_id);
      const quantity = Number(updatedItems[index].quantity) || 0;
      const discount = Number(updatedItems[index].discount) || 0;
      const unitPrice = Number(selectedProduct?.unit_price) || 0;
      const subTotal = (unitPrice * quantity) - (discount * quantity);
      updatedItems[index].sub_total = subTotal;
    }

    setItems(updatedItems);
    form.setValue("items", updatedItems);

    // Update total sale and total discount
    const totalSale = updatedItems.reduce((sum, item) => sum + (item.sub_total || 0), 0);
    const totalDiscount = updatedItems.reduce((sum, item) => sum + ((item.discount || 0) * (item.quantity || 0)), 0);
    form.setValue("total_sale", totalSale);
    form.setValue("total_discount", totalDiscount);
  };

  const addItem = () => {
    const newItem: z.infer<typeof itemsSchema> = {
      part_id: "",
      quantity: 1,
      discount: 0,
      sub_total: 0
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    form.setValue("items", newItems);
  };

  const createSale = api.saleRoutes.createSale.useMutation();

  const handleSubmit = async (data: z.infer<typeof createSaleSchema>) => {
    try {
      // Ensure all required fields are present
      if (items.length === 0) {
        form.setError('items', { message: 'At least one item is required' });
        return;
      }

      // Validate all items have required fields and proper numeric values
      const validItems = await Promise.all(items.map(async item => {
        const product = products.find(p => p.id === item.part_id);
        if (!product) return false;

        // Validate stock availability
        if (product.stock < item.quantity) {
          form.setError(`items.${items.indexOf(item)}.quantity`, {
            message: `Only ${product.stock} items available in stock`
          });
          return false;
        }

        return (
          item.part_id &&
          typeof item.quantity === 'number' && item.quantity > 0 &&
          typeof item.sub_total === 'number' && item.sub_total >= 0
        );
      }));

      if (!validItems.every(Boolean)) {
        if (!form.getFieldState('items').error) {
          form.setError('items', { message: 'All items must have valid part, quantity, and price' });
        }
        return;
      }

      // Validate payment mode specific requirements
      if (data.payment_mode === 'Credit' && !data.payment_status) {
        form.setError('payment_status', { message: 'Payment status is required for credit payment' });
        return;
      }
      if (data.payment_mode === 'Mobile Payment' && !data.journal_number) {
        form.setError('journal_number', { message: 'Journal number is required for mobile payment' });
        return;
      }

      // Calculate final totals
      const totalDiscount = items.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
      const totalSale = items.reduce((sum, item) => sum + item.sub_total, 0);

      // Prepare the final data
      const saleData = {
        ...data,
        total_discount: totalDiscount,
        total_sale: totalSale,
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          discount: Number(item.discount),
          sub_total: Number(item.sub_total),
          unit_price: Number(products.find(p => p.id === item.part_id)?.unit_price || 0)
        }))
      };

      // First create the sale header
      const saleResponse = await createSale.mutateAsync({
        payment_mode: data.payment_mode,
        journal_number: data.journal_number,
        customer_name: data.customer_name,
        customer_cid: data.customer_cid,
        customer_phone_num: data.customer_phone_num,
        payment_status: data.payment_status,
        total_sale: data.total_sale,
        total_discount: data.total_discount,
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          discount: Number(item.discount),
          sub_total: Number(item.sub_total),
          unit_price: Number(products.find(p => p.id === item.part_id)?.unit_price || 0)
        }))
      });

      if (saleResponse.success) {
        onSubmit(saleData);
        form.reset(); // Reset form after successful submission
        setItems([]); // Clear items
        onClose(); // Close the dialog
      } else {
        form.setError('root', { message: 'Failed to create sale. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting sale:', error);
      form.setError('root', { message: 'Failed to submit sale. Please try again.' });
    }
  };

  const { data: productsResponse, isLoading } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  const products = productsResponse?.success && 'data' in productsResponse ? productsResponse.data : [];
  console.log(products)

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.part_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create New Sale</DialogTitle>
        </DialogHeader>
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

            <div className="w-[45%] space-y-4 border-l pl-4">
              <div className="flex justify-between items-center">
                <Label>Sale Details</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <CirclePlus className="w-4 h-4 mr-2" />Add Item
                </Button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div key={item.sale_id} className="p-4 border rounded-lg space-y-3">
                    <FormField
                      name={`items.${index}.part_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Part</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                  {field.value ? products.find((product) => product.id === field.value)?.part_name : "Choose the part"}
                                  <ChevronsUpDown className="opacity-50" />
                                 </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)]">
                              <Command className="w-full">
                                <CommandInput
                                  placeholder="Type to search parts..."
                                  className="w-full"
                                  value={searchQuery}
                                  onValueChange={setSearchQuery}
                                  autoFocus
                                />
                                <CommandList>
                                  <CommandEmpty>No part found.</CommandEmpty>
                                  <CommandGroup>
                                    {filteredProducts.map((product) => (
                                      <CommandItem
                                        key={`product-${product.id}`}
                                        value={product.part_name}
                                        onSelect={() => {
                                          const selectedProduct = products.find(p => p.id === product.id);
                                          if (selectedProduct) {
                                            handleItemChange(index, 'part_id', product.id);
                                            field.onChange(product.id);
                                            
                                            // Update subtotal based on selected product's unit price
                                            const quantity = items[index]?.quantity || 1;
                                            const discount = items[index]?.discount || 0;
                                            const subTotal = (selectedProduct.unit_price * quantity) - (discount * quantity);
                                            handleItemChange(index, 'sub_total', subTotal);
                                          }
                                        }}
                                      >
                                        <div className="flex justify-between w-full">
                                          <span>{product.part_name}</span>
                                          <span className="text-muted-foreground">${Number(product.unit_price || 0).toFixed(2)}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unit_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={products.find(p => p.id === item.part_id)?.unit_price || 0}
                                disabled
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Quantity"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleItemChange(index, 'quantity', e.target.valueAsNumber || 1);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.discount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount per item</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Discount"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleItemChange(index, 'discount', e.target.valueAsNumber || 0);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <FormLabel>Sub Total</FormLabel>
                        <div className="text-lg font-semibold">
                          ${item.sub_total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between items-center">
                  <FormLabel>Total Discount</FormLabel>
                  <div className="text-lg">
                    ${(form.watch('total_discount') ?? 0).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <FormLabel>Total Sale</FormLabel>
                  <div className="text-lg font-bold">
                    ${(form.watch('total_sale') ?? 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="mt-6 w-full flex justify-end">
            <Button type="submit" className="w-32" onClick={form.handleSubmit(handleSubmit)}>
              Create Sale
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
