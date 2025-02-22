'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '../button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../command';
import { FormControl, FormField, FormItem, FormLabel } from '../form';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

interface Option {
    id: string;
    name: string;
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
    valueAsObject?: boolean;
    renderContent?: (query: string) => React.ReactNode;
    className?: string;
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

export default function FormCombobox({
    form,
    formName,
    fieldKey,
    index,
    label,
    placeholder,
    data,
    required = false,
    valueAsObject = false,
    className,
    renderContent,
}: FormComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const getFieldName = () =>
        fieldKey !== undefined && index !== undefined
            ? `${formName}.${index}.${fieldKey}`
            : formName;

    const getDisplayValue = (field: ControllerRenderProps) => {
        const value =
            field.value && field.value?.id ? field.value.id : field.value;
        if (!value) return placeholder;

        const result = data?.find((d) => d.id === value);
        return result?.name || placeholder;
    };

    const handleSelect = (d: Option) => {
        const name = getFieldName();
        if (valueAsObject) {
            // This is for tags
            // Have to do it this janky way as trying to update the parent object itself does not trigger a rerender for tagItems
            // it seems to only rerender when changing a (child) property
            // (I cant just do form.setValue(name, d))
            // TODO: try adding dirty to setvalue
            form.setValue(name + '.id', d.id);
        } else form.setValue(name, d.id);
        form.clearErrors(name);
        setOpen(false);
    };

    return (
        <FormField
            control={form.control}
            name={getFieldName()}
            render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2 space-y-0">
                    {label && (
                        <FormLabel>
                            {label}
                            {required && '*'}
                        </FormLabel>
                    )}

                    <Popover modal open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        'w-full justify-between transition-all',
                                        className,
                                        (!field.value ||
                                            (typeof field.value === 'object' &&
                                                (!field.value.id ||
                                                    field.value.id.length <
                                                        1))) &&
                                            'text-muted-foreground'
                                    )}
                                >
                                    {getDisplayValue(field)}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
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
                                            No {label ? label : formName} found
                                        </div>
                                        {renderContent?.(query)}
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {data?.map((d) => (
                                            <CommandItem
                                                value={d.name}
                                                key={d.id}
                                                onSelect={() => handleSelect(d)}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        d.id ===
                                                            (field.value &&
                                                            field.value?.id
                                                                ? field.value.id
                                                                : field.value)
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
                    {/* {!fieldKey && <FormMessage />} */}
                </FormItem>
            )}
        />
    );
}
