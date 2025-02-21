import { Suspense } from 'react';

import Header from '@/components/Header';

import { Skeleton } from '@/shadcn/skeleton';

import { assertAuthenticated } from '@/lib/auth';

import { getBrandsUseCase } from '@/use-cases/brands';

import ClientBrandList from './client-page';

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
    const data = await getBrandsUseCase(userId);

    console.log(
        `Fetched Brands in: ${(performance.now() - start).toFixed(2)}ms`
    );

    if (!data) return <div>No data found</div>;
    return <ClientBrandList initialData={data} />;
}

export default async function BrandsPage() {
    return (
        <main className="grid grid-rows-[auto_1fr]">
            <Header
                title="Brands"
                description="Manage your list of product brands."
            />
            <Suspense fallback={<LoadingSkeleton />}>
                <SuspenseComponent />
            </Suspense>
        </main>
    );
}
