import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { collectionsTable } from '../schemas/collections';
import {
    featuresTable,
    productsTable,
    productsToCollectionsTable,
} from '../schemas/products';

// const MAX_FILE_SIZE = 2 * 1024 * 1024;
// const ACCEPTED_IMAGE_TYPES = [
//     'image/jpeg',
//     'image/jpg',
//     'image/png',
//     'image/webp',
// ];
//
// const nonNegativeInt = z.coerce
//     .number()
//     .nonnegative('Value must not be negative')
//     .int('Value must be an integer');
//
// const nonNegativeNumber = z.coerce
//     .number()
//     .nonnegative('Value must not be negative');
//
// const imageValidation = z.object({
//     id: z.string(),
//     type: z.enum(['url', 'file']).default('url'),
//     order: z.number(),
//     isNew: z.boolean().nullish(),
//     blob: z.string().nullish(),
//     toDelete: z.boolean().nullish(),
//     data: z.union([
//         z.string(),
//         z
//             .custom<File>((val) => val instanceof File, 'Please upload a file')
//             .refine(
//                 (file) => file?.size <= MAX_FILE_SIZE,
//                 `Max image size is 2MB.`
//             )
//             .refine(
//                 (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//                 'Only .jpg, .jpeg, .png, and .webp formats are supported.'
//             ),
//     ]),
// });
//
// // Shared validation rules to maintain consistency and reduce duplication
// const sharedValidationRules = {
//     id: z.string(),
//     name: z
//         .string()
//         .trim()
//         .min(1, 'Product name is required')
//         .max(100, 'Product name cannot exceed 100 characters'),
//     handle: z
//         .string()
//         .trim()
//         .min(1, 'Handle is required')
//         .max(100, 'Handle cannot exceed 100 characters')
//         .regex(
//             /^[a-z0-9-]+$/,
//             'Handle can only contain lowercase letters, numbers, and hyphens'
//         )
//         .refine(
//             (value) => !value.startsWith('-') && !value.endsWith('-'),
//             'Handle cannot start or end with a hyphen'
//         ),
//
//     description: z.string().trim().min(1, 'Main description is required'),
//     shortDescription: z.string().trim().nullish(),
//     teaserDescription: z.string().trim().nullish(),
//     brandId: z.string().trim().min(1, 'Brand is required'),
//     modelId: z.string().trim().min(1, 'Model is required'),
//     labelId: z.string().trim().min(1, 'Label is required'),
//     collectionIds: z
//         .array(z.object({ name: z.string(), id: z.string() }))
//         .min(1, 'At least one collection is required'),
//     productImages: z
//         .array(imageValidation)
//         .refine(
//             (images) =>
//                 images.filter((image) => image.toDelete !== true).length > 0,
//             'At least one image is required.'
//         ),
//     features: z
//         .array(
//             z.object({
//                 id: z.string(),
//                 isNew: z.boolean().nullish(),
//                 toDelete: z.boolean().nullish(),
//                 name: z.string().trim().min(1, 'Feature name is required'),
//                 description: z
//                     .string()
//                     .trim()
//                     .min(1, 'Feature description is required'),
//                 order: z.number().nullish(),
//             })
//         )
//         .nullish(),
//     serverFeatures: z
//         .array(
//             z.object({
//                 id: z.string().nonempty(),
//                 name: z.string().trim().nullish(),
//                 description: z.string().trim().nullish(),
//                 order: z.number().nullish(),
//             })
//         )
//         .nullish(),
//     tags: z
//         .array(
//             z.object({
//                 id: z.string().trim().min(1, { message: 'Tag is required' }),
//                 name: z.string(),
//                 tagItems: z
//                     .array(
//                         z.object({
//                             id: z.string(),
//                             name: z.string(),
//                         })
//                     )
//                     .min(1, { message: 'Tag Item is required' }),
//             })
//         )
//         .nullish(),
//     variants: z.array(
//         z.object({
//             id: z.string(),
//             toDelete: z.boolean().nullish(),
//             name: z
//                 .string()
//                 .trim()
//                 .min(1, { message: 'Variant name is required' }),
//             quantity: nonNegativeInt,
//             price: nonNegativeNumber.nullish(),
//             discountedPrice: nonNegativeNumber.nullish(),
//             order: z.number(),
//             isNew: z.boolean().nullish(),
//             images: z
//                 .array(imageValidation)
//                 .refine(
//                     (images) =>
//                         images.filter((image) => image.toDelete !== true)
//                             .length > 0,
//                     'At least one image is required.'
//                 ),
//         })
//     ),
// };
//
// ///**
// // * Client-side schema for product form validation
// // * Can include additional fields or different validation rules specific to the client UI
// // */
// export const validateProductSchema = createInsertSchema(productsTable, {
//     name: sharedValidationRules.name,
//     handle: sharedValidationRules.handle,
//     // brandId: sharedValidationRules.brandId,
//     // modelId: sharedValidationRules.modelId,
//     // labelId: sharedValidationRules.labelId,
//     description: sharedValidationRules.description,
//     teaserDescription: sharedValidationRules.teaserDescription,
//     shortDescription: sharedValidationRules.shortDescription,
// })
//     .extend({
//         brandId: z.string().nullish(),
//         modelId: z.string().nullish(),
//         labelId: z.string().nullish(),
//         features: sharedValidationRules.features,
//         // productImages: sharedValidationRules.productImages,
//         // collectionIds: sharedValidationRules.collectionIds,
//         // variants: sharedValidationRules.variants,
//         // tags: sharedValidationRules.tags,
//     })
//     .omit({
//         userId: true, // Handled by server authentication
//     });
// /**
//  * Server-side schema that matches database structure
//  * Used for final validation before database operations
//  */
// export const extendedProductSchema = validateProductSchema.pick({
//     name: true,
//     handle: true,
//     description: true,
//     teaserDescription: true,
//     shortDescription: true,
//     // modelId:true,
//     // brandId:true,
//     // labelId:true,
//     // status:true,
// });
//
// export const extendedFeatureSchema = z.object({
//     name: z.string().trim(),
//     description: z.string().trim(),
//     order: z.number(),
//     productId: z.string(),
// });
//
// /**
//  * Schema for updating existing products
//  */
// export const updateProductFormSchema = createUpdateSchema(productsTable, {
//     id: sharedValidationRules.id,
//     name: sharedValidationRules.name,
//     handle: sharedValidationRules.handle,
//     // brandId: sharedValidationRules.brandId,
//     // modelId: sharedValidationRules.modelId,
//     // labelId: sharedValidationRules.labelId,
//     description: sharedValidationRules.description,
//     teaserDescription: sharedValidationRules.teaserDescription,
//     shortDescription: sharedValidationRules.shortDescription,
// })
//     .extend({
//         brandId: z.string().nullish(),
//         modelId: z.string().nullish(),
//         labelId: z.string().nullish(),
//         features: sharedValidationRules.features,
//         // productImages: sharedValidationRules.productImages,
//         // collectionIds: sharedValidationRules.collectionIds,
//         // variants: sharedValidationRules.variants,
//         // tags: sharedValidationRules.tags,
//
//         // changedFields: z.record(z.string(), z.unknown()).nullish(),
//     })
//
//     .omit({
//         userId: true, // Handled by server authentication
//     });
//
// export const updateProductSchema = createUpdateSchema(productsTable, {
//     id: sharedValidationRules.id,
//     name: sharedValidationRules.name,
//     handle: sharedValidationRules.handle,
//     // brandId: sharedValidationRules.brandId,
//     // modelId: sharedValidationRules.modelId,
//     // labelId: sharedValidationRules.labelId,
//     description: sharedValidationRules.description,
//     teaserDescription: sharedValidationRules.teaserDescription,
//     shortDescription: sharedValidationRules.shortDescription,
// })
//     .extend({
//         brandId: z.string().nullish(),
//         modelId: z.string().nullish(),
//         labelId: z.string().nullish(),
//         features: z.object({
//             updateFeatures: sharedValidationRules.serverFeatures,
//             newFeatures: sharedValidationRules.serverFeatures,
//             deleteFeatures: sharedValidationRules.serverFeatures,
//         }),
//         // productImages: sharedValidationRules.productImages,
//         // collectionIds: sharedValidationRules.collectionIds,
//         // variants: sharedValidationRules.variants,
//         // tags: sharedValidationRules.tags,
//
//         // changedFields: z.record(z.string(), z.unknown()).nullish(),
//     })
//
//     .omit({
//         userId: true, // Handled by server authentication
//     });
//
// /**
//  * Schema for deleting products
//  * Only requires the ID field
//  */
// export const deleteProductSchema = validateProductSchema
//     .pick({ id: true })
//     .required({ id: true });
// export const deleteFeatureSchema = validateProductSchema
//     .pick({ id: true })
//     .required({ id: true });
//
// // Type exports for use in components and API handlers
// export type ValidateProductType = z.infer<typeof validateProductSchema>;
// export type ServerProductType = z.infer<typeof extendedProductSchema>;
// export type ServerFeatureType = z.infer<typeof extendedFeatureSchema>;
//
// // this is expected type for initialdata, and form input data
// // TODO: This could just be validateproducttype, and add id
// export type UpdateProductFormType = z.infer<typeof updateProductFormSchema>;
//
// // this is expected type, formatted/optimized on client side before sending to server action
// export type UpdateProductType = z.infer<typeof updateProductSchema>;
//
// export type DeleteProductType = z.infer<typeof deleteProductSchema>;
// export type DeleteFeatureType = z.infer<typeof deleteFeatureSchema>;

