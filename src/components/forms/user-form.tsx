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
import { createSupabaseClient } from "~/supabase/client";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 4 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    image: z.instanceof(File).optional(),
    roleId: z.string().min(1, { message: "Please select a role." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
});

export default function AddUserForm({ 
    closeDialog, 
    user 
}: { 
    closeDialog: () => void;
    user?: {
        id: string;
        name: string;
        email: string;
        image_url?: string;
        role_id: string;
    };
}) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user roles
    const { data: userRoles, isLoading: isRolesLoading } = api.userRolesRoutes.getUserRoles.useQuery();

    //Update the user role and details
    const { mutate: updateUser } = api.userRoutes.updateUser.useMutation();
    const utils = api.useUtils();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            image: undefined,
            roleId: user?.role_id ?? "",
            password: "",
        },
    });

    useEffect(() => {
        if (user?.image_url) {
            setImagePreview(user.image_url);
        }
        return () => {
            if (imagePreview && !imagePreview.startsWith('http')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [user]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            setIsLoading(true);
            try {
                let imageUrl = "";

                // Create new user
                const { data: authData, error: authError } = await authClient.signUp.email({
                    email: values.email,
                    password: values.password!,
                    name: values.name,
                    image: imageUrl,
                    callbackURL: '/',
                });

                if (authError) {
                    if (authError.message?.includes('already exists')) {
                        toast.error('A user with this email already exists.');
                        return;
                    }
                    throw new Error(authError.message || 'Failed to create user');
                }

                if (!authData?.user?.id) {
                    throw new Error('No user ID returned');
                }

                // Upload image for new user if not done yet
                if (values.image) {
                    const extension = values.image.name.split('.').pop()?.toLowerCase() || '';
                    const filePath = `user_${authData.user.id}.${extension}`;
                    const supabase = createSupabaseClient();
                    const { error: uploadError } = await supabase
                        .storage
                        .from('userimage')
                        .upload(filePath, values.image, { upsert: true });

                    if (uploadError) {
                        throw new Error(uploadError.message || 'Failed to upload image');
                    }

                    const { data: urlData } = supabase
                        .storage
                        .from('userimage')
                        .getPublicUrl(filePath);
                    imageUrl = urlData.publicUrl;
                }

                updateUser(
                    {
                        id: authData.user.id,
                        updates: {
                            role_id: values.roleId,
                            name: values.name,
                            email: values.email,
                            image: imageUrl,
                        },
                    },
                    {
                        onSuccess: () => {
                            toast.success(`User ${values.name} created successfully`);
                            utils.userRoutes.getUsers.invalidate();
                            closeDialog();
                        },
                        onError: (error) => {
                            toast.error(error.message || 'Failed to set user role');
                        },
                    }
                );
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
            } finally {
                setIsLoading(false);
            }
        } else {
            await handleUpdate(values);
        }
    }

    const handleUpdate = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            let imageUrl = user?.image_url ?? "";

            if (values.image) {
                // Use consistent file path: user_<userId>.<extension>
                const extension = values.image.name.split('.').pop()?.toLowerCase() || '';
                if (!['jpg', 'jpeg', 'png'].includes(extension)) {
                    throw new Error('Only JPG, JPEG, or PNG files are allowed');
                }
                const filePath = `user_${user?.id ?? 'new'}.${extension}`;

                // Upload new image, overwriting if it exists
                const supabase = createSupabaseClient();
                const { error: uploadError } = await supabase
                    .storage
                    .from('userimage')
                    .update(filePath, values.image, {
                        upsert: true, // Overwrite existing file
                        cacheControl: '3600',
                    });

                if (uploadError) {
                    throw new Error(uploadError.message || 'Failed to upload image');
                }

                // Get public or signed URL
                const { data: urlData } = supabase
                    .storage
                    .from('userimage')
                    .getPublicUrl(filePath);

                imageUrl = urlData.publicUrl;
                if (!imageUrl) {
                    throw new Error('Failed to retrieve image URL');
                }
            }

            const updates = {
                role_id: values.roleId,
                name: values.name,
                email: values.email,
                image: imageUrl,
            };

            updateUser(
                { id: user!.id, updates },
                {
                    onSuccess: () => {
                        toast.success(`User ${values.name} updated successfully`);
                        utils.userRoutes.getUsers.invalidate();
                        closeDialog();
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to update user');
                    },
                }
            );
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = userRoles?.success && "data" in userRoles ? userRoles.data : [];

    return (
        <Dialog open={true} onOpenChange={(open) => !open && closeDialog?.()}>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{user ? 'Update User' : 'Create New User'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'Update an existing user.' : 'Add a new user to the system. All fields are required.'}
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
                            
                            {!user && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <div className={user ? "col-span-full" : ""}>
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
                                                    if (imagePreview && !imagePreview.startsWith('http')) {
                                                        URL.revokeObjectURL(imagePreview);
                                                    }
                                                    setImagePreview(URL.createObjectURL(file));
                                                } else {
                                                    field.onChange(undefined);
                                                    if (imagePreview && !imagePreview.startsWith('http')) {
                                                        URL.revokeObjectURL(imagePreview);
                                                        setImagePreview(user?.image_url || null);
                                                    }
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
                            {user ? (
                                <Button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={()=>handleUpdate(form.getValues())}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : 'Update User'}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : 'Create User'}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
