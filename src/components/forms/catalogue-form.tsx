"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const formSchema = z.object({
  part_name: z.string().min(2, {
    message: "Part name must be at least 2 characters.",
  }),
  part_number: z.string().min(2, {
    message: "Part number must be at least 2 characters.",
  }),
  category_id: z.string({
    required_error: "Please select a category.",
  }),
  brand_id: z.string({
    required_error: "Please select a brand.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CatalogueFormProps {
  closeDialog: () => void;
  initialData?: {
    id: string;
    part_name: string;
    part_number: string;
    category_id: string;
    brand_id: string;
  };
}

export default function CatalogueForm({ closeDialog, initialData }: CatalogueFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      part_name: initialData?.part_name ?? "",
      part_number: initialData?.part_number ?? "",
      category_id: initialData?.category_id ?? "",
      brand_id: initialData?.brand_id ?? "",
    },
  });

  const { data: categoriesResponse } = api.partCategoryRoutes.getPartCategories.useQuery();
  const { data: brandsResponse } = api.carBrandRoutes.getCarBrands.useQuery({});

  const categories = categoriesResponse ?? [];
  const brands = brandsResponse ?? [];

  const utils = api.useUtils();

  const createMutation = api.partCatalogueRoutes.createPartCatalogue.useMutation({
    onSuccess: () => {
      toast.success("Part catalogue created successfully");
      utils.partCatalogueRoutes.getPartCatalogues.invalidate();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = api.partCatalogueRoutes.updatePartCatalogue.useMutation({
    onSuccess: () => {
      toast.success("Part catalogue updated successfully");
      utils.partCatalogueRoutes.getPartCatalogues.invalidate();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(data: FormValues) {
    if (initialData) {
      updateMutation.mutate({
        id: initialData.id,
        updates: data,
      });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <Dialog open onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Part" : "Add New Part"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="part_name"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Part Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter part number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands?.map((brand) => (
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
