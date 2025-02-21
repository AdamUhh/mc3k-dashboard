'use client';

import { ReactNode, createContext, useRef } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/dialog';
import { ScrollArea } from '@/shadcn/scroll-area';

import { cn } from '@/lib/utils';

type ToggleContextType = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    preventCloseRef: React.RefObject<boolean>;
};

export const ToggleContext = createContext<ToggleContextType>({
    isOpen: false,
    setIsOpen: () => {},
    preventCloseRef: { current: false },
});

export function InteractiveOverlay({
    isOpen,
    setIsOpen,
    title,
    description,
    form,
    big,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    form: ReactNode;
    title: string;
    description: string;
    big?: boolean;
}) {
    const preventCloseRef = useRef(false);

    return (
        <ToggleContext.Provider
            value={{
                isOpen,
                setIsOpen,
                preventCloseRef,
            }}
        >
            <Dialog
                open={isOpen}
                onOpenChange={(value) => {
                    if (preventCloseRef.current) return;
                    setIsOpen(value);
                }}
            >
                <DialogContent className={cn('pl-5 pr-2', big && 'max-w-6xl')}>
                    <DialogHeader className="pl-1 pr-5">
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea
                        className={cn(
                            'max-h-[calc(100vh-15rem)] overflow-y-auto pb-12 pr-4',
                            big && 'h-screen'
                        )}
                    >
                        {form}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </ToggleContext.Provider>
    );
}
