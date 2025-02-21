import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const labelsTable = pgTable('labels', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id),
});
