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

import { UpdateModelType } from '@/db/validations/models';

import { deleteModelAction } from './actions';
import { CreateModelForm } from './create-form';
import { UpdateModelForm } from './edit-form';

export function CreateModelButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={'Create Model'}
                description={'Create a new model for your products.'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateModelForm />}
            />

            <Button
                variant="outline-dashed"
                className="col-span-1 row-span-2 min-h-24"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <PlusIcon size={4} />
                Create Model
            </Button>
        </>
    );
}

export function UpdateModelButton({ id, name, handle }: UpdateModelType) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { execute, isPending } = useAction(deleteModelAction, {
        onExecute() {
            toast.loading('Deleting Model', { id });
        },
        onSuccess() {
            toast.success('Model Deleted', { id });
            if (setIsDropdownOpen) setIsDropdownOpen(false);
        },
        onError(args) {
            console.error(args.error.serverError);
            toast.error('Failed to delete Model', {
                id,
            });
        },
    });

    return (
        <>
            <InteractiveOverlay
                title={'Update Model'}
                description={'Update model for your products.'}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                form={<UpdateModelForm id={id} name={name} handle={handle} />}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                title="Delete Model"
                description="Are you sure you want to delete this model? This action cannot be undone. This action will only work if it is not being used in any products."
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
                        Edit Model
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon />
                        Delete Model
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
