import { Suspense } from 'react';

import Header from '@/components/Header';

import { Skeleton } from '@/shadcn/skeleton';

import { assertAuthenticated } from '@/lib/auth';

import { UpdateTagType } from '@/db/validations/tags';

import { getTagsUseCase } from '@/use-cases/tags';

import ClientTagList from './client-page';

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
    const data = await getTagsUseCase(userId);

    console.log(`Fetched Tags in: ${(performance.now() - start).toFixed(2)}ms`);

    if (!data) return <div>No data found</div>;
    return <ClientTagList initialData={data as UpdateTagType[]} />;
}

export default async function TagsPage() {
    return (
        <main className="grid grid-rows-[auto_1fr]">
            <Header
                title="Tags"
                description="Manage your list of product tags."
            />
            <Suspense fallback={<LoadingSkeleton />}>
                <SuspenseComponent />
            </Suspense>
        </main>
    );
}
