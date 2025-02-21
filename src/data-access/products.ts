import { and, eq } from 'drizzle-orm';

import db from '@/db/index';
import { collectionsTable } from '@/db/schemas/collections';
import {
    featuresTable,
    productsTable,
    productsToCollectionsTable,
} from '@/db/schemas/products';
import {
    DeleteFeatureType,
    DeleteProductToCollectionType,
    DeleteProductType,
    ServerFeature,
    ServerProduct,
    ServerProductsToCollection,
    UpdateProductFormType,
} from '@/db/validations/products';

export async function getCoreData(authenticatedUserId: string) {
    const [collections] = await Promise.all([
        db
            .select({
                id: collectionsTable.id,
                name: collectionsTable.name,
            })
            .from(collectionsTable)
            .where(eq(collectionsTable.userId, authenticatedUserId)),
    ]);

    return { collections };
}

// data access will be used to call the actual database
export async function getProducts(
    authenticatedUser: string
): Promise<UpdateProductFormType[]> {
    const result = await db.query.productsTable.findMany({
        columns: {
            id: true,
            name: true,
            handle: true,
            description: true,
            shortDescription: true,
            teaserDescription: true,
        },
        with: {
            features: {
                columns: {
                    id: true,
                    name: true,
                    description: true,
                    order: true,
                },
            },
            collections: {
                with: {
                    collection: {
                        columns: {
                            id: true, // Add this
                            name: true,
                        },
                    },
                },
                columns: {}, // Remove collectionId from here
            },
        },
        where: (product, { eq }) => eq(product.userId, authenticatedUser),
    });

    return result.map((product) => ({
        ...product,
        collections: product.collections.map((c) => ({
            id: c.collection.id,
            name: c.collection.name,
        })),
    })) as unknown as UpdateProductFormType[];

    // return result as unknown as UpdateProductFormType[];
}

export async function createProduct(userId: string, values: ServerProduct) {
    const result = await db
        .insert(productsTable)
        .values({
            ...values,
            userId,
            labelId: 'e2e1e447-364d-4e63-9c20-d50716dc2793',
            brandId: '17664728-969c-41a8-9dd8-60b0c86c1ff0',
            modelId: '00c4a755-f6d3-4f22-8043-fad47001975e',
        })
        .returning()
        .then((res) => res[0]);
    return result;
}

export async function createFeatures(
    features: (Omit<ServerFeature, 'id'> & { userId: string })[]
) {
    return db.insert(featuresTable).values(features).returning();
}

export async function createProductCollections(
    collections: (Omit<ServerProductsToCollection, 'id'> & { userId: string })[]
) {
    return db
        .insert(productsToCollectionsTable)
        .values(collections)
        .returning();
}

export async function updateProduct(
    userId: string,
    values: Partial<ServerProduct> & { id: string }
) {
    const { id, ...data } = values;
    return db
        .update(productsTable)
        .set(data)
        .where(and(eq(productsTable.id, id), eq(productsTable.userId, userId)))
        .returning()
        .then((res) => res[0]);
}

export async function updateFeature(
    userId: string,
    feature: Partial<ServerFeature> & { id: string }
) {
    return db
        .update(featuresTable)
        .set(feature)
        .where(
            and(
                eq(featuresTable.id, feature.id),
                eq(featuresTable.userId, userId)
            )
        )
        .returning();
}

export async function updateProductToCollections(
    userId: string,
    collection: Partial<ServerProductsToCollection> & { collectionId: string }
) {
    return db
        .update(productsToCollectionsTable)
        .set(collection)
        .where(
            and(
                eq(featuresTable.id, collection.collectionId),
                eq(featuresTable.userId, userId)
            )
        )
        .returning();
}

export async function deleteProduct(userId: string, values: DeleteProductType) {
    const result = await db
        .delete(productsTable)
        .where(
            and(
                eq(productsTable.userId, userId),
                eq(productsTable.id, values.id)
            )
        )
        .returning()
        .then((res) => res[0]);

    return result;
}

export async function deleteFeature(
    userId: string,
    feature: DeleteFeatureType
) {
    return db
        .delete(featuresTable)
        .where(
            and(
                eq(featuresTable.id, feature.id),
                eq(featuresTable.userId, userId)
            )
        );
}
export async function deleteProductToCollection(
    userId: string,
    collection: DeleteProductToCollectionType
) {
    return db
        .delete(productsToCollectionsTable)
        .where(
            and(
                eq(productsToCollectionsTable.collectionId, collection.id),
                eq(productsToCollectionsTable.userId, userId)
            )
        );
}

/* INFO: Dont delete this until you are done, it may be handy for something
 * The only issue, is that for bulk updates, it requires all columns that are being update to be used
 * if one array element has name, and the other does not, it wont work ._.
 */
// export function caseArrayStatement<T extends { id: number | string }>(
//     variants: Array<T>,
//     columnNames: Array<keyof T>
// ) {
//     const caseStatements: { [key in keyof T]?: SQL } = {};
//
//     for (const columnName of columnNames) {
//         const sqlChunks: SQL[] = [];
//         let hasValidValues = false;
//
//         sqlChunks.push(sql`(case`);
//
//         for (const variant of variants) {
//             const columnValue = variant[columnName];
//             if (columnValue !== undefined && columnValue !== null) {
//                 hasValidValues = true;
//                 if (columnName === 'order') {
//                     sqlChunks.push(
//                         sql`when ${featuresTable.id} = ${variant.id} then ${columnValue}::integer`
//                     );
//                 } else {
//                     sqlChunks.push(
//                         sql`when ${featuresTable.id} = ${variant.id} then ${columnValue}`
//                     );
//                 }
//             }
//         }
//
//         sqlChunks.push(sql`end)`);
//         if (hasValidValues) {
//             caseStatements[columnName] = sql.join(sqlChunks, sql.raw(' '));
//         }
//     }
//
//     return caseStatements;
// }
/* Function to bulk update multiple features at once */
// export async function updateFeatures(
//     userId: string,
//     features: (Partial<ServerFeatureType> & { id: string })[]
// ) {
//     if (features.length === 0) return;

// const val = [
//     {
//         id: '2f198cca-439d-4a8d-93b5-19d018dab7a8',
//         name: 'ta',
//         description: 'ta',
//         order: 0,
//     },
//     {
//         id: '2f198cca-439d-4a8d-93b5-19d018dab7a9',
//         name: 'qfa',
//         // description: 'qfa',
//         order: 1,
//     },
// ];

// Create the CASE statement for each feature column that needs to be updated
// const caseStatements = caseArrayStatement(val, [
//     'name',
//     'description',
//     'order',
// ]);

// await db
//     .update(featuresTable)
//     .set(caseStatements)
//     .where(
//         and(
//             inArray(
//                 featuresTable.id,
//                 features.map((f) => f.id)
//             ), // Filter by feature IDs
//             eq(featuresTable.userId, userId) // Ensure the user owns the features
//         )
//     )
//     .returning();
// }
