'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { ToggleContext } from '@/components/Overlays/interactive-overlay';

import { formatHandle, getChangedFieldsDeep } from '@/lib/utils';

import {
    Collection,
    Feature,
    UpdateProductFormType,
    UpdateProductType,
    updateProductFormSchema,
} from '@/db/validations/products';

import { updateProductAction } from './actions';
import { ProductFormBase } from './form-base';

export function UpdateProductForm({
    id,
    name,
    handle,
    description,
    teaserDescription,
    shortDescription,
    features,
    collections,
    brandId,
    modelId,
}: UpdateProductFormType) {
    const form = useForm<UpdateProductFormType>({
        resolver: zodResolver(updateProductFormSchema),
        defaultValues: {
            id,
            name,
            handle,
            description,
            brandId,
            modelId,
            shortDescription: shortDescription || '',
            teaserDescription: teaserDescription || '',
            features: features?.sort((f) => f?.order || 0) || [],
            collections: collections || [],
        },
        mode: 'onChange',
    });

    const { setIsOpen, preventCloseRef } = useContext(ToggleContext);

    const { execute, isPending } = useAction(updateProductAction, {
        onSettled: () => {
            if (preventCloseRef) preventCloseRef.current = false;
        },
        onExecute: () => {
            if (preventCloseRef) preventCloseRef.current = true;
            toast.loading('Updating Product', { id: form.getValues().name });
        },
        onSuccess: () => {
            toast.success('Product Updated', { id: form.getValues().name });
            setIsOpen?.(false);
        },
        onError: ({ error }) => {
            if (error.validationErrors) {
                console.error('validation error', error.validationErrors);
            }
            if (error.serverError) {
                console.error('server error', error.serverError);
            }
            toast.error('Failed to update Product', {
                id: form.getValues().name,
            });
        },
    });

    const processCollectionChanges = (
        collections?: Collection[]
    ): UpdateProductType['collections'] => {
        if (!collections?.length) return {};

        console.log('collections', JSON.stringify(collections, null, 2));

        const categorizedCollectionIds = collections.reduce(
            (acc, collection) => {
                if (collection.isNew)
                    acc.new.push({ ...collection, id: collection.id! });
                else if (collection.toDelete)
                    acc.delete.push({ id: collection.id! });
                // else acc.update.push({ ...collection, id: collection.id! });
                return acc;
            },
            {
                new: [] as (Collection & { id: string })[],
                delete: [] as { id: string }[],
                update: [] as (Collection & { id: string; newId: string })[],
            }
        );

        const minLength = Math.min(
            categorizedCollectionIds.new.length,
            categorizedCollectionIds.delete.length
        );

        // Replace deleted features with new ones where possible
        const reusedCollectionIds = categorizedCollectionIds.new
            .slice(0, minLength)
            .map((feature, i) => ({
                ...feature,
                newId: feature.id,
                id: categorizedCollectionIds.delete[i].id,
            }));

        return {
            updateCollections: [
                ...categorizedCollectionIds.update,
                ...reusedCollectionIds,
            ],
            newCollections: categorizedCollectionIds.new.slice(minLength),
            deleteCollections: categorizedCollectionIds.delete.slice(minLength),
        };
    };

    const processFeatureChanges = (
        features?: Feature[]
    ): UpdateProductType['features'] => {
        if (!features?.length) return {};

        const categorizedFeatures = features.reduce(
            (acc, feature) => {
                if (feature.isNew) acc.new.push(feature);
                else if (feature.toDelete) acc.delete.push({ id: feature.id! });
                else acc.update.push({ ...feature, id: feature.id! });
                return acc;
            },
            {
                new: [] as Feature[],
                delete: [] as { id: string }[],
                update: [] as (Feature & { id: string })[],
            }
        );

        const minLength = Math.min(
            categorizedFeatures.new.length,
            categorizedFeatures.delete.length
        );

        // Replace deleted features with new ones where possible
        const reusedFeatures = categorizedFeatures.new
            .slice(0, minLength)
            .map((feature, i) => ({
                ...feature,
                id: categorizedFeatures.delete[i].id,
            }));

        return {
            updateFeatures: [...categorizedFeatures.update, ...reusedFeatures],
            newFeatures: categorizedFeatures.new.slice(minLength),
            deleteFeatures: categorizedFeatures.delete.slice(minLength),
        };
    };

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const { dirtyFields, defaultValues, errors } = form.formState;
            const values = form.getValues();

            const changedFields = getChangedFieldsDeep<
                UpdateProductType & { id: string }
            >(dirtyFields, values, defaultValues);

            if (!Object.keys(changedFields).length) {
                toast.error('No changes to update');
                return;
            }

            // force id to be present
            changedFields.id = id;

            // Update handle if name changed and handle wasn't manually edited
            if (
                Object.keys(changedFields).includes('name') &&
                !form.formState.dirtyFields.handle
            ) {
                const _handle = form.getValues('handle');
                if (_handle) changedFields.handle = formatHandle(_handle);
            }

            // Process feature changes if any
            const changedFeatures = changedFields.features as Feature[];
            if (changedFeatures?.length) {
                changedFields.features = processFeatureChanges(changedFeatures);
            }

            const changedCollections =
                changedFields.collections as Collection[];
            if (changedCollections?.length) {
                changedFields.collections =
                    processCollectionChanges(changedCollections);
            }

            console.log(JSON.stringify(changedFields, null, 2));
            form.handleSubmit(() => execute(changedFields))();

            if (Object.keys(errors).length > 0)
                console.error('form errors', errors);
        },
        [execute, form, id]
    );

    return (
        <ProductFormBase
            form={form}
            onSubmit={handleSubmit}
            isPending={isPending}
        />
    );
}
