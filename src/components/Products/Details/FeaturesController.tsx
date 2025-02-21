import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useCallback, useState } from 'react';

import { Button } from '@/shadcn/button';
import FormInput from '@/shadcn/custom/form-input';
import FormTextarea from '@/shadcn/custom/form-textarea';
import TrashButton from '@/shadcn/custom/trash-button';

import { generateRandomHex } from '@/lib/utils';

import { DraggableItem, DraggablePreview } from './DraggablePreview';
import { DetailProps } from './types';

export function FeaturesController({
    form,
    isPending,
    fieldsFeature,
}: DetailProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const handleAddFeature = useCallback(() => {
        fieldsFeature.append({
            id: generateRandomHex(),
            isNew: true,
            name: '',
            description: '',
            order: fieldsFeature.fields.length,
        });
    }, [fieldsFeature]);

    const handleRemoveFeature = useCallback(
        (index: number) => {
            if (fieldsFeature.fields[index].isNew) {
                fieldsFeature.remove(index);
            } else {
                fieldsFeature.update(index, {
                    ...fieldsFeature.fields[index],
                    toDelete: true,
                });
            }
        },
        [fieldsFeature]
    );

    const handleDragStart = (event: DragStartEvent) =>
        setActiveId(event.active.id as string);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id) {
                const oldIndex = fieldsFeature.fields.findIndex(
                    (f) => f.id === active.id
                );
                const newIndex = fieldsFeature.fields.findIndex(
                    (f) => f.id === over.id
                );

                fieldsFeature.move(oldIndex, newIndex);
            }
        },
        [fieldsFeature]
    );

    return (
        <>
            <div className="flex items-center justify-between">
                <span>Features</span>
                <Button
                    type="button"
                    variant="outline-dashed"
                    onMouseUp={handleAddFeature}
                >
                    + Add Feature
                </Button>
            </div>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-2 gap-4">
                    <SortableContext
                        items={fieldsFeature.fields.map((f) => f.id!)}
                    >
                        {fieldsFeature.fields.map((field, index) =>
                            field.toDelete ? null : (
                                <DraggableItem
                                    key={field.id}
                                    id={field.id as string}
                                >
                                    <div
                                        key={field.id}
                                        className="w-full space-y-4 p-1"
                                    >
                                        <div className="transition-all group-hover:mx-10">
                                            <FormInput
                                                form={form}
                                                formName={'features'}
                                                index={index}
                                                fieldKey={'name'}
                                                placeholder="Feature name"
                                                disabled={isPending}
                                            />
                                            <TrashButton
                                                className="absolute -right-10 top-1 p-1.5 transition-all group-hover:right-1"
                                                onClick={() =>
                                                    handleRemoveFeature(index)
                                                }
                                            />
                                        </div>
                                        <FormTextarea
                                            form={form}
                                            formName="features"
                                            index={index}
                                            fieldKey="description"
                                            placeholder="Feature description"
                                            className="min-h-[80px]"
                                            disabled={isPending}
                                        />
                                    </div>
                                </DraggableItem>
                            )
                        )}
                    </SortableContext>
                </div>
                <DraggablePreview
                    activeId={activeId}
                    fieldsFeature={fieldsFeature}
                />
            </DndContext>
        </>
    );
}
