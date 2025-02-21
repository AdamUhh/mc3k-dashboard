import {
    DeleteLabelType,
    ServerLabelType,
    UpdateLabelType,
    ValidateLabelType,
} from '@/db/validations/labels';

import {
    createLabel,
    deleteLabel,
    getLabels,
    updateLabel,
} from '@/data-access/labels';

// use cases will be used to call multiple data access calls
export async function getLabelsUseCase(authenticatedUser: string) {
    return await getLabels(authenticatedUser);
}

export async function createLabelUseCase(
    authenticatedUser: string,
    values: ValidateLabelType
) {
    return await createLabel(authenticatedUser, values);
}

export async function updateLabelUseCase(
    authenticatedUser: string,
    values: UpdateLabelType
) {
    const { changedFields = [], ...data } = values;
    const updateData: Partial<ServerLabelType> & { id: string } = {
        id: data.id,
    };
    // Only process fields that changed

    (Object.keys(data) as (keyof UpdateLabelType)[]).forEach((key) => {
        if (changedFields && changedFields.includes(key)) {
            updateData[key as keyof ServerLabelType] =
                data[key as keyof typeof data];
        }
    });

    return await updateLabel(authenticatedUser, updateData);
}

export async function deleteLabelUseCase(
    authenticatedUser: string,
    values: DeleteLabelType
) {
    return await deleteLabel(authenticatedUser, values);
}
