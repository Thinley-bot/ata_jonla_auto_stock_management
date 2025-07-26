import { z } from "zod";

export const brandFormSchema = z.object({
  brand_name: z.string(),
  brand_description: z.string()
})
