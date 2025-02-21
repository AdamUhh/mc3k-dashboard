import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

import FormInput from '@/shadcn/custom/form-input';
import { LoaderButton } from '@/shadcn/custom/loading-button';
import { Form } from '@/shadcn/form';

import { formatHandle } from '@/lib/utils';

interface ModelFormBaseProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    children?: React.ReactNode;
}

export const ModelFormBase = ({
    form,
    onSubmit,
    isPending,
    children,
}: ModelFormBaseProps) => {
    const nameValue = useWatch({ control: form.control, name: 'name' });

    useEffect(() => {
        if (
            !form.formState.dirtyFields.handle &&
            form.formState.defaultValues?.handle === ''
        ) {
            form.setValue('handle', formatHandle(nameValue));
        }
    }, [nameValue, form.formState.dirtyFields.handle, form]);

    const isUpdateMode = Boolean(form?.formState?.defaultValues?.id);
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 p-1">
                <div className="flex gap-4">
                    {children}
                    <div className="flex w-full flex-col gap-4">
                        <FormInput
                            form={form}
                            formName="name"
                            placeholder="Model Name"
                            disabled={isPending}
                            required
                            autoFocus
                        />
                        <FormInput
                            form={form}
                            formName="handle"
                            placeholder="model-url-handle-name"
                            disabled={isPending}
                            required
                        />
                    </div>
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
