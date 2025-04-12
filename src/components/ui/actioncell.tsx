import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from './dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

interface ActionCell {
    item: string
    itemId: string
    onEdit?: () => void
}

const ActionCell = ({ item, itemId, onEdit }: ActionCell) => {
    const utils = api.useUtils();
    
    const deleteUser = api.userRoutes.deleteUser.useMutation({
        onSuccess: () => {
            toast.success('User deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const deleteCategory = api.partCategoryRoutes.deletePartCategory.useMutation({
        onSuccess: () => {
            toast.success('Category deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    
    const deleteSupplier = api.supplierRoutes.deleteSupplier.useMutation({
        onSuccess: () => {
            utils.supplierRoutes.getPaginatedSuppliers.invalidate();
            toast.success('Supplier deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleDelete = () => {
        if (item === 'user') {
            deleteUser.mutate({ id: itemId })
        } else if (item === 'category') {
            deleteCategory.mutate({ id: itemId })
        } else if (item === 'supplier') {
            if (window.confirm("Are you sure you want to delete this supplier?")) {
                deleteSupplier.mutate({ id: itemId })
            }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='cursor-pointer'>
                <Ellipsis className='h-4 w-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                        Edit
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ActionCell
