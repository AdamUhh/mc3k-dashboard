import { and, eq } from 'drizzle-orm';

import db from '@/db/index';
import { labelsTable } from '@/db/schemas/labels';
import { DeleteLabelType, ServerLabelType } from '@/db/validations/labels';

// data access will be used to call the actual database
export async function getLabels(authenticatedUser: string) {
    const result = await db
        .select({
            id: labelsTable.id,
            name: labelsTable.name,
        })
        .from(labelsTable)
        .where(eq(labelsTable.userId, authenticatedUser));
    return result;
}

export async function createLabel(userId: string, values: ServerLabelType) {
    const result = await db
        .insert(labelsTable)
        .values({ userId, ...values })
        .returning()
        .then((res) => res[0]);
    return result;
}
export async function updateLabel(
    userId: string,
    values: Partial<ServerLabelType> & { id: string }
) {
    const result = await db
        .update(labelsTable)
        .set({ ...values })
        .where(
            and(eq(labelsTable.userId, userId), eq(labelsTable.id, values.id))
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteLabel(userId: string, values: DeleteLabelType) {
    const result = await db
        .delete(labelsTable)
        .where(
            and(eq(labelsTable.userId, userId), eq(labelsTable.id, values.id))
        )
        .returning()
        .then((res) => res[0]);

    return result;
}
