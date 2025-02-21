import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

export function DragHandle({
    className,
    ...props
}: {
    className?: string;
    props?: unknown;
}) {
    return (
        <Button
            variant="ghost"
            type="button"
            className={cn(
                'z-10 w-fit cursor-pointer p-2 hover:cursor-grab',
                className
            )}
            {...props}
        >
            <GripVertical size={20} />
        </Button>
    );
}
