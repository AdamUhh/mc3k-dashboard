import { and, eq } from 'drizzle-orm';

import db from '@/db/index';
import { tagItemsTable, tagsTable } from '@/db/schemas/tags';
import {
    DeleteTagItemType,
    DeleteTagType,
    ServerTagItemType,
    ServerTagType,
} from '@/db/validations/tags';

// data access will be used to call the actual database
export async function getTags(authenticatedUser: string) {
    const result = await db.query.tagsTable.findMany({
        columns: {
            id: true,
            name: true,
        },
        with: {
            tagItems: {
                columns: {
                    id: true,
                    name: true,
                },
            },
        },
        where: (tags, { eq }) => eq(tags.userId, authenticatedUser),
    });
    return result;
}

export async function createTag(userId: string, values: ServerTagType) {
    const result = await db
        .insert(tagsTable)
        .values({ userId, ...values })
        .returning()
        .then((res) => res[0]);
    return result;
}
export async function updateTag(
    userId: string,
    values: Partial<ServerTagType> & { id: string }
) {
    const result = await db
        .update(tagsTable)
        .set({ ...values })
        .where(and(eq(tagsTable.userId, userId), eq(tagsTable.id, values.id)))
        .returning()
        .then((res) => res[0]);

    return result;
}
export async function deleteTag(userId: string, values: DeleteTagType) {
    const result = await db.transaction(async (tx) => {
        await tx
            .delete(tagItemsTable)
            .where(
                and(
                    eq(tagItemsTable.userId, userId),
                    eq(tagItemsTable.tagId, values.id)
                )
            )
            .returning();

        const res = await tx
            .delete(tagsTable)
            .where(
                and(eq(tagsTable.userId, userId), eq(tagsTable.id, values.id))
            )
            .returning();

        return res[0];
    });

    return result;
}

// Tag Items
export async function createTagItem(userId: string, values: ServerTagItemType) {
    const result = await db
        .insert(tagItemsTable)
        .values({ userId, ...values })
        .returning()
        .then((res) => res[0]);
    return result;
}

export async function updateTagItem(
    userId: string,
    values: Partial<ServerTagItemType> & { id: string }
) {
    const result = await db
        .update(tagItemsTable)
        .set({ ...values })
        .where(
            and(
                eq(tagItemsTable.userId, userId),
                eq(tagItemsTable.id, values.id)
            )
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteTagItem(userId: string, values: DeleteTagItemType) {
    const result = await db
        .delete(tagItemsTable)
        .where(
            and(
                eq(tagItemsTable.userId, userId),
                eq(tagItemsTable.id, values.id)
            )
        )
        .returning()
        .then((res) => res[0]);

    return result;
}
