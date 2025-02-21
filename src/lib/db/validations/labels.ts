import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { labelsTable } from '../schemas/labels';

// Shared validation rules to maintain consistency and reduce duplication
const sharedValidationRules = {
    id: z.string(),
    name: z
        .string()
        .trim()
        .min(1, 'Label is required')
        .max(50, 'Label cannot exceed 50 characters'),
};

///**
// * Client-side schema for label form validation
// * Can include additional fields or different validation rules specific to the client UI
// */
export const validateLabelSchema = createInsertSchema(labelsTable, {
    name: sharedValidationRules.name,
}).omit({
    userId: true, // Handled by server authentication
});
/**
 * Server-side schema that matches database structure
 * Used for final validation before database operations
 */
export const extendedLabelSchema = validateLabelSchema;

/**
 * Schema for updating existing labels
 */
export const updateLabelSchema = createUpdateSchema(labelsTable, {
    id: sharedValidationRules.id,
    name: sharedValidationRules.name,
})
    .extend({
        changedFields: z.array(z.string()).nullish(),
    })
    .omit({
        userId: true, // Handled by server authentication
    });

/**
 * Schema for deleting labels
 * Only requires the ID field
 */
export const deleteLabelSchema = validateLabelSchema
    .pick({ id: true })
    .required({ id: true });

// Type exports for use in components and API handlers
export type ValidateLabelType = z.infer<typeof validateLabelSchema>;
export type ServerLabelType = z.infer<typeof extendedLabelSchema>;

export type UpdateLabelType = z.infer<typeof updateLabelSchema>;

export type DeleteLabelType = z.infer<typeof deleteLabelSchema>;
