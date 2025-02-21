'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import {
    ValidateModelType,
    validateModelSchema,
} from '@/db/validations/models';

import { createModelAction } from './actions';
import { ModelFormBase } from './form-base';

export function CreateModelForm() {
    const form = useForm<ValidateModelType>({
        resolver: zodResolver(validateModelSchema),
        defaultValues: {
            name: '',
            handle: '',
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(createModelAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Creating Model', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Model Created', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (args) => {
            console.error(args.error.serverError);
            toast.error('Failed to create Model', {
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
        <ModelFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
