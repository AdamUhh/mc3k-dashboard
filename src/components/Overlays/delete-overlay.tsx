'use client';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shadcn/alert-dialog';
import { LoaderButton } from '@/shadcn/custom/loading-button';

type DeleteModalProps = {
    onConfirm: () => void;
    description: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    confirmText?: string;
    isPending: boolean;
};

export function DeleteModal({
    title,
    description,
    isOpen,
    setIsOpen,
    onConfirm,
    confirmText = 'Delete',
    isPending,
}: DeleteModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <LoaderButton
                        variant="destructive"
                        onClick={onConfirm}
                        isLoading={isPending}
                    >
                        {confirmText}
                    </LoaderButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
