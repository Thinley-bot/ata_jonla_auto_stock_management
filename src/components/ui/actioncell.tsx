import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { api } from '~/trpc/react';
import ConfirmDelete from './confirmdelete';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { updateRouting } from '~/app/_utility/updateRouting';

interface ActionCellProps {
    item: 'user' | 'category' | 'catalogue' | 'supplier' | 'stock' | 'sale' | 'brand';
    itemId: string;
    data?: any;
}

const ActionCell = ({ item, itemId}: ActionCellProps) => {
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const utils = api.useUtils();
    const router = useRouter();

    const mutations = {
        user: api.userRoutes.deleteUser.useMutation({
            onSuccess: () => {
                utils.userRoutes.getUsers.invalidate(),
                toast.success('User deleted successfully')
            },
            onError: (err) => toast.error(err.message),
        }),
        category: api.partCategoryRoutes.deletePartCategory.useMutation({
            onSuccess: () => {
                utils.partCategoryRoutes.getPartCategories.invalidate();
                toast.success('Category deleted successfully')
            },
            onError: (err) => toast.error(err.message),
        }),
        catalogue: api.partCatalogueRoutes.deletePartCatalogue.useMutation({
            onSuccess: () => {
                utils.partCatalogueRoutes.getPartCatalogues.invalidate();
                toast.success("Catalogue deleted sucessfully")
            }
        }),
        supplier: api.supplierRoutes.deleteSupplier.useMutation({
            onSuccess: () => {
                utils.supplierRoutes.getPaginatedSuppliers.invalidate();
                toast.success('Supplier deleted successfully');
            },
            onError: (err) => toast.error(err.message),
        }),
        stock: api.stockRoutes.deleteStock.useMutation({
            onSuccess : () => {
                utils.stockRoutes.getPaginatedStocks.invalidate();
                toast.success("Stock deleted successfully")
            },
            onError: (err) => toast.error(err.message),
        }),
        sale: api.saleRoutes.deleteStockSale.useMutation({
            onSuccess: () => {
                utils.saleRoutes.getStockSales.invalidate();
                toast.success("Sale record deleted successfully")
            },
            onError: (err) => toast.error(err.message)
        }),
        brand :  api.carBrandRoutes.deleteCarBrand.useMutation({
            onSuccess: () => {
                utils.carBrandRoutes.getCarBrands.invalidate()
                toast.success("Sale record deleted successfully")
            },
            onError: (err) => toast.error(err.message)
        })
    };
    const handleDelete = () => {
            mutations[item].mutate({ id: itemId })
            setConfirmDeleteDialog(false)
    };

    const handleView = () => {
        updateRouting(router, item, itemId)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Ellipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleView()}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmDeleteDialog(true)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDelete isOpen={confirmDeleteDialog} setIsOpen={setConfirmDeleteDialog} item={item} handleDelete={handleDelete} />
        </>
    );
};
export default ActionCell;
