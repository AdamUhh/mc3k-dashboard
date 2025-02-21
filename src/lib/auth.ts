'server-only';

import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';
import { cache } from 'react';

import authConfig from './auth.config';
import db from './db';
import { accounts, users } from './db/schemas/users';
import { AuthenticationError } from './errors';

export const config = {
    ...authConfig,
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
    }),
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);

export const getCurrentUser = cache(async () => {
    const user = await auth();
    return user ?? undefined;
});

export const assertAuthenticated = async () => {
    const user = await getCurrentUser();
    if (!user || !user.user || !user.user.id) {
        throw new AuthenticationError();
    }
    return user.user.id;
};
