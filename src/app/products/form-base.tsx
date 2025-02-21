import { useEffect } from 'react';
import {
    FieldErrors,
    UseFormReturn,
    useFieldArray,
    useWatch,
} from 'react-hook-form';

import Attributes from '@/components/Products/Attributes/index';
import Details from '@/components/Products/Details/index';

import { LoaderButton } from '@/shadcn/custom/loading-button';
import { Form } from '@/shadcn/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/tabs';

import { cn, formatHandle } from '@/lib/utils';

import { CreateProductType } from '@/db/validations/products';

function TabErrorNotif({
    form,
    fields,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    fields: Array<keyof FieldErrors<CreateProductType>>;
}) {
    const errors = form.formState.errors;
    const dirtyFields = form.formState.dirtyFields;

    const hasError = fields.some((field) => field in errors);

    if (hasError)
        return (
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
        );

    const isDirty = fields.some((field) => {
        const isDirtyField = dirtyFields[field];

        if (Array.isArray(isDirtyField)) {
            return isDirtyField.some((dirty) =>
                Object.values(dirty || {}).some((v) => v)
            );
        }
        return isDirtyField;
    });

    if (isDirty)
        return (
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-blue-500" />
        );

    return null;
}

interface ProductFormBaseProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    children?: React.ReactNode;
}

export const ProductFormBase = ({
    form,
    onSubmit,
    isPending,
    children,
}: ProductFormBaseProps) => {
    const nameValue = useWatch({ control: form.control, name: 'name' });

    useEffect(() => {
        if (
            !form.formState.dirtyFields.handle &&
            form.formState.defaultValues?.handle === ''
        ) {
            form.setValue('handle', formatHandle(nameValue));
        }
    }, [nameValue, form.formState.dirtyFields.handle, form]);

    const fieldsFeature = useFieldArray({
        keyName: 'customId',
        control: form.control,
        name: 'features',
    });

    const fieldsCollection = useFieldArray({
        keyName: 'customId',
        control: form.control,
        name: 'collections',
    });

    const isUpdateMode = Boolean(form?.formState?.defaultValues?.id);
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    {children}
                    <Tabs defaultValue="attributes" className="flex flex-col">
                        <TabsList className="sticky top-0 grid w-full grid-cols-3">
                            <TabsTrigger value="product-details">
                                Product Details
                                <TabErrorNotif
                                    form={form}
                                    fields={[
                                        'name',
                                        'handle',
                                        'description',
                                        'features',
                                    ]}
                                />
                            </TabsTrigger>
                            <TabsTrigger value="attributes">
                                Attributes
                                <TabErrorNotif
                                    form={form}
                                    fields={[
                                        'collections',
                                        'brandId',
                                        'modelId',
                                        // 'tags',
                                    ]}
                                />
                            </TabsTrigger>
                            <TabsTrigger value="variants">
                                Images & Variants
                                <TabErrorNotif
                                    form={form}
                                    fields={[
                                        // 'productImages',
                                        'labelId',
                                        // 'variants',
                                    ]}
                                />
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="product-details"
                            className={cn('space-y-4 overflow-y-auto p-2')}
                        >
                            <Details
                                form={form}
                                isPending={isPending}
                                fieldsFeature={fieldsFeature}
                            />
                        </TabsContent>
                        <TabsContent
                            value="attributes"
                            className={cn('space-y-4 overflow-y-auto p-2')}
                        >
                            <Attributes
                                form={form}
                                isPending={isPending}
                                fieldsCollection={fieldsCollection}
                            />
                        </TabsContent>
                        <TabsContent
                            value="variants"
                            className={cn('space-y-4 overflow-y-auto p-2')}
                        ></TabsContent>
                    </Tabs>
                </div>
                <LoaderButton
                    type="submit"
                    size="submit"
                    variant="outline"
                    icon="save"
                    isLoading={isPending}
                    className="absolute bottom-0 right-5"
                >
                    {isUpdateMode ? 'Update' : 'Create'}
                </LoaderButton>
            </form>
        </Form>
    );
};
