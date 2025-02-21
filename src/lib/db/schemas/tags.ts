import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { users } from './users';

export const tagsTable = pgTable('tags', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    userId: text('userId')
        .notNull()
        .references(() => users.id),
});

export const tagItemsTable = pgTable('tag_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    tagId: uuid('tagId')
        .notNull()
        .references(() => tagsTable.id),
    userId: text('userId')
        .notNull()
        .references(() => users.id),
});

export const tagsRelations = relations(tagsTable, ({ many }) => ({
    tagItems: many(tagItemsTable),
}));

export const tagItemsRelations = relations(tagItemsTable, ({ one }) => ({
    tag: one(tagsTable, {
        fields: [tagItemsTable.tagId, tagItemsTable.userId],
        references: [tagsTable.id, tagsTable.userId],
    }),
}));
