
import { env } from '@/lib/env';
import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
    schema: './src/lib/db/schemas/*',
    out: './drizzle',
    dbCredentials: {
        url: env.AUTH_DRIZZLE_URL,
    },
}) satisfies Config;
