import { processImageIfProvided } from '@/lib/previewImage';
import { deleteObject } from '@/lib/s3';

import {
    DeleteBrandType,
    ServerBrandType,
    UpdateBrandType,
    ValidateBrandType,
} from '@/db/validations/brands';

import {
    createBrand,
    deleteBrand,
    getBrands,
    updateBrand,
} from '@/data-access/brands';

// use cases will be used to call multiple data access calls
export async function getBrandsUseCase(authenticatedUser: string) {
    return await getBrands(authenticatedUser);
}

export async function createBrandUseCase(
    authenticatedUser: string,
    values: ValidateBrandType
) {
    const { img, ...data } = values;

    // Process image if provided
    const imgId = await processImageIfProvided(img);

    // Create brand with processed data
    const brand = await createBrand(authenticatedUser, {
        ...data,
        img: imgId,
    });

    return brand;
}

export async function updateBrandUseCase(
    authenticatedUser: string,
    values: UpdateBrandType
) {
    const { originalImg, img, changedFields = [], ...data } = values;
    const updateData: Partial<ServerBrandType> & { id: string } = {
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
            const imgId = await processImageIfProvided(img, originalImg);

            if (imgId) updateData.img = imgId;
        }
    }

    (Object.keys(data) as (keyof UpdateBrandType)[]).forEach((key) => {
        if (changedFields && changedFields.includes(key)) {
            updateData[key as keyof ServerBrandType] =
                data[key as keyof typeof data];
        }
    });

    return await updateBrand(authenticatedUser, updateData);
}

export async function deleteBrandUseCase(
    authenticatedUser: string,
    values: DeleteBrandType
) {
    const { img } = values;

    // Delete image if provided
    await deleteObject(img);

    return await deleteBrand(authenticatedUser, values);
}
