import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  part_id: z.string().min(1, { message: 'Part is required' }),
  supplier_id: z.string().min(1, { message: 'Supplier is required' }),
  quantity: z
    .number()
    .min(1, { message: 'Quantity must be at least 1' })
    .positive({ message: 'Quantity must be positive' }),
  total_cost: z
    .number()
    .min(0, { message: 'Total cost cannot be negative' })
    .positive({ message: 'Total cost must be positive' }),
  category: z.string().optional(),
});

// Define the types for form values
type FormValues = z.infer<typeof formSchema>;

// Define interfaces for the parts and suppliers
interface Part {
  id: string;
  part_name: string;
}

interface Supplier {
  id: string;
  supplier_name: string;
}

// Define the props interface for StockForm
interface StockFormProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const StockForm = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }: StockFormProps) => {
  const [isOpen, setIsOpen] = React.useState(propIsOpen || false);
  
  // Use the provided setIsOpen function or the local one
  const handleOpenChange = (open: boolean) => {
    if (propSetIsOpen) {
      propSetIsOpen(open);
    } else {
      setIsOpen(open);
    }
  };
  
  // Fetch parts data
  const { data: partsResponse, isLoading: partsLoading } = api.partCatalogueRoutes.getPartCatalogues.useQuery();
  
  // Fetch suppliers data
  const { data: suppliersData, isLoading: suppliersLoading } = api.supplierRoutes.getSuppliers.useQuery();
  
  // Extract parts from response
  const parts = partsResponse?.success && 'data' in partsResponse ? partsResponse.data : [];
  
  // Extract suppliers
  const suppliers = suppliersData || [];
  
  // Get utils for invalidating queries
  const utils = api.useUtils();
  
  // Create stock mutation
  const createStock = api.stockRoutes.createStock.useMutation({
    onSuccess: () => {
      utils.stockRoutes.getPaginatedStocks.invalidate();
      handleOpenChange(false);
      form.reset();
      toast.success("Stock created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      part_id: '',
      supplier_id: '',
      quantity: 1,
      total_cost: 0,
      category: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    createStock.mutate({
      newStock: {
        part_id: values.part_id,
        supplier_id: values.supplier_id,
        quantity: values.quantity,
        total_cost: values.total_cost,
      },
    });
  };

  const categories = [
    { id: 'electrical', name: 'Electrical' },
    { id: 'mechanical', name: 'Mechanical' },
    { id: 'hydraulic', name: 'Hydraulic' },
  ];

  return (
    <Dialog open={propIsOpen !== undefined ? propIsOpen : isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Stock</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="part_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Part</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={partsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={partsLoading ? "Loading parts..." : "Select part"} />
                        </SelectTrigger>
                        <SelectContent>
                          {partsLoading ? (
                            <SelectItem value="loading" disabled>Loading parts...</SelectItem>
                          ) : parts.length === 0 ? (
                            <SelectItem value="no-parts" disabled>No parts available</SelectItem>
                          ) : (
                            parts.map((part) => (
                              <SelectItem key={part.id} value={part.id}>
                                {part.part_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={suppliersLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={suppliersLoading ? "Loading suppliers..." : "Select supplier"} />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliersLoading ? (
                            <SelectItem value="loading" disabled>Loading suppliers...</SelectItem>
                          ) : suppliers.length === 0 ? (
                            <SelectItem value="no-suppliers" disabled>No suppliers available</SelectItem>
                          ) : (
                            suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.supplier_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createStock.isPending || partsLoading || suppliersLoading}
            >
              {createStock.isPending ? 'Creating...' : 'Create Stock'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StockForm;
