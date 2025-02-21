/* eslint-disable @typescript-eslint/no-explicit-any */
import { PencilIcon, RotateCcw } from 'lucide-react';
import { HTMLInputTypeAttribute } from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { Button } from '@/shadcn/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from '@/shadcn/form';
import { Input } from '@/shadcn/input';

import { cn, formatHandle } from '@/lib/utils';

interface BaseFormInputProps {
    form: UseFormReturn<any>;
    formName: string;
    placeholder: string;
    autoFocus?: boolean;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    type?: HTMLInputTypeAttribute;
}

interface SimpleInputProps extends BaseFormInputProps {
    fieldKey?: never;
    index?: never;
}

interface ComplexInputProps extends BaseFormInputProps {
    fieldKey: string;
    index: number;
}

type FormInputProps = SimpleInputProps | ComplexInputProps;

function FormInputChild({
    placeholder,
    type,
    className,
    autoFocus,
    disabled,
    field,
    isDirty,
}: Pick<
    BaseFormInputProps,
    'className' | 'type' | 'autoFocus' | 'placeholder' | 'disabled'
> & { field: ControllerRenderProps; isDirty: boolean }) {
    const { error } = useFormField();
    return (
        <Input
            {...field}
            className={cn(isDirty && 'dirty', error && 'missing', className)}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            type={type}
            min={0}
        />
    );
}

export default function FormInput({
    form,
    formName,
    placeholder,
    autoFocus,
    className,
    required,
    disabled,
    fieldKey,
    index,
    type,
}: FormInputProps) {
    const getFieldName = () => {
        return fieldKey !== undefined && index !== undefined
            ? `${formName}.${index}.${fieldKey}`
            : formName;
    };

    const isFieldInput = fieldKey !== undefined && index !== undefined;

    const isDirty = isFieldInput
        ? form.formState.dirtyFields[formName]?.[index]?.[fieldKey]
        : form.formState.dirtyFields[formName];

    return (
        <FormField
            control={form.control}
            name={getFieldName()}
            render={({ field }) => (
                <FormItem className="group relative mb-2 w-full space-y-0">
                    {formName && (
                        <FormLabel className="absolute -top-2 left-2 z-10 bg-background px-1 text-xs">
                            {formName}
                            {required && '*'}
                        </FormLabel>
                    )}
                    <FormControl>
                        <FormInputChild
                            isDirty={isDirty}
                            disabled={disabled}
                            field={field}
                            placeholder={
                                required ? `${placeholder}*` : placeholder
                            }
                            className={className}
                            autoFocus={autoFocus}
                            type={type}
                        />
                    </FormControl>

                    {formName === 'handle' && (
                        <Button
                            variant="outline"
                            title="Format handle according to name"
                            onClick={() =>
                                form.setValue(
                                    'handle',
                                    formatHandle(form.getValues('name')),
                                    { shouldDirty: true }
                                )
                            }
                            className={cn(
                                'absolute right-0.5 top-0.5 hidden h-8 w-10 group-hover:flex',
                                isDirty && 'right-12',
                                disabled && 'hidden'
                            )}
                            type="reset"
                        >
                            <PencilIcon size={16} />
                        </Button>
                    )}
                    {/* This does not show up for fieldArrays, since it completely breaks behaviour when
                     * a user resets AFTER sorting something (i.e feature, variant) */}
                    {!fieldKey && (
                        <Button
                            variant="outline"
                            title="Reset to original value"
                            onClick={() => form.resetField(getFieldName())}
                            className={cn(
                                'absolute right-0.5 top-0.5 h-8 w-10',
                                (!isDirty || disabled) && 'hidden'
                            )}
                            type="reset"
                        >
                            <RotateCcw size={16} />
                        </Button>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
