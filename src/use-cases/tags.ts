import {
    DeleteTagItemType,
    DeleteTagType,
    ServerTagItemType,
    ServerTagType,
    UpdateTagItemType,
    UpdateTagType,
    ValidateTagItemType,
    ValidateTagType,
} from '@/db/validations/tags';

import {
    createTag,
    createTagItem,
    deleteTag,
    deleteTagItem,
    getTags,
    updateTag,
    updateTagItem,
} from '@/data-access/tags';

// use cases will be used to call multiple data access calls
export async function getTagsUseCase(authenticatedUser: string) {
    return await getTags(authenticatedUser);
}

export async function createTagUseCase(
    authenticatedUser: string,
    values: ValidateTagType
) {
    return await createTag(authenticatedUser, values);
}

export async function updateTagUseCase(
    authenticatedUser: string,
    values: UpdateTagType
) {
    const { changedFields = [], ...data } = values;
    const updateData: Partial<ServerTagType> & { id: string } = {
        id: data.id,
    };
    // Only process fields that changed

    (Object.keys(data) as (keyof UpdateTagType)[]).forEach((key) => {
        if (changedFields && changedFields.includes(key)) {
            updateData[key as keyof ServerTagType] =
                data[key as keyof typeof data];
        }
    });

    return await updateTag(authenticatedUser, updateData);
}

export async function deleteTagUseCase(
    authenticatedUser: string,
    values: DeleteTagType
) {
    return await deleteTag(authenticatedUser, values);
}

// Tag Items
export async function createTagItemUseCase(
    authenticatedUser: string,
    values: ValidateTagItemType
) {
    return await createTagItem(authenticatedUser, values);
}

export async function updateTagItemUseCase(
    authenticatedUser: string,
    values: UpdateTagItemType
) {
    const { changedFields = [], ...data } = values;
    const updateData: Partial<ServerTagItemType> & { id: string } = {
        id: data.id,
    };
    // Only process fields that changed

    (Object.keys(data) as (keyof UpdateTagItemType)[]).forEach((key) => {
        if (changedFields && changedFields.includes(key)) {
            updateData[key as keyof ServerTagItemType] =
                data[key as keyof typeof data] as string;
        }
    });

    return await updateTagItem(authenticatedUser, updateData);
}

export async function deleteTagItemUseCase(
    authenticatedUser: string,
    values: DeleteTagItemType
) {
    return await deleteTagItem(authenticatedUser, values);
}
