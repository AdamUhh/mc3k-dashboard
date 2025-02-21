'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import { getChangedFields } from '@/lib/utils';

import {
    UpdateTagItemType,
    UpdateTagType,
    updateTagItemSchema,
    updateTagSchema,
} from '@/db/validations/tags';

import { updateTagAction, updateTagItemAction } from './actions';
import { TagFormBase } from './form-base';

export function UpdateTagForm({ id, name }: UpdateTagType) {
    const form = useForm<UpdateTagType>({
        resolver: zodResolver(updateTagSchema),
        defaultValues: {
            id,
            name,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(updateTagAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Updating Tag', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Tag Updated', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (error) => {
            console.error(error.error.serverError);
            toast.error('Failed to update Tag', {
                id: form.getValues().name,
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
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
        <TagFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}

export function UpdateTagItemForm({ id, name }: UpdateTagItemType) {
    const form = useForm<UpdateTagItemType>({
        resolver: zodResolver(updateTagItemSchema),
        defaultValues: {
            id,
            name,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(updateTagItemAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Updating Tag Item', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Tag Item Updated', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (error) => {
            console.error(error.error.serverError);
            toast.error('Failed to update Tag Item', {
                id: form.getValues().name,
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
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
        <TagFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
