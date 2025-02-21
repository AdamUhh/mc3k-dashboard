import { Skeleton } from '@/shadcn/skeleton';

export default function PageSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            Loading...
            <div className="flex h-20 items-center justify-between gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20 w-1/4" />
            </div>
            <Skeleton />
            <Skeleton />
        </div>
    );
}
