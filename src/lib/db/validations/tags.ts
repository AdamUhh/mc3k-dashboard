import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { tagItemsTable, tagsTable } from '../schemas/tags';

// Shared validation rules to maintain consistency and reduce duplication
const sharedValidationRules = {
    id: z.string(),
    name: z
        .string()
        .trim()
        .min(1, 'Tag name is required')
        .max(100, 'Tag name cannot exceed 100 characters'),

    tagItems: z
        .array(
            z.object({ id: z.string(), name: z.string(), tagId: z.string() })
        )
        .nullish(),
};

///**
// * Client-side schema for tag form validation
// * Can include additional fields or different validation rules specific to the client UI
// */
export const validateTagSchema = createInsertSchema(tagsTable, {
    name: sharedValidationRules.name,
}).omit({
    userId: true, // Handled by server authentication
});

export const validateTagItemSchema = createInsertSchema(tagItemsTable, {
    name: sharedValidationRules.name,
    tagId: sharedValidationRules.id,
}).omit({
    userId: true, // Handled by server authentication
});
/**
 * Server-side schema that matches database structure
 * Used for final validation before database operations
 */
export const extendedTagSchema = validateTagSchema;
export const extendedTagItemSchema = validateTagItemSchema;

/**
 * Schema for updating existing tags
 */
export const updateTagSchema = createUpdateSchema(tagsTable, {
    id: sharedValidationRules.id,
    name: sharedValidationRules.name,
})
    .extend({
        changedFields: z.array(z.string()).nullish(),
    })
    .omit({
        userId: true, // Handled by server authentication
    });

export const updateTagItemSchema = createUpdateSchema(tagItemsTable, {
    id: sharedValidationRules.id,
    name: sharedValidationRules.name,
    // tagId: sharedValidationRules.id, // There is no reason to have this frankly,
    // unless you want to be able to move tag items later
})
    .extend({
        changedFields: z.array(z.string()).nullish(),
    })
    .omit({
        userId: true, // Handled by server authentication
    });

/**
 * Schema for deleting tags
 * Only requires the ID field
 */
export const deleteTagSchema = validateTagSchema
    .pick({ id: true })
    .required({ id: true });

export const deleteTagItemSchema = validateTagSchema
    .pick({ id: true })
    .required({ id: true });

/**
 * This is component props for client-page.tsx
 */
export const clientTagListSchema = z
    .object({
        id: sharedValidationRules.id,
        name: sharedValidationRules.name,
    })
    .extend({
        tagItems: sharedValidationRules.tagItems,
    });
export type ClientTagListProps = z.infer<typeof clientTagListSchema>;

// Type exports for use in components and API handlers
export type ValidateTagType = z.infer<typeof validateTagSchema>;
export type ValidateTagItemType = z.infer<typeof validateTagItemSchema>;

export type ServerTagType = z.infer<typeof extendedTagSchema>;
export type ServerTagItemType = z.infer<typeof extendedTagItemSchema>;

export type UpdateTagType = z.infer<typeof updateTagSchema>;
export type UpdateTagItemType = z.infer<typeof updateTagItemSchema>;

export type DeleteTagType = z.infer<typeof deleteTagSchema>;
export type DeleteTagItemType = z.infer<typeof deleteTagItemSchema>;
