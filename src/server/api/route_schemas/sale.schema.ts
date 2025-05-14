import {z} from 'zod'
export const getSalesSchema = z.object({
    limit: z.number().min(1).max(100).default(10),
    cursor: z.string().optional(),
    direction: z.enum(["next", "prev"]).default("next"),
    search: z.string().optional()
})

export const createSaleSchema = z.object({
    payment_mode: z.string().min(1, "Payment mode is required"),
    journal_number: z.string().optional(),
    customer_name: z.string().optional(),
    customer_cid: z.string().optional(),
    customer_phone_num : z.string().min(8,{message:"The phone number should have eight digit."}),
    payment_status: z.string({message:"Please choose one payment method"}),
    total_sale: z.number().min(0, "Total sale must be a positive number"),
    total_discount: z.number().min(0, "The discount amount should be greater than 0").optional()
  });
  
export const updateSaleSchema = z.object({
    payment_mode: z.string().min(1, "Payment mode is required").optional(),
    journal_number: z.string().optional(),
    customer_name: z.string().optional(),
    customer_cid: z.string().optional(),
    payment_status: z.string().optional(),
    total_sale: z.number().min(0, "Total sale must be a positive number").optional(),
    total_discount: z.number().min(0, "The discount amount should be greater than 0").optional()
  });
