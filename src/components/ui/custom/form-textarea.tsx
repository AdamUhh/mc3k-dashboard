/* eslint-disable @typescript-eslint/no-explicit-any */
import { RotateCcw } from 'lucide-react';
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
import { Textarea } from '@/shadcn/textarea';

import { cn } from '@/lib/utils';

interface BaseFormTextareaProps {
    form: UseFormReturn<any>;
    formName: string;
    placeholder: string;
    autoFocus?: boolean;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}

interface SimpleTextareaProps extends BaseFormTextareaProps {
    fieldKey?: never;
    index?: never;
}

interface ComplexTextareaProps extends BaseFormTextareaProps {
    fieldKey: string;
    index: number;
}

type FormTextareaProps = SimpleTextareaProps | ComplexTextareaProps;

function FormTextareaChild({
    placeholder,
    className,
    autoFocus,
    disabled,
    field,
    isDirty,
}: Pick<
    BaseFormTextareaProps,
    'className' | 'autoFocus' | 'placeholder' | 'disabled'
> & { field: ControllerRenderProps; isDirty: boolean }) {
    const { error } = useFormField();
    return (
        <Textarea
            {...field}
            className={cn(isDirty && 'dirty', error && 'missing', className)}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
        />
    );
}

export default function FormTextarea({
    form,
    formName,
    placeholder,
    autoFocus,
    className,
    required,
    disabled,
    fieldKey,
    index,
}: FormTextareaProps) {
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
                        <FormTextareaChild
                            isDirty={isDirty}
                            disabled={disabled}
                            field={field}
                            placeholder={
                                required ? `${placeholder}*` : placeholder
                            }
                            className={className}
                            autoFocus={autoFocus}
                        />
                    </FormControl>
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
