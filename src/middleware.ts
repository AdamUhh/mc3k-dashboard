import NextAuth from 'next-auth';

import authConfig from './lib/auth.config';

export default NextAuth(authConfig).auth;

// Don't invoke Middleware on some paths
// Configuration to match all paths except for certain static files and API routes
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
