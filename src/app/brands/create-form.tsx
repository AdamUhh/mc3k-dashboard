'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import {
    ValidateBrandType,
    validateBrandSchema,
} from '@/db/validations/brands';

import { createBrandAction } from './actions';
import { BrandFormBase } from './form-base';

export function CreateBrandForm() {
    const form = useForm<ValidateBrandType>({
        resolver: zodResolver(validateBrandSchema),
        defaultValues: {
            name: '',
            handle: '',
            img: null,
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(createBrandAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Creating Brand', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Brand Created', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: (args) => {
            console.error(args.error.serverError);
            toast.error('Failed to create Brand', {
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
        <BrandFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
