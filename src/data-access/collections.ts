import { and, eq } from 'drizzle-orm';

import db from '@/db/index';
import { collectionsTable } from '@/db/schemas/collections';
import {
    DeleteCollectionType,
    ServerCollectionType,
} from '@/db/validations/collections';

// data access will be used to call the actual database
export async function getCollections(authenticatedUser: string) {
    const result = await db
        .select({
            id: collectionsTable.id,
            name: collectionsTable.name,
            handle: collectionsTable.handle,
            description: collectionsTable.description,
            img: collectionsTable.img,
        })
        .from(collectionsTable)
        .where(eq(collectionsTable.userId, authenticatedUser));
    return result;
}

export async function createCollection(
    userId: string,
    values: ServerCollectionType
) {
    const result = await db
        .insert(collectionsTable)
        .values({ userId, ...values })
        .returning()
        .then((res) => res[0]);
    return result;
}
export async function updateCollection(
    userId: string,
    values: Partial<ServerCollectionType> & { id: string }
) {
    const result = await db
        .update(collectionsTable)
        .set({ ...values })
        .where(
            and(
                eq(collectionsTable.userId, userId),
                eq(collectionsTable.id, values.id)
            )
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteCollection(
    userId: string,
    values: DeleteCollectionType
) {
    const result = await db
        .delete(collectionsTable)
        .where(
            and(
                eq(collectionsTable.userId, userId),
                eq(collectionsTable.id, values.id)
            )
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteCollectionImg(
    userId: string,
    values: DeleteCollectionType
) {
    const result = await db
        .update(collectionsTable)
        .set({ img: null })
        .where(
            and(
                eq(collectionsTable.userId, userId),
                eq(collectionsTable.id, values.id)
            )
        )
        .returning()
        .then((res) => res[0]);

    return result;
}
