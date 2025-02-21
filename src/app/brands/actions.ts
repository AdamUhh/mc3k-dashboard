'use server';

import { ROUTES } from '@/constants/navigation';
import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-action';

import {
    deleteBrandSchema,
    updateBrandSchema,
    validateBrandSchema,
} from '@/db/validations/brands';

import {
    createBrandUseCase,
    deleteBrandUseCase,
    updateBrandUseCase,
} from '@/use-cases/brands';

// Actions will be used to authenticate, validate, and parse data to use case type
export const createBrandAction = authActionClient
    .schema(validateBrandSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await createBrandUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.BRANDS);
        return data;
    });

export const updateBrandAction = authActionClient
    .schema(updateBrandSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await updateBrandUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.BRANDS);
        return data;
    });

export const deleteBrandAction = authActionClient
    .schema(deleteBrandSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await deleteBrandUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.BRANDS);
        return data;
    });

