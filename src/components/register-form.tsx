"use client"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"
import { Input } from "~/components/ui/input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "~/form_schema/register"
import { useState } from "react"
import { authClient } from "~/lib/auth-client"
import toast from "react-hot-toast"

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const onSubmit = async ({email, password, name}: z.infer<typeof registerSchema>) => {
    setLoading(true)
    try {
      const signUpResponse = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      })
      if (!signUpResponse.data) {
        toast.error(signUpResponse?.error?.message || "An error occurred")
        return
      }
      toast.success("User Registration Successful")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false)
      form.reset()
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your details to register.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account? <a href="/" className="underline underline-offset-4">Sign in</a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
