import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { modelsTable } from '../schemas/models';

// Shared validation rules to maintain consistency and reduce duplication
const sharedValidationRules = {
    id: z.string(),
    name: z
        .string()
        .trim()
        .min(1, 'Model name is required')
        .max(100, 'Model name cannot exceed 100 characters'),
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
};

///**
// * Client-side schema for model form validation
// * Can include additional fields or different validation rules specific to the client UI
// */
export const validateModelSchema = createInsertSchema(modelsTable, {
    name: sharedValidationRules.name,
    handle: sharedValidationRules.handle,
}).omit({
    userId: true, // Handled by server authentication
});
/**
 * Server-side schema that matches database structure
 * Used for final validation before database operations
 */
export const extendedModelSchema = validateModelSchema;

/**
 * Schema for updating existing models
 */
export const updateModelSchema = createUpdateSchema(modelsTable, {
    id: sharedValidationRules.id,
    name: sharedValidationRules.name,
    handle: sharedValidationRules.handle,
})
    .extend({
        changedFields: z.array(z.string()).nullish(),
    })
    .omit({
        userId: true, // Handled by server authentication
    });

/**
 * Schema for deleting models
 * Only requires the ID field
 */
export const deleteModelSchema = validateModelSchema
    .pick({ id: true })
    .required({ id: true });

// Type exports for use in components and API handlers
export type ValidateModelType = z.infer<typeof validateModelSchema>;
export type ServerModelType = z.infer<typeof extendedModelSchema>;

export type UpdateModelType = z.infer<typeof updateModelSchema>;

export type DeleteModelType = z.infer<typeof deleteModelSchema>;
