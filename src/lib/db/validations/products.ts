import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { collectionsTable } from '../schemas/collections';
import {
    featuresTable,
    productsTable,
    productsToCollectionsTable,
} from '../schemas/products';

const baseValidation = {
    name: z.string().trim().min(1, 'Name is required').max(100),
    description: z.string().trim().min(1, 'Description is required'),
};

const fieldValidation = {
    isNew: z.boolean().nullish(),
    toDelete: z.boolean().nullish(),
};

const productValidation = {
    ...baseValidation,
    handle: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .regex(/^[a-z0-9-]+$/)
        .refine((val) => !val.startsWith('-') && !val.endsWith('-')),
    shortDescription: z.string().trim().nullish(),
    teaserDescription: z.string().trim().nullish(),
    brandId: z.string().trim().min(1, 'Brand is required'),
    modelId: z.string().trim().min(1, 'Model is required'),
    labelId: z.string().nullish(),
};

const baseSchemas = {
    product: createInsertSchema(productsTable),
    feature: createInsertSchema(featuresTable),
    collection: createInsertSchema(collectionsTable),
    productsToCollection: createInsertSchema(productsToCollectionsTable),
};

const featureValidation = baseSchemas.feature
    .extend({
        name: baseValidation.name,
        description: baseValidation.description,
        order: z.number(),
        ...fieldValidation,
    })
    .omit({ userId: true });

const collectionValidation = baseSchemas.collection
    .extend({
        name: baseValidation.name,
        ...fieldValidation,
    })
    .omit({ userId: true, handle: true, img: true, description: true });

export const createProductSchema = createInsertSchema(
    productsTable,
    productValidation
)
    .extend({
        features: z
            .array(
                featureValidation
                    .extend({ id: z.string() })
                    .omit({ toDelete: true, productId: true })
            )
            .nullish(),
        collections: z
            .array(
                collectionValidation
                    .extend({ id: z.string() })
                    .omit({ toDelete: true })
            )
            .min(1, 'At least one collection is required'),
    })
    .omit({ userId: true });

export const updateProductFormSchema = createUpdateSchema(productsTable, {
    ...productValidation,
    id: z.string(),
})
    .extend({
        features: z
            .array(featureValidation.omit({ productId: true }))
            .nullish(),
        collections: z
            .array(collectionValidation)
            .min(1, 'At least one collection is required'),
    })
    .omit({ userId: true });

export const updateProductSchema = createUpdateSchema(productsTable, {
    ...productValidation,
    id: z.string(),
})
    .extend({
        features: z.object({
            updateFeatures: z
                .array(baseSchemas.feature.partial().required({ id: true }))
                .nullish(),
            newFeatures: z
                .array(baseSchemas.feature.omit({ id: true, userId: true }))
                .nullish(),
            deleteFeatures: z
                .array(
                    baseSchemas.feature
                        .pick({ id: true })
                        .required({ id: true })
                )
                .nullish(),
        }),
        collections: z.object({
            updateCollections: z
                .array(
                    collectionValidation
                        .extend({ newId: z.string() })
                        .partial()
                        .required({ id: true, newId: true })
                )
                .nullish(),
            newCollections: z
                .array(collectionValidation.required({ id: true }))
                .nullish(),
            deleteCollections: z
                .array(
                    collectionValidation
                        .pick({ id: true })
                        .required({ id: true })
                )
                .nullish(),
        }),
    })
    .omit({ userId: true });

export const deleteProductSchema = z.object({ id: z.string() });
export const deleteFeatureSchema = z.object({ id: z.string() });
export const deleteProductToCollectionSchema = z.object({ id: z.string() });

export type UpdateProductFormType = z.infer<typeof updateProductFormSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;
export type CreateProductType = z.infer<typeof createProductSchema>;
export type DeleteProductType = z.infer<typeof deleteProductSchema>;
export type Feature = z.infer<typeof featureValidation>;
export type DeleteFeatureType = z.infer<typeof deleteFeatureSchema>;
export type Collection = z.infer<typeof collectionValidation>;
export type DeleteProductToCollectionType = z.infer<
    typeof deleteProductToCollectionSchema
>;

export type ServerProduct = Omit<z.infer<typeof baseSchemas.product>, 'userId'>;
export type ServerFeature = Omit<z.infer<typeof baseSchemas.feature>, 'userId'>;
export type ServerCollection = Omit<
    z.infer<typeof baseSchemas.collection>,
    'userId' | 'img' | 'handle' | 'description'
>;
export type ServerProductsToCollection = Omit<
    z.infer<typeof baseSchemas.productsToCollection>,
    'userId'
>;
