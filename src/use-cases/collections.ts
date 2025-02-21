import { processImageIfProvided } from '@/lib/previewImage';
import { deleteObject } from '@/lib/s3';

import {
    DeleteCollectionType,
    ServerCollectionType,
    UpdateCollectionType,
    ValidateCollectionType,
} from '@/db/validations/collections';

import {
    createCollection,
    deleteCollection,
    getCollections,
    updateCollection,
} from '@/data-access/collections';

// use cases will be used to call multiple data access calls
export async function getCollectionsUseCase(authenticatedUser: string) {
    return await getCollections(authenticatedUser);
}

export async function createCollectionUseCase(
    authenticatedUser: string,
    values: ValidateCollectionType
) {
    const { img, ...data } = values;

    // Process image if provided
    const imgId = await processImageIfProvided(img, null, {
        width: 1280,
        height: 420,
        transformIfBigger: true,
    });

    // Create collection with processed data
    const collection = await createCollection(authenticatedUser, {
        ...data,
        img: imgId,
    });

    return collection;
}

export async function updateCollectionUseCase(
    authenticatedUser: string,
    values: UpdateCollectionType
) {
    const { originalImg, img, changedFields = [], ...data } = values;
    const updateData: Partial<ServerCollectionType> & { id: string } = {
        id: data.id,
    };
    // Only process fields that changed
    if (changedFields && changedFields.includes('img')) {
        if (originalImg === img) {
            // Delete image if img === originalImg
            // This is a sort of hacky way to tell if a user wants to delete the image
            await deleteObject(originalImg);
            updateData.img = null;
        } else {
            const imgId = await processImageIfProvided(img, originalImg, {
                width: 1280,
                height: 420,
                transformIfBigger: true,
            });

            if (imgId) updateData.img = imgId;
        }
    }

    (Object.keys(data) as (keyof UpdateCollectionType)[]).forEach((key) => {
        if (changedFields && changedFields.includes(key)) {
            updateData[key as keyof ServerCollectionType] = data[
                key as keyof typeof data
            ] as string;
        }
    });

    return await updateCollection(authenticatedUser, updateData);
}

export async function deleteCollectionUseCase(
    authenticatedUser: string,
    values: DeleteCollectionType
) {
    const { img } = values;

    // Delete image if provided
    await deleteObject(img);

    return await deleteCollection(authenticatedUser, values);
}
