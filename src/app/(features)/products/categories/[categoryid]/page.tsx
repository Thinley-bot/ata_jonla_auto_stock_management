"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { categoryFormSchema } from '~/form_schema/category-form'
import { api } from '~/trpc/react'

type formSchema = z.infer<typeof categoryFormSchema>

const page = () => {
  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category_name: "",
      category_desc: "",
      unit: "",
    },
  })
  const { categoryid } = useParams<{ categoryid: string }>()

  const {data} = api.partCategoryRoutes.getPartCategory.useQuery(categoryid)
  const {mutate:updateCategory} = api.partCategoryRoutes.updatePartCategory.useMutation({
    onSuccess: ()=>{
      toast.success("Category updated successfully.")
    }
  })
  useEffect(()=>{
    if(data && data.length > 0){
      const category = data[0]
      form.reset({
        category_name: category?.category_name || "",
        category_desc: category?.category_desc || "",
        unit: category?.unit || ""
      })
    }
  },[data,form])

  function handleCategoryUpdate(category:formSchema){
    updateCategory({
      id: categoryid,
      updates: category
    })
  }

  return (
     <div className="py-10 px-10">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleCategoryUpdate)}>
          <FormField control={form.control} name='category_name' render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter the category name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name='category_desc' render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Enter the category description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name='unit' render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder='Enter the category name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex justify-end">
            <Button type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default page;
