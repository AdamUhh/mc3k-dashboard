import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { env } from '../env';
import * as brandsSchema from './schemas/brands';
import * as collectionsSchema from './schemas/collections';
import * as labelsSchema from './schemas/labels';
import * as modelsSchema from './schemas/models';
import * as productsSchema from './schemas/products';
import * as tagsSchema from './schemas/tags';
import * as usersSchema from './schemas/users';
import * as variantsSchema from './schemas/variants';

const pool = new pg.Pool({ connectionString: env.AUTH_DRIZZLE_URL });
const db = drizzle(pool, {
    schema: {
        ...usersSchema,
        ...brandsSchema,
        ...modelsSchema,
        ...collectionsSchema,
        ...tagsSchema,
        ...productsSchema,
        ...variantsSchema,
        ...labelsSchema,
    },
});

export default db;