/**
 * Validation schemas
 */
const baseValidation = {
    name: z.string().trim().min(1, 'Name is required').max(100),
    description: z.string().trim().min(1, 'Description is required'),
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
    brandId: z.string().nullish(),
    modelId: z.string().nullish(),
    labelId: z.string().nullish(),
};

/**
 * Base schemas
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseProductSchema = createInsertSchema(productsTable);
const baseFeatureSchema = createInsertSchema(featuresTable);
const baseCollectionSchema = createInsertSchema(collectionsTable);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseProductsToCollectionSchema = createInsertSchema(
    productsToCollectionsTable
);

const featureValidation = baseFeatureSchema
    .extend({
        name: z.string().trim().min(1, 'Feature name is required'),
        description: z
            .string()
            .trim()
            .min(1, 'Feature description is required'),
        order: z.number(),
        isNew: z.boolean().nullish(),
        toDelete: z.boolean().nullish(),
    })
    .omit({ userId: true });

const collectionValidation = baseCollectionSchema
    .extend({
        name: z.string().trim().min(1, 'Collection name is required'),
        isNew: z.boolean().nullish(),
        toDelete: z.boolean().nullish(),
    })
    .omit({ userId: true, handle: true, img: true, description: true });

/**
 * Type definitions
 */
type ServerProduct = Omit<z.infer<typeof baseProductSchema>, 'userId'>;
type ServerFeature = Omit<z.infer<typeof baseFeatureSchema>, 'userId'>;
type ServerCollection = Omit<
    z.infer<typeof baseCollectionSchema>,
    'userId' | 'img' | 'handle' | 'description'
