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

import { UpdateBrandType } from '@/db/validations/brands';

import { deleteBrandAction } from './actions';
import { CreateBrandForm } from './create-form';
import { UpdateBrandForm } from './edit-form';

export function CreateBrandButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={'Create Brand'}
                description={'Create a new brand for your products.'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateBrandForm />}
            />

            <Button
                variant="outline-dashed"
                className="col-span-1 row-span-2 min-h-24"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <PlusIcon size={4} />
                Create Brand
            </Button>
        </>
    );
}

export function UpdateBrandButton({
    id,
    name,
    handle,
    originalImg,
}: UpdateBrandType) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { execute, isPending } = useAction(deleteBrandAction, {
        onExecute() {
            toast.loading('Deleting Brand', { id });
        },
        onSuccess() {
            toast.success('Brand Deleted', { id });
            if (setIsDropdownOpen) setIsDropdownOpen(false);
        },
        onError(args) {
            console.error(args.error.serverError);
            toast.error('Failed to delete Brand', {
                id,
            });
        },
    });

    return (
        <>
            <InteractiveOverlay
                title={'Update Brand'}
                description={'Update brand for your products.'}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                form={
                    <UpdateBrandForm
                        id={id}
                        name={name}
                        handle={handle}
                        originalImg={originalImg}
                    />
                }
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                title="Delete Brand"
                description="Are you sure you want to delete this brand? This action cannot be undone. This action will only work if it is not being used in any products."
                onConfirm={() => execute({ id, img: originalImg })}
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
                        Edit Brand
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon />
                        Delete Brand
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
