import { Suspense } from 'react';

import Header from '@/components/Header';

import { Skeleton } from '@/shadcn/skeleton';

import { assertAuthenticated } from '@/lib/auth';

import { getCollectionsUseCase } from '@/use-cases/collections';

import ClientCollectionList from './client-page';

function LoadingSkeleton() {
    return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );
}

async function SuspenseComponent() {
    const start = performance.now();

    const userId = await assertAuthenticated();
    const data = await getCollectionsUseCase(userId);

    console.log(
        `Fetched Collections in: ${(performance.now() - start).toFixed(2)}ms`
    );

    if (!data) return <div>No data found</div>;
    return <ClientCollectionList initialData={data} />;
}

export default async function CollectionsPage() {
    return (
        <main className="grid grid-rows-[auto_1fr]">
            <Header
                title="Collections"
                description="Manage your list of product collections."
            />
            <Suspense fallback={<LoadingSkeleton />}>
                <SuspenseComponent />
            </Suspense>
        </main>
    );
}
