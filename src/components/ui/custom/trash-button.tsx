import { Trash2Icon } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../button';

interface TrashButtonProps {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset' | undefined;
    className?: string;
}

// was getting an error (from editing) because it was not forwardRef
const TrashButton = forwardRef<HTMLButtonElement, TrashButtonProps>(
    ({ onClick, className, type = 'button' }, ref) => {
        return (
            <Button
                variant="destructive-outline"
                onClick={onClick}
                type={type}
                ref={ref}
                className={cn('w-fit cursor-pointer p-2', className)}
            >
                <Trash2Icon size={20} />
            </Button>
        );
    }
);

TrashButton.displayName = 'TrashButton';

export default TrashButton;
