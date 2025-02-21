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

import { UpdateTagItemType, UpdateTagType } from '@/db/validations/tags';

import { deleteTagAction, deleteTagItemAction } from './actions';
import { CreateTagForm, CreateTagItemForm } from './create-form';
import { UpdateTagForm, UpdateTagItemForm } from './edit-form';

export function CreateTagButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={'Create Tag'}
                description={'Create a new tag for your products.'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateTagForm />}
            />

            <Button
                variant="outline-dashed"
                className="min-h-12 w-full"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <PlusIcon size={4} />
                Create Tag
            </Button>
        </>
    );
}
export function CreateTagItemButton({ tagId }: { tagId: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={'Create Tag Item'}
                description={'Create a new tag item for your tag.'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateTagItemForm tagId={tagId} />}
            />

            <Button
                variant="outline-dashed"
                className="col-span-1 row-span-2 min-h-24"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <PlusIcon size={4} />
                Create Tag Item
            </Button>
        </>
    );
}

export function UpdateTagButton({ id, name }: UpdateTagType) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { execute, isPending } = useAction(deleteTagAction, {
        onExecute() {
            toast.loading('Deleting Tag', { id });
        },
        onSuccess() {
            toast.success('Tag Deleted', { id });
            if (setIsDropdownOpen) setIsDropdownOpen(false);
        },
        onError(args) {
            console.error(args.error.serverError);
            toast.error('Failed to delete Tag', {
                id,
            });
        },
    });

    return (
        <>
            <InteractiveOverlay
                title={'Update Tag'}
                description={'Update tag for your products.'}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                form={<UpdateTagForm id={id} name={name} />}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                title="Delete Tag and it's Tag Items"
                description="Are you sure you want to delete this tag? This action cannot be undone. This action will only work if it is not being used in any products."
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
                        Edit Tag
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon />
                        Delete Tag
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export function UpdateTagItemButton({ id, name }: UpdateTagItemType) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { execute, isPending } = useAction(deleteTagItemAction, {
        onExecute() {
            toast.loading('Deleting Tag Item', { id });
        },
        onSuccess() {
            toast.success('Tag Item Deleted', { id });
            if (setIsDropdownOpen) setIsDropdownOpen(false);
        },
        onError(args) {
            console.error(args.error.serverError);
            toast.error('Failed to delete Tag Item', {
                id,
            });
        },
    });

    return (
        <>
            <InteractiveOverlay
                title={'Update Tag ITem'}
                description={'Update tag Item for your products.'}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                form={<UpdateTagItemForm id={id} name={name} />}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                title="Delete Tag Item"
                description="Are you sure you want to delete this tag item? This action cannot be undone. This action will only work if it is not being used in any products."
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
                        Edit Tag Item
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon />
                        Delete Tag Item
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
