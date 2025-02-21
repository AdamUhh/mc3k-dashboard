'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import {
    ValidateTagItemType,
    ValidateTagType,
    validateTagItemSchema,
    validateTagSchema,
} from '@/db/validations/tags';

import { createTagAction, createTagItemAction } from './actions';
import { TagFormBase, TagItemFormBase } from './form-base';

export function CreateTagForm() {
    const form = useForm<ValidateTagType>({
        resolver: zodResolver(validateTagSchema),
        defaultValues: {
            name: '',
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(createTagAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Creating Tag', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Tag Created', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (args) => {
            console.error(args.error.serverError);
            toast.error('Failed to create Tag', {
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
        <TagFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}

export function CreateTagItemForm({ tagId }: { tagId: string }) {
    const form = useForm<ValidateTagItemType>({
        resolver: zodResolver(validateTagItemSchema),
        defaultValues: {
            name: '',
            tagId,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(createTagItemAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Creating Tag Item', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Tag Item Created', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (args) => {
            console.error(args.error.serverError);
            toast.error('Failed to create Tag Item', {
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
        <TagItemFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
