'use server';

import { signOut } from '@/lib/auth';

export async function signOutAction() {
    try {
        console.log('signing out');
        await signOut({ redirectTo: '/login', redirect: true });
    } catch (e) {
        if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;

        console.error('Error signing out', e);
    }
}
