import { Loader2Icon, SaveIcon, Trash2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from '../button';

export function LoaderButton({
    children,
    isLoading,
    className,
    icon,
    ...props
}: ButtonProps & { isLoading: boolean; icon?: 'save' | 'trash' }) {
    return (
        <Button
            disabled={isLoading}
            type="submit"
            {...props}
            className={cn('flex justify-center gap-2 px-3', className)}
        >
            {!isLoading && icon && icon === 'save' && <SaveIcon />}
            {!isLoading && icon && icon === 'trash' && <Trash2Icon />}
            {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {children}
        </Button>
    );
}
