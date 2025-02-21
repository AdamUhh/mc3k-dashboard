import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';

export default {
    pages: {
        signIn: '/login',
    },
    providers: [GitHub],
    session: { strategy: 'jwt' },
    callbacks: {
        authorized({ auth }) {
            const isLoggedIn = !!auth?.user;
            return isLoggedIn;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.sub = user.id; // token.uid or token.sub both work
            }
            return token;
        },

        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
