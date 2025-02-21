'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import {
    ValidateCollectionType,
    validateCollectionSchema,
} from '@/db/validations/collections';

import { createCollectionAction } from './actions';
import { CollectionFormBase } from './form-base';

export function CreateCollectionForm() {
    const form = useForm<ValidateCollectionType>({
        resolver: zodResolver(validateCollectionSchema),
        defaultValues: {
            name: '',
            handle: '',
            description: '',
            img: null,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(createCollectionAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Creating Collection', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Collection Created', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (args) => {
            console.error(args.error.serverError);
            toast.error('Failed to create Collection', {
                id: form.getValues().name,
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(execute)();
    };

    return (
        <CollectionFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
