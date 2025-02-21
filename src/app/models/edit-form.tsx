'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import { getChangedFields } from '@/lib/utils';

import { UpdateModelType, updateModelSchema } from '@/db/validations/models';

import { updateModelAction } from './actions';
import { ModelFormBase } from './form-base';

export function UpdateModelForm({ id, name, handle }: UpdateModelType) {
    const form = useForm<UpdateModelType>({
        resolver: zodResolver(updateModelSchema),
        defaultValues: {
            id,
            name,
            handle,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(updateModelAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Updating Model', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Model Updated', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (error) => {
            console.error(error.error.serverError);
            toast.error('Failed to update Model', {
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
        <ModelFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
