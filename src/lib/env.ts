import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        AUTH_DRIZZLE_URL: z.string().url(),
        AUTH_GITHUB_ID: z.string(),
        AUTH_GITHUB_SECRET: z.string(),
        NEXTAUTH_URL: z.string(),
        AWS_BUCKET_KEY: z.string(),
        AWS_BUCKET_REGION: z.string(),
        AWS_PUBLIC_ACCESS_KEY: z.string(),
        AWS_SECRET_ACCESS_KEY: z.string(),
        // AWS_CLOUDFRONT_URL: z.string(),
    },
    client: {
        NEXT_PUBLIC_AWS_CLOUDFRONT_URL: z.string(),
        // NEXT_PUBLIC_HOST_NAME: z.string().url(), // http://localhost:3000
    },
    runtimeEnv: {
        AUTH_DRIZZLE_URL: process.env.AUTH_DRIZZLE_URL,
        AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
        AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,

        AWS_BUCKET_KEY: process.env.AWS_BUCKET_KEY,
        AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
        AWS_PUBLIC_ACCESS_KEY: process.env.AWS_PUBLIC_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        // AWS_CLOUDFRONT_URL: process.env.AWS_CLOUDFRONT_URL,
        NEXT_PUBLIC_AWS_CLOUDFRONT_URL: process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL,

        // NEXT_PUBLIC_HOST_NAME: process.env.NEXT_PUBLIC_HOST_NAME,
    },
});
