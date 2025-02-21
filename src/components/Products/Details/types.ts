import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import { UpdateProductFormType } from '@/db/validations/products';

export type DetailProps = {
    form: UseFormReturn<UpdateProductFormType>;
    isPending: boolean;
    fieldsFeature: UseFieldArrayReturn<
        UpdateProductFormType,
        'features',
        'customId'
    >;
};
