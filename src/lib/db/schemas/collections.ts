import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const collectionsTable = pgTable('collections', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    handle: text('handle').notNull().unique(),
    description: text('description'),
    img: text('img'),
    userId: text('userId')
        .notNull()
        .references(() => users.id),
});
