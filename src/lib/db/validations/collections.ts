import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { collectionsTable } from '../schemas/collections';

// Shared validation rules to maintain consistency and reduce duplication
const sharedValidationRules = {
    id: z.string(),
    name: z
        .string()
        .trim()
        .min(1, 'Collection name is required')
        .max(100, 'Collection name cannot exceed 100 characters'),
    handle: z
        .string()
        .trim()
        .min(1, 'Handle is required')
        .max(100, 'Handle cannot exceed 100 characters')
        .regex(
            /^[a-z0-9-]+$/,
            'Handle can only contain lowercase letters, numbers, and hyphens'
        )
        .refine(
            (value) => !value.startsWith('-') && !value.endsWith('-'),
            'Handle cannot start or end with a hyphen'
        ),
    description: z
        .string()
        .trim()
        .max(2000, 'Collection description cannot exceed 2000 characters')
        .nullish(),
    img: z.union([z.string().nullish(), z.instanceof(File).nullish()]),
};

///**
// * Client-side schema for collection form validation
// * Can include additional fields or different validation rules specific to the client UI
// */
export const validateCollectionSchema = createInsertSchema(collectionsTable, {
    name: sharedValidationRules.name,
    handle: sharedValidationRules.handle,
    description: sharedValidationRules.description,
    img: sharedValidationRules.img,
}).omit({
    userId: true, // Handled by server authentication
});
/**
 * Server-side schema that matches database structure
 * Used for final validation before database operations
 */
export const extendedCollectionSchema = validateCollectionSchema.extend({
    img: z.string().nullish(),
});

/**
 * Schema for updating existing collections
 * Includes all fields from insert schema but marks them as optional
 */
export const updateCollectionSchema = createUpdateSchema(collectionsTable, {
    id: sharedValidationRules.id,
    name: sharedValidationRules.name,
    handle: sharedValidationRules.handle,
    description: sharedValidationRules.description,
    img: sharedValidationRules.img,
})
    .extend({
        originalImg: z.string().nullish(),
        changedFields: z.array(z.string()).nullish(),
    })
    .omit({
        userId: true, // Handled by server authentication
    });

/**
 * Schema for deleting collections
 * Only requires the ID field
 */
export const deleteCollectionSchema = validateCollectionSchema
    .extend({ img: z.string().nullish() })
    .pick({ id: true, img: true })
    .required({ id: true });

// Type exports for use in components and API handlers
export type ValidateCollectionType = z.infer<typeof validateCollectionSchema>;
export type ServerCollectionType = z.infer<typeof extendedCollectionSchema>;

export type UpdateCollectionType = z.infer<typeof updateCollectionSchema>;

export type DeleteCollectionType = z.infer<typeof deleteCollectionSchema>;
