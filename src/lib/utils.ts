/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import crypto from 'crypto';
import { UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatHandle = (name: string) =>
    name
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/\//g, '-') // Replace slashes with dashes
        .replace(/[^a-z0-9-]/g, '') // Remove characters that are not lowercase letters, digits, or dashes
        .replace(/-+/g, '-') // Replace multiple consecutive dashes with a single dash
        .replace(/^-+|-+$/g, ''); // Remove dashes at the beginning or end of the string

export const generateRandomHex = (bytes = 32) =>
    crypto.randomBytes(bytes).toString('hex');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function getChangedFields<T extends Record<string, any>>(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     form: UseFormReturn<any>
// ): Partial<T> {
//     const dirtyFields = form.formState.dirtyFields;
//     const values = form.getValues();
//     console.log('getchangedfields, dirtyfields', dirtyFields)
//     console.log('getchangedfields, values', values)
//
//     return Object.keys(dirtyFields).reduce((acc, key) => {
//         if (dirtyFields[key]) {
//             acc[key as keyof T] = values[key];
//         }
//         return acc;
//     }, {} as Partial<T>);
// }
export function getChangedFields<T extends Record<string, any>>(
    form: UseFormReturn<any>
): Partial<T> {
    const dirtyFields = form.formState.dirtyFields;
    const values = form.getValues();

    function processObject(
        obj: Record<string, any>,
        dirtyObj: Record<string, any>
    ): any {
        return Object.keys(dirtyObj).reduce(
            (acc, key) => {
                if (Array.isArray(dirtyObj[key])) {
                    const changedItems = dirtyObj[key]
                        .map((item: any, index: number) => {
                            if (
                                typeof item === 'object' &&
                                Object.values(item).some((v) => v)
                            ) {
                                return processObject(obj[key][index], item);
                            }
                            return null;
                        })
                        .filter(Boolean);

                    if (changedItems.length > 0) {
                        acc[key] = changedItems;
                    }
                } else if (dirtyObj[key] === true) {
                    acc[key] = obj[key];
                } else if (typeof dirtyObj[key] === 'object') {
                    const processed = processObject(obj[key], dirtyObj[key]);
                    if (Object.keys(processed).length > 0) {
                        acc[key] = processed;
                    }
                }
                return acc;
            },
            {} as Record<string, any>
        );
    }

    return processObject(values, dirtyFields);
}

/**
 * Deeply compares form values against their defaults to identify changed fields.
 * Handles nested objects and arrays with special support for reordering and deletion.
 *
 * @param form - The form object from react-hook-form
 * @returns An object containing only the changed fields and their new values
 */
export function getChangedFieldsDeep<T extends Record<string, any>>(
    dirtyFields: any,
    values: any,
    defaultValues: any
): T {
    function getDirtyFields(dirty: any, current: any, defaultValue?: any): any {
        if (typeof dirty !== 'object' || !dirty || !current) return {};

        return Object.keys(dirty).reduce((acc: Record<string, any>, key) => {
            const isDirty = dirty[key];
            const value = current[key];
            const defaultVal = defaultValue?.[key];

            if (Array.isArray(isDirty)) {
                const activeItems = value.filter((item: any) => !item.toDelete);

                const dirtyItems = isDirty
                    .map((itemDirty: any, index: number) => {
                        const item = value[index];
                        if (!item) return null;

                        if (item.toDelete) {
                            return { id: item.id, toDelete: true };
                        }

                        if (!item.id || item.isNew) {
                            const newIndex = activeItems.findIndex(
                                (i: any) => i === item
                            );
                            return { ...item, order: newIndex };
                        }

                        const defaultItem = defaultVal?.find(
                            (d: any) => d.id === item.id
                        );
                        if (!defaultItem) return null;

                        const itemChanges = getDirtyFields(
                            itemDirty,
                            item,
                            defaultItem
                        );

                        const currentIndex = activeItems.findIndex(
                            (i: any) => i.id === item.id
                        );
                        const defaultIndex = defaultVal
                            ?.filter((d: any) => !d.toDelete)
                            .findIndex((d: any) => d.id === item.id);

                        if (defaultIndex !== currentIndex) {
                            itemChanges.order = currentIndex;
                        }

                        if (Object.keys(itemChanges).length) {
                            itemChanges.id = item.id;
                            return itemChanges;
                        }
                        return null;
                    })
                    .filter(Boolean);

                if (dirtyItems.length) acc[key] = dirtyItems;
            } else if (typeof isDirty === 'object') {
                const nestedChanges = getDirtyFields(
                    isDirty,
                    value,
                    defaultVal
                );
                if (Object.keys(nestedChanges).length) acc[key] = nestedChanges;
            } else if (
                isDirty &&
                JSON.stringify(value) !== JSON.stringify(defaultVal)
            ) {
                acc[key] = value;
            }

            return acc;
        }, {});
    }

    return getDirtyFields(dirtyFields, values, defaultValues);
}
