import FormInput from '@/shadcn/custom/form-input';
import FormTextarea from '@/shadcn/custom/form-textarea';

import { FeaturesController } from './FeaturesController';
import { DetailProps } from './types';

export default function Details({
    form,
    isPending,
    fieldsFeature,
}: DetailProps) {
    return (
        <>
            <FormInput
                form={form}
                formName={'name'}
                placeholder="Product Name"
                required
                disabled={isPending}
                autoFocus
            />
            <FormInput
                form={form}
                formName={'handle'}
                placeholder="product-handle"
                required
                disabled={isPending}
            />

            <FormInput
                form={form}
                formName={'teaserDescription'}
                placeholder="Teaser description"
                disabled={isPending}
            />
            <FormTextarea
                form={form}
                formName="shortDescription"
                placeholder="Short description"
                disabled={isPending}
            />
            <FormTextarea
                form={form}
                formName="description"
                placeholder="Description"
                disabled={isPending}
                className="min-h-[100px]"
                required
            />

            <FeaturesController
                form={form}
                isPending={isPending}
                fieldsFeature={fieldsFeature}
            />
        </>
    );
}
