import { createSafeActionClient } from 'next-safe-action';

import { auth } from './auth';
import { ValidationError } from './errors';

// Base client.
const actionClient = createSafeActionClient({
    handleServerError(error: unknown) {
        console.error('Action Error', error);

        // Handle different types of errors
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        if (error && typeof error === 'object' && 'message' in error) {
            return String(error.message);
        }

        return 'An unexpected server error occurred. Please try again.';
    },
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
export const authActionClient = actionClient
    // Define authorization middleware.
    .use(async ({ next }) => {
        const session = await auth();

        if (!session) {
            throw new ValidationError('Session not found!');
        }
        const userId = session.user;

        if (!userId || !userId.id) {
            throw new ValidationError('Session is not valid!');
        }

        // Return the next middleware with `userId` value in the context
        return next({ ctx: { userId: userId.id } });
    });
