"use client"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "~/components/ui/card"
import { cn } from "~/lib/utils"
import { Input } from "~/components/ui/input"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { useState } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { loginSchema } from "~/form_schema/login"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "~/lib/auth-client"
import { Checkbox } from "./ui/checkbox"
import toast from "react-hot-toast"

export function LoginForm({className,...props}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit({ email, password, rememberMe }: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    try {
      const response = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: "/dashboard",
      });
      if (!response.data) {
        toast.error(response?.error?.message || "An error occurred");
        return;
      }
      toast.success("Login successful!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }
    
  return (
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-24 h-24">
            <Image 
              src="/assets/img/Khorlo.png" 
              alt="Loading" 
              fill
              className="object-contain animate-spin-slow"
              priority
            />
          </div>
        </div>
      )}
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email" {...field} disabled={isLoading} />
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
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={(checked) => field.onChange(checked)} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Remember Me</FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Login"}
              </Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account? Consult Admin
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
