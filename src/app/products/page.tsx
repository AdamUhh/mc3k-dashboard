import { Suspense } from 'react';

import Header from '@/components/Header';

import { Skeleton } from '@/shadcn/skeleton';

import { assertAuthenticated } from '@/lib/auth';

import { getCoreDataUseCase, getProductsUseCase } from '@/use-cases/products';

import ClientProductList from './client-page';

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
    const data = await getProductsUseCase(userId);
    const coreData = await getCoreDataUseCase(userId);

    console.log(
        `Fetched Products in: ${(performance.now() - start).toFixed(2)}ms`
    );
    console.log('data', JSON.stringify(data, null, 2));

    if (!data) return <div>No data found</div>;
    return <ClientProductList coreData={coreData} initialData={data} />;
}

export default async function ProductsPage() {
    return (
        <main className="grid grid-rows-[auto_1fr]">
            <Header title="Products" description="Manage your products." />
            <Suspense fallback={<LoadingSkeleton />}>
                <SuspenseComponent />
            </Suspense>
        </main>
    );
}
