'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import { getChangedFields } from '@/lib/utils';

import { UpdateLabelType, updateLabelSchema } from '@/db/validations/labels';

import { updateLabelAction } from './actions';
import { LabelFormBase } from './form-base';

export function UpdateLabelForm({ id, name }: UpdateLabelType) {
    const form = useForm<UpdateLabelType>({
        resolver: zodResolver(updateLabelSchema),
        defaultValues: {
            id,
            name,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(updateLabelAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Updating Label', {
                id: form.getValues().name,
            });
        },
        onSuccess: () => {
            toast.success('Label Updated', {
                id: form.getValues().name,
            });
            setIsOpen?.(false);
        },
        onError: (error) => {
            console.error(error.error.serverError);
            toast.error('Failed to update label', {
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

        if (changedFields.size === 0) {
            toast.error('No changes to update');
            return;
        }
        form.handleSubmit((data) =>
            execute({ ...data, changedFields: Array.from(changedFields) })
        )();
    };

    return (
        <LabelFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
