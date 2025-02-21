import {
    integer,
    numeric,
    pgTable,
    text,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

import { productsTable } from './products';
import { users } from './users';

export const variantsTable = pgTable(
    'variants',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: text('name').notNull(),
        quantity: integer('quantity').notNull(),
        cost: numeric('cost').notNull(),
        price: numeric('price'),
        discountedPrice: numeric('discounted_price'),
        order: integer('order').notNull(), // Order column to manage variant order
        productId: uuid('productId')
            .notNull()
            .references(() => productsTable.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id),
    },

    (table) => [uniqueIndex('order_variant').on(table.productId, table.order)]
);

export const variantImagesTable = pgTable(
    'variant_images',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        img: text('img').notNull(),
        order: integer('order').notNull(),
        variantId: uuid('variant_id')
            .notNull()
            .references(() => variantsTable.id, { onDelete: 'cascade' }),
        userId: text('userId')
            .notNull()
            .references(() => users.id),
    },
    (table) => [uniqueIndex('order_product').on(table.variantId, table.order)]
);
