import { Suspense } from 'react';

import Header from '@/components/Header';

import { Skeleton } from '@/shadcn/skeleton';

import { assertAuthenticated } from '@/lib/auth';

import { getLabelsUseCase } from '@/use-cases/labels';

import ClientLabelList from './client-page';

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
    const data = await getLabelsUseCase(userId);

    console.log(
        `Fetched Labels in: ${(performance.now() - start).toFixed(2)}ms`
    );

    if (!data) return <div>No data found</div>;
    return <ClientLabelList initialData={data} />;
}

export default async function LabelsPage() {
    return (
        <main className="grid grid-rows-[auto_1fr]">
            <Header
                title="Labels"
                description="Manage your list of product labels (for variants). E.g. Sizes, Models, Colors, etc."
            />
            <Suspense fallback={<LoadingSkeleton />}>
                <SuspenseComponent />
            </Suspense>
        </main>
    );
}
