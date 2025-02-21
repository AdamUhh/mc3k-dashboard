import { UseFormReturn } from 'react-hook-form';

import FormInput from '@/shadcn/custom/form-input';
import { LoaderButton } from '@/shadcn/custom/loading-button';
import { Form } from '@/shadcn/form';

interface LabelFormBaseProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    children?: React.ReactNode;
}

export const LabelFormBase = ({
    form,
    onSubmit,
    isPending,
    children,
}: LabelFormBaseProps) => {
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
                            placeholder="Label Name"
                            disabled={isPending}
                            required
                            autoFocus
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
