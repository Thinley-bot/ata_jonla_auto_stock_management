import {z} from 'zod'

export const catalogueFormSchema = z.object({
  part_name: z.string().min(2, {
    message: "Part name must be at least 2 characters.",
  }),
  part_number: z.string().optional(),
  category_id: z.string({
    required_error: "Please select a category.",
  }),
  brand_id: z.string({
    required_error: "Please select a brand.",
  }),
  unit_price: z.coerce.number().min(0, { message: "The unit price cannot be less than 0" })
});
