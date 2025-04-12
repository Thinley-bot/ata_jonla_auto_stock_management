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
    item: 'user' | 'category' | 'supplier';
    itemId: string;
    onEdit?: () => void;
    userData?: any;
}

const ActionCell = ({ item, itemId, onEdit, userData }: ActionCellProps) => {
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
    const utils = api.useUtils();

    const mutations = {
        user: api.userRoutes.deleteUser.useMutation({
            onSuccess: () => toast.success('User deleted successfully'),
            onError: (err) => toast.error(err.message),
        }),
        category: api.partCategoryRoutes.deletePartCategory.useMutation({
            onSuccess: () => toast.success('Category deleted successfully'),
            onError: (err) => toast.error(err.message),
        }),
        supplier: api.supplierRoutes.deleteSupplier.useMutation({
            onSuccess: () => {
                utils.supplierRoutes.getPaginatedSuppliers.invalidate();
                toast.success('Supplier deleted successfully');
            },
            onError: (err) => toast.error(err.message),
        }),
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
