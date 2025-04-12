"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import Image from "next/image";
import { uploadImage } from "~/supabase/storage/client";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 4 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    image: z.instanceof(File),
    roleId: z.string().min(1, { message: "Please select a role." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function AddUserForm({ closeDialog }: { closeDialog: () => void }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user roles
    const { data: userRoles, isLoading: isRolesLoading } = api.userRolesRoutes.getUserRoles.useQuery();

    //Update the user role
    const { mutate: updateUserRole } = api.userRoutes.updateUser.useMutation();
    const utils = api.useUtils();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            image: undefined,
            roleId: "",
            password: "",
        },
    });

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // 1. Upload image if provided
            let imageUrl = "";
            if (values.image) {
                const uploadResult = await uploadImage({
                    file: values.image,
                    bucket: "userimage",
                });
                
                if (uploadResult.error) {
                    throw new Error(uploadResult.error || "Failed to upload image");
                }
                imageUrl = uploadResult.imageUrl;
            }
    
            // 2. Create auth user (must succeed before proceeding)
            const { data: authData, error: authError } = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
                image: imageUrl,
                callbackURL: "/",
            });
    
            // Handle specific error cases
            if (authError) {
                // Check if the error is "User already exists"
                if (authError.message?.includes("already exists") || authError.message?.includes("already registered")) {
                    toast.error("A user with this email already exists. Please use a different email or try logging in.");
                    return; // Exit the function early without throwing an error
                }
                
                // For other auth errors, throw a more specific error
                throw new Error(authError.message || "Failed to create user in authentication system");
            }

            if (!authData?.user?.id) {
                throw new Error("Failed to create user: No user ID returned");
            }

            // 3. Update role ONLY if auth user was created
            const userUpdateRes = await updateUserRole({
                id: authData.user.id,
                updates: {
                    role_id: values.roleId,
                }
            });

            // Invalidate the user query to refresh the data
            await utils.userRoutes.getUser.invalidate();

            toast.success(`User ${values.name} created successfully`);
            closeDialog();
        } catch (error) {
            console.error("User creation error:", error);
            toast.error(
                error instanceof Error ? error.message : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    }

    const roles = userRoles?.success && "data" in userRoles ? userRoles.data : [];

    if (isRolesLoading) {
        return (
            <Dialog open={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                        Add a new user to the system. All fields are required except for the profile image.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && closeDialog?.()}>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the system. All fields are required except for the profile image.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tashi Wangchuk"
                                                {...field}
                                                disabled={isLoading}
                                            />
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
                                            <Input
                                                placeholder="tashi@example.com"
                                                type="email"
                                                {...field}
                                                disabled={isLoading}
                                            />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="••••••••"
                                                type="password"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.role_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            disabled={isLoading}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file);
                                                    setImagePreview(URL.createObjectURL(file));
                                                } else {
                                                    field.onChange(undefined);
                                                    setImagePreview(null);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <Image
                                                width={200}
                                                height={200}
                                                alt="Profile preview"
                                                src={imagePreview}
                                                className="rounded-full object-cover"
                                                onLoadingComplete={() => {
                                                    if (imagePreview) {
                                                        URL.revokeObjectURL(imagePreview);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialog}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : "Create User"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