>;
type ServerProductsToCollection = Omit<
    z.infer<typeof baseProductsToCollectionSchema>,
    'userId'
>;

/**
 * Product schemas
 */
export const createProductSchema = createInsertSchema(
    productsTable,
    productValidation
)
    .extend({
        features: z
            .array(
                featureValidation
                    .extend({ id: z.string() }) // Enforce string ID
                    .omit({
                        toDelete: true, // Not needed for creation
                        productId: true, // Added on the server
                    })
            )
            .nullish(),

        collections: z
            .array(
                collectionValidation
                    .extend({ id: z.string() }) // Enforce string ID
                    .omit({
                        toDelete: true, // Not needed for creation
                    })
            )
            .min(1, 'Atleast one collection is required'),
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
            .min(1, 'Atleast one collection is required'),
    })
    .omit({ userId: true });

export const updateProductSchema = createUpdateSchema(productsTable, {
    ...productValidation,
    id: z.string(),
})
    .extend({
        features: z.object({
            updateFeatures: z
                .array(baseFeatureSchema.partial().required({ id: true }))
                .nullish(),
            newFeatures: z
                .array(baseFeatureSchema.omit({ id: true, userId: true }))
                .nullish(),
            deleteFeatures: z
                .array(
                    baseFeatureSchema.pick({ id: true }).required({ id: true })
                )
                .nullish(),
        }),
        collections: z.object({
            updateCollections: z
                .array(collectionValidation.partial().required({ id: true }))
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

/**
 * Delete schemas
 */
export const deleteProductSchema = z.object({ id: z.string() });
export const deleteFeatureSchema = z.object({ id: z.string() });
export const deleteProductToCollectionSchema = z.object({ id: z.string() });

/**
 * Type exports
 */
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

export type {
    ServerCollection,
    ServerFeature,
    ServerProduct,
    ServerProductsToCollection,
};
