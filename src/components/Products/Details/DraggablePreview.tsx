import { DragOverlay } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { DragHandle } from '@/components/drag-handle';

import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';
import { Textarea } from '@/shadcn/textarea';

import { DetailProps } from './types';

export function DraggableItem({
    id,
    children,
}: {
    id: string;
    children: ReactNode;
}) {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={style as any}
            className="group relative overflow-hidden"
        >
            <DragHandle
                className="absolute -left-10 top-1 bg-input/70 p-1.5 transition-all group-hover:left-1"
                {...attributes}
                {...listeners}
            />
            {children}
        </div>
    );
}

function Preview({
    activeId,
    fieldsFeature,
}: {
    activeId: string;
    fieldsFeature: DetailProps['fieldsFeature'];
}) {
    const activeItem = fieldsFeature.fields.find((f) => f.id === activeId);

    if (!activeItem) return null;

    const { name, description } = activeItem;

    return (
        <div className="group flex gap-3 bg-input">
            <DragHandle className="absolute left-1.5 top-1.5 h-fit w-fit bg-input/70 px-0 py-1" />
            <div className="w-full space-y-4">
                <div className="flex items-center gap-4">
                    <Input placeholder={name} className="ml-10" />
                    <Button
                        type="button"
                        variant="outline"
                        className="aspect-square p-0"
                    >
                        <Trash2 size={20} />
                    </Button>
                </div>
                <Textarea placeholder={description} className="min-h-[100px]" />
            </div>
        </div>
    );
}

export function DraggablePreview({
    activeId,
    fieldsFeature,
}: {
    activeId: string | null;
    fieldsFeature: DetailProps['fieldsFeature'];
}) {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <DragOverlay>
            {activeId && (
                <Preview activeId={activeId} fieldsFeature={fieldsFeature} />
            )}
        </DragOverlay>,
        document.body
    );
}
