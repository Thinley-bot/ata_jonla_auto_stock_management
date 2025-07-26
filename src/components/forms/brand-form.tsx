"use client";

import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { brandFormSchema } from "~/form_schema/brand-schema";

interface BrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}
type FormValues = z.infer<typeof brandFormSchema>

export function BrandForm({ isOpen, onClose, onSubmit }: BrandFormProps) {

  const handleSubmit = (branddata: FormValues) => {
    onSubmit({ name: branddata.brand_name, description: branddata.brand_description });
  };

  const form = useForm({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      brand_name: "",
      brand_description: ""
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField control={form.control} name="brand_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the brand name" {...field} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="brand_description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the brand description" {...field} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-3">
                <Button type="button" variant={"destructive"} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant={"default"}>
                  Create
                </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
