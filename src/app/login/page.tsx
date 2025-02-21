import { ROUTES } from '@/constants/navigation';
import Link from 'next/link';

import GithubIcon from '@/components/svg/Github';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { auth, signIn } from '@/lib/auth';

export default async function LoginPage() {
    const sessionAuth = await auth();
    const session = sessionAuth?.user;

    return (
        <div className="flex items-start justify-center p-8 md:items-center">
            <Card className="w-full max-w-sm text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {!session ? 'Sign In' : 'Already Signed In'}
                    </CardTitle>
                </CardHeader>

                <CardFooter>
                    {!session ? (
                        <form
                            action={async () => {
                                'use server';
                                return await signIn('github', {
                                    redirectTo: '/',
                                });
                            }}
                            className="w-full"
                        >
                            <Button className="flex h-fit w-full flex-col items-center py-4 text-lg">
                                <GithubIcon className="!h-24 !w-24" />
                                Sign in with GitHub
                            </Button>
                        </form>
                    ) : (
                        <Button
                            asChild
                            className="flex h-fit w-full flex-col items-center"
                        >
                            <Link href={ROUTES.DASHBOARD} className="w-full">
                                Go back to Dashboard
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
