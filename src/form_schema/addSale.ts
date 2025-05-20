import { z } from "zod";

export const itemsSchema = z.object({
  part_id: z.string(),
  quantity: z.number().min(1, { message: "The quantity should be greater than 1." }),
  discount: z.number().min(0, { message: "Discount cannot be negative" }).default(0),
  sub_total: z.number().min(0, { message: "The subtotal should be greater than 0." }),
  unit_price: z.number().min(0, { message: "Unit price must be a positive number" })
});

export const createSaleSchema = z.object({
  payment_mode: z.enum(["Cash", "Mobile Payment", "Credit"], {
    required_error: "Payment mode is required",
  }),
  journal_number: z.string().optional(),
  customer_name: z.string().optional(),
  customer_cid: z.string().optional(),
  customer_phone_num: z
    .string()
    .min(8, { message: "The phone number should have eight digits." }),
  payment_status: z.string().optional(),
  total_sale: z.number().min(0, "Total sale must be a positive number"),
  total_discount: z
    .number()
    .min(0, "The discount amount should be greater than 0")
    .default(0),
}).superRefine((data, ctx) => {
  if (data.payment_mode === "Credit" && !data.payment_status) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Payment status is required when payment mode is Credit",
      path: ["payment_status"]
    });
  }
  if (data.payment_mode === "Mobile Payment" && !data.journal_number) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Journal number is required for mobile payment",
      path: ["journal_number"]
    });
  }
});
