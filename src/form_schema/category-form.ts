import { z } from "zod";

export const categoryFormSchema = z.object({
  category_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category_desc: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  unit: z.string().min(1, {
    message: "Unit is required.",
  }),
});
