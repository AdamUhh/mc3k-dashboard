'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import {
    CreateProductType,
    createProductSchema,
} from '@/db/validations/products';

import { createProductAction } from './actions';
import { ProductFormBase } from './form-base';

export function CreateProductForm() {
    const form = useForm<CreateProductType>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: '',
            handle: '',
            description: '',
            features: [],
            collections: [],
        },
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
    const { execute, isPending } = useAction(createProductAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Creating Product', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Product Created', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: ({ error }) => {
            if (error.validationErrors) {
                console.error('validation error', error.validationErrors);
            }
            if (error.serverError) {
                console.error('server error', error.serverError);
            }
            toast.error('Failed to create Product', {
                id: form.getValues().name,
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('form values', JSON.stringify(form.getValues(), null, 2));
        console.log('form errors', form.formState.errors);

        form.handleSubmit(execute)();
    };

    return (
        <ProductFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
