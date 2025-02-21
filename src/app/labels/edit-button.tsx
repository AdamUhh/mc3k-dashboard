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

import { UpdateLabelType } from '@/db/validations/labels';

import { deleteLabelAction } from './actions';
import { CreateLabelForm } from './create-form';
import { UpdateLabelForm } from './edit-form';

export function CreateLabelButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InteractiveOverlay
                title={'Create Label'}
                description={'Create a new label for your products.'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                form={<CreateLabelForm />}
            />

            <Button
                variant="outline-dashed"
                className="col-span-1 row-span-2 min-h-24"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <PlusIcon size={4} />
                Create Label
            </Button>
        </>
    );
}

export function UpdateLabelButton({ id, name }: UpdateLabelType) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { execute, isPending } = useAction(deleteLabelAction, {
        onExecute() {
            toast.loading('Deleting Label', { id });
        },
        onSuccess() {
            toast.success('Label Deleted', { id });
            if (setIsDropdownOpen) setIsDropdownOpen(false);
        },
        onError(args) {
            console.error(args.error.serverError);
            toast.error('Failed to delete label', {
                id,
            });
        },
    });

    return (
        <>
            <InteractiveOverlay
                title={'Update label'}
                description={'Update label for your products.'}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                form={<UpdateLabelForm id={id} name={name} />}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                title="Delete Label"
                description="Are you sure you want to delete this label? This action cannot be undone. This action will only work if it is not being used in any products."
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
                        Edit Label
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon />
                        Delete Label
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
