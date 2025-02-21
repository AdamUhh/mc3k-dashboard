'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Badge } from '../badge';
import { Button } from '../button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../command';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from '../form';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export interface Option {
    id: string;
    name: string;
    toDelete?: boolean;
    isNew?: boolean;
}

interface BaseFormComboboxProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    formName: string;
    placeholder: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    data?: Option[];
    renderContent?: (query: string) => React.ReactNode;
}

interface SimpleComboboxProps extends BaseFormComboboxProps {
    fieldKey?: never;
    index?: never;
}

interface ComplexComboboxProps extends BaseFormComboboxProps {
    fieldKey: string;
    index: number;
}

type FormComboboxProps = SimpleComboboxProps | ComplexComboboxProps;

function ComboboxButton({
    field,
    disabled,
    placeholder,
    isDirty,
    handleToggleSelect,
}: {
    field: ControllerRenderProps;
    disabled?: boolean;
    placeholder: string;
    isDirty?: boolean;
    handleToggleSelect: (field: ControllerRenderProps, option: Option) => void;
}) {
    const { error } = useFormField();
    return (
        <PopoverTrigger asChild>
            <FormControl>
                <Button
                    asChild
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                        'relative w-full cursor-pointer justify-start gap-2 pl-2 pr-10',
                        (!field.value || !field.value.length) &&
                            'text-muted-foreground',
                        isDirty && 'dirty',
                        error && 'missing',
                        disabled && 'pointer-events-none opacity-50'
                    )}
                >
                    <div>
                        {field.value?.map((option: Option) =>
                            option.toDelete ? null : (
                                <Badge
                                    key={option.id}
                                    variant="secondary"
                                    className={cn(
                                        'cursor-default rounded-lg border-input pr-1'
                                    )}
                                >
                                    <span className="flex h-full w-full items-center">
                                        {option.name}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            'ml-2 h-fit cursor-pointer rounded-full p-0.5 outline-none ring-offset-background hover:bg-black hover:text-white focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                        )}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleToggleSelect(
                                                    field,
                                                    option
                                                );
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleToggleSelect(field, option);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )
                        )}
                        {(!field.value ||
                            !field.value.length ||
                            field.value.every((s: Option) => s.toDelete)) &&
                            placeholder}
                        <ChevronsUpDown className="absolute right-4 top-1/2 ml-2 h-4 w-4 shrink-0 -translate-y-1/2 opacity-50" />
                    </div>
                </Button>
            </FormControl>
        </PopoverTrigger>
    );
}

export default function FormMultiCombobox({
    form,
    formName,
    fieldKey,
    index,
    label,
    placeholder,
    data,
    disabled,
    required = false,
    renderContent,
}: FormComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState<string>('');

    const getFieldName = useCallback(
        () =>
            fieldKey !== undefined && index !== undefined
                ? `${formName}.${index}.${fieldKey}`
                : formName,
        [fieldKey, formName, index]
    );

    const isFieldInput = fieldKey !== undefined && index !== undefined;

    const isDirty = isFieldInput
        ? form.formState.dirtyFields[formName]?.[index]?.[fieldKey]
        : form.formState.dirtyFields[formName];

    const handleToggleSelect = (field: ControllerRenderProps, d: Option) => {
        const currentValue = field.value || [];
        const name = getFieldName();
        const idx = currentValue.findIndex((s: Option) => s.id === d.id);

        if (idx >= 0) {
            // Existing item
            const item = currentValue[idx];
            if (item.isNew) {
                // Remove if new
                form.setValue(
                    name,
                    currentValue.filter((s: Option) => s.id !== d.id),
                    { shouldDirty: true }
                );
            } else if (item.toDelete) {
                // Remove toDelete flag if exists
                const updatedItems = [...currentValue];
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { toDelete, ...rest } = updatedItems[idx];
                updatedItems[idx] = rest;
                form.setValue(name, updatedItems, { shouldDirty: true });
            } else {
                // Add toDelete flag
                const updatedItems = [...currentValue];
                updatedItems[idx] = { ...updatedItems[idx], toDelete: true };
                form.setValue(name, updatedItems, { shouldDirty: true });
            }
        } else {
            // Add new item
            form.setValue(name, [...currentValue, { ...d, isNew: true }], {
                shouldDirty: true,
            });
        }

        form.clearErrors(name);
    };
    // const handleToggleSelect = (field: ControllerRenderProps, d: Option) => {
    //     const currentValue = field.value || [];
    //     const updatedValue = currentValue.some((s: Option) => s.id === d.id)
    //         ? currentValue.filter((s: Option) => s.id !== d.id)
    //         : [...currentValue, d];
    //
    //     const name = getFieldName();
    //     form.setValue(name, updatedValue, { shouldDirty: true });
    //     form.clearErrors(name);
    // };

    return (
        <>
            <FormField
                control={form.control}
                name={getFieldName()}
                render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                        {label && (
                            <FormLabel>
                                {label}
                                {required && '*'}
                            </FormLabel>
                        )}
                        <Popover modal open={open} onOpenChange={setOpen}>
                            <ComboboxButton
                                field={field}
                                disabled={disabled}
                                placeholder={placeholder}
                                isDirty={isDirty}
                                handleToggleSelect={handleToggleSelect}
                            />
                            <PopoverContent className="popover-content-width-full w-full p-0">
                                <Command
                                    filter={(value, search) =>
                                        value.includes(search) ? 1 : 0
                                    }
                                >
                                    <CommandInput
                                        value={query}
                                        onValueChange={setQuery}
                                        placeholder={placeholder}
                                    />
                                    <CommandList>
                                        <CommandEmpty className="p-2 pb-0">
                                            <div className="py-2">
                                                No {label ? label : formName}{' '}
                                                found
                                            </div>
                                            {renderContent?.(query)}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {data?.map((d) => (
                                                <CommandItem
                                                    value={d.name}
                                                    key={d.id}
                                                    onSelect={() =>
                                                        handleToggleSelect(
                                                            field,
                                                            d
                                                        )
                                                    }
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            field.value?.some(
                                                                (s: Option) =>
                                                                    s.id ===
                                                                        d.id &&
                                                                    !s.toDelete
                                                            )
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        )}
                                                    />
                                                    {d.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
