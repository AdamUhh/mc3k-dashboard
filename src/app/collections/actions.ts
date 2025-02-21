'use server';

import { ROUTES } from '@/constants/navigation';
import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-action';

import {
    deleteCollectionSchema,
    updateCollectionSchema,
    validateCollectionSchema,
} from '@/db/validations/collections';

import {
    createCollectionUseCase,
    deleteCollectionUseCase,
    updateCollectionUseCase,
} from '@/use-cases/collections';

// Actions will be used to authenticate, validate, and parse data to use case type
export const createCollectionAction = authActionClient
    .schema(validateCollectionSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await createCollectionUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.COLLECTIONS);
        return data;
    });

export const updateCollectionAction = authActionClient
    .schema(updateCollectionSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await updateCollectionUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.COLLECTIONS);
        return data;
    });

export const deleteCollectionAction = authActionClient
    .schema(deleteCollectionSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await deleteCollectionUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.COLLECTIONS);
        return data;
    });
