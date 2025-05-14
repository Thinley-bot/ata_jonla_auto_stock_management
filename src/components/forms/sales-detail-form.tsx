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
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";
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

interface SalesFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaleDetailForm({
  isOpen,
  onClose,
}: SalesFormProps) {
  const form = useForm({
    defaultValues: {
      product_id: "",
      unit_price: "",
      quantity: "",
      discount: "",
      subtotal: ""
    }
  })

  const { data: products, isLoading } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  console.log(products?.data)

  const handleSubmit = () => {
    console.log("okay")
  }

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
                  name="product_id"
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
                            >
                              {
                                field.value
                                  ? products?.data.find((product) => product.id === field.value)?.part_name
                                  : "Select the product"
                              }
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)]">
                          <Command>
                            <CommandInput placeholder="Search products..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No product found.</CommandEmpty>
                              <CommandGroup>
                                {products?.data.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.part_name}
                                    onSelect={() => {
                                      form.setValue("product_id", product.id);
                                    }}
                                  >
                                    {product.part_name}
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
                        <Input placeholder="Unit Price" {...field} />
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
                        <Input placeholder="Enter quantity" {...field} />
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
                        <Input placeholder="Enter discount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
          <div className="mt-6 w-full flex justify-end">
            <Button type="submit" className="w-32">
              <CirclePlus />Save
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
