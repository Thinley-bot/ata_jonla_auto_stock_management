import {z} from "zod"

export const registerSchema = z.object({
    email : z.string().email({ message: "Invalid email address" }),
    password: z.string().min(7,{message:"Password of minimum 7 character is required!"}),
    name:z.string(),
})