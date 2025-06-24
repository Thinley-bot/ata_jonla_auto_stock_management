"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, CirclePlus, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "~/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemsSchema } from "~/form_schema/addSale";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface SalesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export function SaleDetailForm({
  isOpen,
  onClose,
  onSave,
}: SalesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const form = useForm({
    resolver: zodResolver(itemsSchema),
    defaultValues: {
      part_id: "",
      unit_price: 0,
      quantity: 1,
      discount: 0,
      sub_total: 0
    }
  });

  const { data: productResponse, isLoading, error } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  const isProductResponseSuccess = productResponse?.success === true;
  const products = isProductResponseSuccess && 'data' in productResponse ? productResponse.data : [];

  useEffect(() => {
    if (error || (productResponse && !isProductResponseSuccess)) {
      toast.error( error?.message || productResponse?.message || "Failed to load products")
    }
  }, [error, productResponse, isProductResponseSuccess]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.part_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    const calculateSubtotal = () => {
      const values = form.getValues();
      const quantity = Number(values.quantity) || 0;
      const unitPrice = Number(values.unit_price) || 0;
      const discount = Number(values.discount) || 0;
      
      if (quantity > 0 && unitPrice > 0) {
        const subtotal = (quantity * unitPrice) - discount;
        form.setValue("sub_total", subtotal > 0 ? subtotal : 0, { 
          shouldValidate: true,
          shouldDirty: false
        });
      }
    };

    const fields = ["quantity", "unit_price", "discount"];
    fields.forEach(field => {
      form.register(field, {
        onChange: () => calculateSubtotal()
      });
    });
  }, [form]);

  const handleProductSelect = (productId: string) => {
    form.setValue("part_id", productId);
    const selectedProduct = products.find(product => product.id === productId);
    if (selectedProduct) {
      form.setValue("unit_price", Number(selectedProduct.unit_price));
    }
  };

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    try {
      if (onSave) {
        onSave(data);
      }
      form.reset();
      onClose();
    } catch (error) {
      toast("Failed to save sale detail");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create New Sale Detail</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-8">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="part_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={isSubmitting}
                              >
                                {
                                  field.value
                                    ? products.find((product) => product.id === field.value)?.part_name
                                    : "Select the product"
                                }
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)]">
                            <Command className="z-50">
                              <CommandInput 
                                placeholder="Search products..." 
                                className="h-9" 
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                autoFocus
                              />
                              <CommandList>
                                <CommandEmpty>No product found.</CommandEmpty>
                                <CommandGroup>
                                  {filteredProducts.map((product) => (
                                      <CommandItem
                                        key={product.id}
                                        value={product.part_name}
                                        onSelect={() => {
                                          handleProductSelect(product.id);
                                          setSearchQuery("");
                                        }}
                                      >
                                        <div className="flex justify-between w-full">
                                          <span>{product.part_name}</span>
                                          <span className="text-muted-foreground">${Number(product.unit_price || 0).toFixed(2)}</span>
                                        </div>
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            product.id === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
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
                  <FormField
                    control={form.control}
                    name="unit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Unit Price" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                            placeholder="Enter quantity" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Enter discount" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="sub_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtotal</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          readOnly 
                          className="bg-muted" 
                          {...field} 
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-6 w-full flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-32" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CirclePlus className="mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
