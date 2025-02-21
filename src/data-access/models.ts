import { and, eq } from 'drizzle-orm';

import db from '@/db/index';
import { modelsTable } from '@/db/schemas/models';
import { DeleteModelType, ServerModelType } from '@/db/validations/models';

// data access will be used to call the actual database
export async function getModels(authenticatedUser: string) {
    const result = await db
        .select({
            id: modelsTable.id,
            name: modelsTable.name,
            handle: modelsTable.handle,
        })
        .from(modelsTable)
        .where(eq(modelsTable.userId, authenticatedUser));
    return result;
}

export async function createModel(userId: string, values: ServerModelType) {
    const result = await db
        .insert(modelsTable)
        .values({ userId, ...values })
        .returning()
        .then((res) => res[0]);
    return result;
}
export async function updateModel(
    userId: string,
    values: Partial<ServerModelType> & { id: string }
) {
    const result = await db
        .update(modelsTable)
        .set({ ...values })
        .where(
            and(eq(modelsTable.userId, userId), eq(modelsTable.id, values.id))
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteModel(userId: string, values: DeleteModelType) {
    const result = await db
        .delete(modelsTable)
        .where(
            and(eq(modelsTable.userId, userId), eq(modelsTable.id, values.id))
        )
        .returning()
        .then((res) => res[0]);

    return result;
}
