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
import toast from 'react-hot-toast';

interface ActionCellProps {
    item: 'user' | 'category' | 'supplier' | 'stock' | 'sale' | 'brand';
    itemId: string;
    onEdit?: () => void;
}

const ActionCell = ({ item, itemId, onEdit}: ActionCellProps) => {
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
    const utils = api.useUtils();

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
        try {
            mutations[item].mutate({ id: itemId });
            utils.userRoutes.getUsers.invalidate()
        } catch (error) {
            console.log(error)
        } finally {
            setConfirmDeleteDialog(false)
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Ellipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={onEdit}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmDeleteDialog(true)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDelete isOpen={confirmDeleteDialog} setIsOpen={setConfirmDeleteDialog} item={item} handleDelete={handleDelete} />
        </>
    );
};
export default ActionCell;
