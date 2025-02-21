'use server';

import { ROUTES } from '@/constants/navigation';
import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-action';

import {
    deleteLabelSchema,
    updateLabelSchema,
    validateLabelSchema,
} from '@/db/validations/labels';

import {
    createLabelUseCase,
    deleteLabelUseCase,
    updateLabelUseCase,
} from '@/use-cases/labels';

// Actions will be used to authenticate, validate, and parse data to use case type
export const createLabelAction = authActionClient
    .schema(validateLabelSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await createLabelUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.LABELS);
        return data;
    });

export const updateLabelAction = authActionClient
    .schema(updateLabelSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await updateLabelUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.LABELS);
        return data;
    });

export const deleteLabelAction = authActionClient
    .schema(deleteLabelSchema)
    .action(async ({ parsedInput, ctx }) => {
        const data = await deleteLabelUseCase(ctx.userId, parsedInput);
        revalidatePath(ROUTES.LABELS);
        return data;
    });
