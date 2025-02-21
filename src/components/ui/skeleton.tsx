import { cn } from '@/lib/utils';

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'mb-1 h-10 w-full animate-pulse rounded-md bg-primary/10',
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
