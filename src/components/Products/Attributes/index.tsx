// import FormInput from '@/shadcn/custom/form-input';
// import FormTextarea from '@/shadcn/custom/form-textarea';
import { useAppState } from '@/context/context';

import FormCombobox from '@/shadcn/custom/form-commandbox';
import FormMultiCombobox from '@/shadcn/custom/form-multi-commandbox';

import { AttributeProps } from './types';

export default function Attributes({ form, isPending }: AttributeProps) {
    const { coreData } = useAppState();
    console.log(coreData);
    return (
        <>
            <FormMultiCombobox
                form={form}
                formName={'collections'}
                label="Collections"
                required
                placeholder="Select some collections"
                disabled={isPending}
                data={coreData?.collections || []}
                // renderContent={(query) => (
                //     <DialogCreateItemCollection
                //         initialValue={query}
                //         className="w-full border-none"
                //         initialOpen={false}
                //     />
                // )}
            />
            <FormCombobox
                form={form}
                formName={'brandId'}
                label="Brands"
                required
                placeholder="Select a brand"
                disabled={isPending}
                data={coreData?.brands || []}
            />
            <FormCombobox
                form={form}
                formName={'modelId'}
                label="Models"
                required
                placeholder="Select a model"
                disabled={isPending}
                data={coreData?.models || []}
            />
        </>
    );
}
