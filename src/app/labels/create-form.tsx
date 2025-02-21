'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import {
    ValidateLabelType,
    validateLabelSchema,
} from '@/db/validations/labels';

import { createLabelAction } from './actions';
import { LabelFormBase } from './form-base';

export function CreateLabelForm() {
    const form = useForm<ValidateLabelType>({
        resolver: zodResolver(validateLabelSchema),
        defaultValues: {
            name: '',
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(createLabelAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Creating Label', {
                id: form.getValues().name,
            });
        },
        onSuccess: () => {
            toast.success('Label Created', {
                id: form.getValues().name,
            });
            setIsOpen?.(false);
        },
        onError: (args) => {
            console.error(args.error.serverError);
            toast.error('Failed to create Label', {
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
        <LabelFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
