import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import { UpdateProductFormType } from '@/db/validations/products';

export type AttributeProps = {
    form: UseFormReturn<UpdateProductFormType>;
    isPending: boolean;
    fieldsCollection: UseFieldArrayReturn<
        UpdateProductFormType,
        'collections',
        'customId'
    >;
};
