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

import { UpdateCollectionType } from '@/db/validations/collections';

import { deleteCollectionAction } from './actions';
import { CreateCollectionForm } from './create-form';
import { UpdateCollectionForm } from './edit-form';

export function CreateCollectionButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={'Create Collection'}
                description={'Create a new collection for your products.'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateCollectionForm />}
            />

            <Button
                variant="outline-dashed"
                className="col-span-1 row-span-2 min-h-24"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <PlusIcon size={4} />
                Create Collection
            </Button>
        </>
    );
}

export function UpdateCollectionButton({
    id,
    name,
    handle,
    description,
    originalImg,
}: UpdateCollectionType) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { execute, isPending } = useAction(deleteCollectionAction, {
        onExecute() {
            toast.loading('Deleting Collection', { id });
        },
        onSuccess() {
            toast.success('Collection Deleted', { id });
            if (setIsDropdownOpen) setIsDropdownOpen(false);
        },
        onError(args) {
            console.error(args.error.serverError);
            toast.error('Failed to delete Collection', {
                id,
            });
        },
    });

    return (
        <>
            <InteractiveOverlay
                title={'Update Collection'}
                description={'Update collection for your products.'}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                form={
                    <UpdateCollectionForm
                        id={id}
                        name={name}
                        handle={handle}
                        description={description}
                        originalImg={originalImg}
                    />
                }
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                title="Delete Collection"
                description="Are you sure you want to delete this collection? This action cannot be undone. This action will only work if it is not being used in any products."
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
                        Edit Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon />
                        Delete Collection
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
