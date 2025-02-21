import {
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

import { brandsTable } from './brands';
import { collectionsTable } from './collections';
import { labelsTable } from './labels';
import { modelsTable } from './models';
import { tagItemsTable, tagsTable } from './tags';
import { users } from './users';

// TODO: Not sure if this will work for cockroachdb
export const statusEnum = pgEnum('status', ['active', 'inactive']);

export const productsTable = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    handle: text('handle').notNull().unique(),
    description: text('description').notNull(),
    shortDescription: text('short_description'),
    teaserDescription: text('teaser_description'),
    status: statusEnum('status').default('active'),
    modelId: uuid('model_id')
        .notNull()
        .references(() => modelsTable.id),
    brandId: uuid('brand_id')
        .notNull()
        .references(() => brandsTable.id),
    labelId: uuid('label_id')
        .notNull()
        .references(() => labelsTable.id),
    userId: text('userId')
        .notNull()
        .references(() => users.id),
});

export const productImagesTable = pgTable(
    'product_images',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        img: text('img').notNull(),
        order: integer('order').notNull(),
        productId: uuid('product_id')
            .notNull()
            .references(() => productsTable.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id),
    },
    (table) => [
        uniqueIndex('order_product_images').on(table.productId, table.order),
    ]
);

export const featuresTable = pgTable(
    'features',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: text('name').notNull(),
        description: text('description').notNull(),
        order: integer('order').notNull(),
        productId: uuid('product_id')
            .notNull()
            .references(() => productsTable.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id),
    }
    // (table) => [
    //     uniqueIndex('order_product_features').on(
    //         table.productId,
    //         table.order,
    //     ),
    // ]
);

export const productsRelation = relations(productsTable, ({ many }) => ({
    features: many(featuresTable),
    collections: many(productsToCollectionsTable),
}));

export const featuresRelation = relations(featuresTable, ({ one }) => ({
    product: one(productsTable, {
        fields: [featuresTable.productId, featuresTable.userId],
        references: [productsTable.id, productsTable.userId],
    }),
}));

export const productsToCollectionsTable = pgTable(
    'products_to_collections',
    {
        productId: uuid('product_id')
            .notNull()
            .references(() => productsTable.id, { onDelete: 'cascade' }),
        collectionId: uuid('collection_id')
            .notNull()
            .references(() => collectionsTable.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id),
    },
    (t) => [primaryKey({ columns: [t.productId, t.collectionId] })]
);

export const productsToCollectionsRelation = relations(
    productsToCollectionsTable,
    ({ one }) => ({
        product: one(productsTable, {
            fields: [
                productsToCollectionsTable.productId,
                productsToCollectionsTable.userId,
            ],
            references: [productsTable.id, productsTable.userId],
        }),
        collection: one(collectionsTable, {
            fields: [
                productsToCollectionsTable.collectionId,
                productsToCollectionsTable.userId,
            ],
            references: [collectionsTable.id, collectionsTable.userId],
        }),
    })
);

export const productsToTagsTable = pgTable(
    'products_to_tags',
    {
        productId: uuid('product_id')
            .notNull()
            .references(() => productsTable.id, { onDelete: 'cascade' }),
        tagId: uuid('tag_id')
            .notNull()
            .references(() => tagsTable.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id),
    },
    (t) => [primaryKey({ columns: [t.productId, t.tagId] })]
);

export const productsToTagItemsTable = pgTable(
    'products_to_tagitems',
    {
        productId: uuid('product_id')
            .notNull()
            .references(() => productsTable.id, { onDelete: 'cascade' }),
        tagId: uuid('tag_id')
            .notNull()
            .references(() => tagsTable.id, { onDelete: 'cascade' }),
        tagItemId: uuid('tag_item_id')
            .notNull()
            .references(() => tagItemsTable.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id),
    },
    (t) => [primaryKey({ columns: [t.productId, t.tagItemId] })]
);
