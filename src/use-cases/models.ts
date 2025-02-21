import {
    DeleteModelType,
    ServerModelType,
    UpdateModelType,
    ValidateModelType,
} from '@/db/validations/models';

import {
    createModel,
    deleteModel,
    getModels,
    updateModel,
} from '@/data-access/models';

// use cases will be used to call multiple data access calls
export async function getModelsUseCase(authenticatedUser: string) {
    return await getModels(authenticatedUser);
}

export async function createModelUseCase(
    authenticatedUser: string,
    values: ValidateModelType
) {
    return await createModel(authenticatedUser, values);
}

export async function updateModelUseCase(
    authenticatedUser: string,
    values: UpdateModelType
) {
    const { changedFields = [], ...data } = values;
    const updateData: Partial<ServerModelType> & { id: string } = {
        id: data.id,
    };
    // Only process fields that changed

    (Object.keys(data) as (keyof UpdateModelType)[]).forEach((key) => {
        if (changedFields && changedFields.includes(key)) {
            updateData[key as keyof ServerModelType] =
                data[key as keyof typeof data];
        }
    });

    return await updateModel(authenticatedUser, updateData);
}

export async function deleteModelUseCase(
    authenticatedUser: string,
    values: DeleteModelType
) {
    return await deleteModel(authenticatedUser, values);
}
