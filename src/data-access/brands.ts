import { and, eq } from 'drizzle-orm';

import db from '@/db/index';
import { brandsTable } from '@/db/schemas/brands';
import { DeleteBrandType, ServerBrandType } from '@/db/validations/brands';

// data access will be used to call the actual database
export async function getBrands(authenticatedUser: string) {
    const result = await db
        .select({
            id: brandsTable.id,
            name: brandsTable.name,
            handle: brandsTable.handle,
            img: brandsTable.img,
        })
        .from(brandsTable)
        .where(eq(brandsTable.userId, authenticatedUser));
    return result;
}

export async function createBrand(userId: string, values: ServerBrandType) {
    const result = await db
        .insert(brandsTable)
        .values({ userId, ...values })
        .returning()
        .then((res) => res[0]);
    return result;
}
export async function updateBrand(
    userId: string,
    values: Partial<ServerBrandType> & { id: string }
) {
    const result = await db
        .update(brandsTable)
        .set({ ...values })
        .where(
            and(eq(brandsTable.userId, userId), eq(brandsTable.id, values.id))
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteBrand(userId: string, values: DeleteBrandType) {
    const result = await db
        .delete(brandsTable)
        .where(
            and(eq(brandsTable.userId, userId), eq(brandsTable.id, values.id))
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteBrandImg(userId: string, values: DeleteBrandType) {
    const result = await db
        .update(brandsTable)
        .set({ img: null })
        .where(
            and(eq(brandsTable.userId, userId), eq(brandsTable.id, values.id))
        )
        .returning()
        .then((res) => res[0]);

    return result;
}
