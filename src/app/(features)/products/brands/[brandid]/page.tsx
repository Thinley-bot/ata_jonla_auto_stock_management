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

const formSchema = z.object({
  brand_name: z.string(),
  brand_description: z.string()
});

type FormSchema = z.infer<typeof formSchema>;

export default function Page() {
  const params = useParams<{ brandid: string }>();
  const { data } = api.carBrandRoutes.getCarBrandById.useQuery(params.brandid);

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

  const handleUpdate = (updateData:FormSchema) => {
    console.log(updateData)
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
                  <Input {...field}/>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">
              Update Brand
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
