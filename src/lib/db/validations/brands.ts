import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { brandsTable } from '../schemas/brands';

// Shared validation rules to maintain consistency and reduce duplication
const sharedValidationRules = {
    id: z.string(),
    name: z
        .string()
        .trim()
        .min(1, 'Brand name is required')
        .max(100, 'Brand name cannot exceed 100 characters'),
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
    img: z.union([z.string().nullish(), z.instanceof(File).nullish()]),
};

///**
// * Client-side schema for brand form validation
// * Can include additional fields or different validation rules specific to the client UI
// */
export const validateBrandSchema = createInsertSchema(brandsTable, {
    name: sharedValidationRules.name,
    handle: sharedValidationRules.handle,
    img: sharedValidationRules.img,
}).omit({
    userId: true, // Handled by server authentication
});
/**
 * Server-side schema that matches database structure
 * Used for final validation before database operations
 */
export const extendedBrandSchema = validateBrandSchema.extend({
    img: z.string().nullish(),
});

/**
 * Schema for updating existing brands
 * Includes all fields from insert schema but marks them as optional
 */
export const updateBrandSchema = createUpdateSchema(brandsTable, {
    id: sharedValidationRules.id,
    name: sharedValidationRules.name,
    handle: sharedValidationRules.handle,
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
 * Schema for deleting brands
 * Only requires the ID field
 */
export const deleteBrandSchema = validateBrandSchema
    .extend({ img: z.string().nullish() })
    .pick({ id: true, img: true })
    .required({ id: true });

// Type exports for use in components and API handlers
export type ValidateBrandType = z.infer<typeof validateBrandSchema>;
export type ServerBrandType = z.infer<typeof extendedBrandSchema>;

export type UpdateBrandType = z.infer<typeof updateBrandSchema>;

export type DeleteBrandType = z.infer<typeof deleteBrandSchema>;
