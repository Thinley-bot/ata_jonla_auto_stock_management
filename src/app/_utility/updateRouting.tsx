import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function updateRouting(router: AppRouterInstance, item: string, itemId: string) {
    const validItem = ['user', 'category', 'catalogue', 'supplier', 'stock', 'sale', 'brand']
    if (!validItem.includes(item)) {
        throw new Error('Invalid status');
    }
    switch (item) {
        case "brand":
            router.push(`/products/brands/${itemId}`)
            break;
        case "category":
            router.push(`/products/categories/${itemId}`)
            break;
    }
}