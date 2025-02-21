'use server';

import { ROUTES } from '@/constants/navigation';
import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-action';

import {
    deleteTagItemSchema,
    deleteTagSchema,
    updateTagItemSchema,
    updateTagSchema,
    validateTagItemSchema,
    validateTagSchema,
} from '@/db/validations/tags';

import {
    createTagItemUseCase,
    createTagUseCase,
    deleteTagItemUseCase,
    deleteTagUseCase,
    updateTagItemUseCase,
    updateTagUseCase,
} from '@/use-cases/tags';

// Actions will be used to authenticate, validate, and parse data to use case type
export const createTagAction = authActionClient
    .schema(validateTagSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await createTagUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.TAGS);
        return data;
    });

export const updateTagAction = authActionClient
    .schema(updateTagSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await updateTagUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.TAGS);
        return data;
    });

export const deleteTagAction = authActionClient
    .schema(deleteTagSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await deleteTagUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.TAGS);
        return data;
    });

// Tag Items
export const createTagItemAction = authActionClient
    .schema(validateTagItemSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await createTagItemUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.TAGS);
        return data;
    });

export const updateTagItemAction = authActionClient
    .schema(updateTagItemSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await updateTagItemUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.TAGS);
        return data;
    });

export const deleteTagItemAction = authActionClient
    .schema(deleteTagItemSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await deleteTagItemUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.TAGS);
        return data;
    });
