'use server';

import { ROUTES } from '@/constants/navigation';
import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-action';

import {
    createProductSchema,
    deleteProductSchema,
    updateProductSchema,
} from '@/db/validations/products';

import {
    createProductUseCase,
    deleteProductUseCase,
    updateProductUseCase,
} from '@/use-cases/products';

// Actions will be used to authenticate, validate, and parse data to use case type
export const createProductAction = authActionClient
    .schema(createProductSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await createProductUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.PRODUCTS);
        return data;
    });

export const updateProductAction = authActionClient
    .schema(updateProductSchema.partial().required({ id: true }))
    .action(async ({ parsedInput, ctx }) => {
        const data = await updateProductUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.PRODUCTS);
        return data;
    });

export const deleteProductAction = authActionClient
    .schema(deleteProductSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await deleteProductUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.PRODUCTS);
        return data;
    });
