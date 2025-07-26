"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";
import { formSchema } from "~/form_schema/brand-schema";

type FormSchema = z.infer<typeof formSchema>;

export default function Page() {
  const {brandid} = useParams<{ brandid: string }>();
  const { data } = api.carBrandRoutes.getCarBrandById.useQuery(brandid);
  const { mutate: updateCarBrand, error } = api.carBrandRoutes.updateCarBrand.useMutation()

  const form = useForm<FormSchema>({
    defaultValues: {
      brand_name: "",
      brand_description: "",
    },
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const brand = data[0];
      form.reset({
        brand_name: brand?.brand_name || "",
        brand_description: brand?.brand_desc || ""
      });
    }
  }, [data, form]);

  const handleUpdate = (updateData: FormSchema) => {
    updateCarBrand(
      {
        id: brandid,
        updates: {brand_desc: updateData.brand_description,...updateData}
      },
      {
        onSuccess: (input) => {
          toast.success(input.message)
        }
      }
    )
  }

  return (
    <div className="py-10 px-10">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdate)}>
          <FormField
            control={form.control}
            name="brand_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
