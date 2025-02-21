import { Suspense } from 'react';

import Header from '@/components/Header';

import { Skeleton } from '@/shadcn/skeleton';

import { assertAuthenticated } from '@/lib/auth';

import { getModelsUseCase } from '@/use-cases/models';

import ClientModelList from './client-page';

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
    const data = await getModelsUseCase(userId);

    console.log(
        `Fetched Models in: ${(performance.now() - start).toFixed(2)}ms`
    );

    if (!data) return <div>No data found</div>;
    return <ClientModelList initialData={data} />;
}

export default async function ModelsPage() {
    return (
        <main className="grid grid-rows-[auto_1fr]">
            <Header
                title="Models"
                description="Manage your list of product models."
            />
            <Suspense fallback={<LoadingSkeleton />}>
                <SuspenseComponent />
            </Suspense>
        </main>
    );
}
