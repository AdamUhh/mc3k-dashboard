'use client';

import {
    EllipsisVertical,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { DeleteModal } from '@/components/Overlays/delete-overlay';
import { InteractiveOverlay } from '@/components/Overlays/interactive-overlay';
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shadcn/dropdown-menu';

import { UpdateProductFormType } from '@/db/validations/products';

import { deleteProductAction } from './actions';
import { CreateProductForm } from './create-form';
import { UpdateProductForm } from './edit-form';

export function CreateProductButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={'Create Product'}
                description={'Create a new product for your products.'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                big
                form={<CreateProductForm />}
            />

            <Button
                variant="outline-dashed"
                className="col-span-1 row-span-2 min-h-24"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <PlusIcon size={4} />
                Create Product
            </Button>
        </>
    );
}

export function UpdateProductButton({
    id,
    name,
    handle,
    description,
    teaserDescription,
    shortDescription,
    brandId,modelId,
    features,
    collections,
}: UpdateProductFormType) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { execute, isPending } = useAction(deleteProductAction, {
        onExecute() {
            toast.loading('Deleting Product', { id });
        },
        onSuccess() {
            toast.success('Product Deleted', { id });
            if (setIsDropdownOpen) setIsDropdownOpen(false);
        },
        onError(args) {
            console.error(args.error.serverError);
            toast.error('Failed to delete Product', {
                id,
            });
        },
    });

    return (
        <>
            <InteractiveOverlay
                title={'Update Product'}
                description={'Update product for your products.'}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                big
                form={
                    <UpdateProductForm
                        id={id}
                        name={name}
                        handle={handle}
                        description={description}
                        teaserDescription={teaserDescription}
                        shortDescription={shortDescription}
                        brandId={brandId}
                        modelId={modelId}
                        features={features}
                        collections={collections}
                    />
                }
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone. This action will only work if it is not being used in any products."
                onConfirm={() => execute({ id })}
                isPending={isPending}
            />

            <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
            >
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size={'icon'} className="h-full">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            setIsDropdownOpen(false);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <PencilIcon />
                        Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon />
                        Delete Product
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
