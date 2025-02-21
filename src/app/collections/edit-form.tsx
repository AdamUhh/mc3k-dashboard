'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import { getChangedFields } from '@/lib/utils';

import {
    UpdateCollectionType,
    updateCollectionSchema,
} from '@/db/validations/collections';

import { updateCollectionAction } from './actions';
import { CollectionFormBase } from './form-base';

export function UpdateCollectionForm({
    id,
    name,
    handle,
    description,
    originalImg,
}: UpdateCollectionType) {
    const form = useForm<UpdateCollectionType>({
        resolver: zodResolver(updateCollectionSchema),
        defaultValues: {
            id,
            name,
            handle,
            description,
            img: null,
            originalImg: originalImg || null,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(updateCollectionAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Updating Collection', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Collection Updated', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (error) => {
            console.error(error.error.serverError);
            toast.error('Failed to update Collection', {
                id: form.getValues().name,
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        // e.preventDefault();
        // e.stopPropagation();
        // form.handleSubmit(execute)();
        e.preventDefault();
        e.stopPropagation();

        const changedFields = new Set(Object.keys(getChangedFields(form)));

        // If name changed and handle wasn't manually edited, add handle to changedFields
        if (
            changedFields &&
            changedFields.has('name') &&
            !form.formState.dirtyFields.handle
        ) {
            changedFields.add('handle');
        }

        if (changedFields.size === 0) {
            toast.error('No changes to update');
            return;
        }
        form.handleSubmit((data) =>
            execute({ ...data, changedFields: Array.from(changedFields) })
        )();
    };

    return (
        <CollectionFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
