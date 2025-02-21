import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const modelsTable = pgTable('models', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    handle: text('handle').notNull().unique(),
    userId: text('userId')
        .notNull()
        .references(() => users.id),
});
