'use server';

import { ROUTES } from '@/constants/navigation';
import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-action';

import {
    deleteModelSchema,
    updateModelSchema,
    validateModelSchema,
} from '@/db/validations/models';

import {
    createModelUseCase,
    deleteModelUseCase,
    updateModelUseCase,
} from '@/use-cases/models';

// Actions will be used to authenticate, validate, and parse data to use case type
export const createModelAction = authActionClient
    .schema(validateModelSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await createModelUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.MODELS);
        return data;
    });

export const updateModelAction = authActionClient
    .schema(updateModelSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await updateModelUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.MODELS);
        return data;
    });

export const deleteModelAction = authActionClient
    .schema(deleteModelSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await deleteModelUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.MODELS);
        return data;
    });
