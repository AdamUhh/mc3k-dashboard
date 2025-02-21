import Image from 'next/image';
import { type ChangeEvent, RefObject } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { Button } from '@/shadcn/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shadcn/form';
import { Input } from '@/shadcn/input';

import { cn } from '@/lib/utils';

import { UpdateCollectionType } from '@/db/validations/collections';

interface ImagePreviewType {
    url: string | null;
    size: string | null;
}

interface ImagePreviewProps {
    url: string;
    size?: string | null;
    original?: boolean;
}

interface ImageUploadFieldProps {
    form: UseFormReturn<UpdateCollectionType>;
    showUrl: boolean;
    imagePreview: ImagePreviewType;
    imageInput: string | null;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onFileReset: (forceFormValue?: string) => void;
    onToggleType: () => void;
    imageInputRef: RefObject<HTMLInputElement | null>;
}

const ImagePreview = ({ url, size, original = false }: ImagePreviewProps) => {
    const dimensions = original ? '150px' : 'auto';
    return (
        <div className="group relative">
            <Image
                src={url}
                alt="Preview"
                className="rounded-md shadow-lg"
                height={0}
                width={0}
                sizes={dimensions}
                style={{
                    width: dimensions,
                    height: 'auto',
                    maxHeight: dimensions,
                }}
            />
            {size && (
                <span className="absolute bottom-1 left-1 rounded-md border border-input bg-white/80 px-2 py-1 text-sm backdrop-blur-md group-hover:hidden">
                    {size}
                </span>
            )}
        </div>
    );
};

export const ImageUploadField = ({
    form,
    showUrl,
    imagePreview,
    onFileChange,
    onUrlChange,
    onToggleType,
    onFileReset,
    imageInput: urlInput,
    imageInputRef,
}: ImageUploadFieldProps) => {
    const isDirty = form.formState.dirtyFields['img'];

    return (
        <FormField
            control={form.control}
            name="img"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { value: _, onChange: __, ...fieldProps } }) => (
                <FormItem className="w-full">
                    <div className="flex justify-end gap-2">
                        {isDirty && !imagePreview.url && !urlInput && (
                            <Button
                                type="button"
                                onClick={() => onFileReset()}
                                variant="secondary"
                            >
                                Keep Original Image
                            </Button>
                        )}

                        {(imagePreview.url || urlInput) && (
                            <Button
                                type="button"
                                onClick={() => onFileReset()}
                                variant="secondary"
                            >
                                Reset File & URL
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={onToggleType}
                            variant="secondary"
                        >
                            {showUrl ? 'Got a File?' : 'Got a URL?'}
                        </Button>
                    </div>
                    <FormControl>
                        <div className="relative">
                            <FormLabel className="absolute -top-2 left-2 bg-background px-1 text-xs">
                                Upload new thumbnail
                            </FormLabel>
                            <Input
                                {...fieldProps}
                                type="url"
                                placeholder="File URL here"
                                className={cn(
                                    isDirty && 'dirty',
                                    isDirty &&
                                        !imagePreview.url &&
                                        !urlInput &&
                                        'missing',

                                    !showUrl && 'hidden'
                                )}
                                value={urlInput ?? ''}
                                onChange={onUrlChange}
                            />
                            <Input
                                {...fieldProps}
                                type="file"
                                className={cn(
                                    'h-full cursor-pointer py-1.5 file:cursor-pointer',
                                    isDirty && 'dirty',
                                    isDirty &&
                                        !imagePreview.url &&
                                        !urlInput &&
                                        'missing',
                                    showUrl && 'hidden'
                                )}
                                accept="image/*"
                                onChange={onFileChange}
                                ref={imageInputRef}
                            />
                        </div>
                    </FormControl>
                    {imagePreview.url && !showUrl && (
                        <ImagePreview
                            url={imagePreview.url}
                            size={imagePreview.size}
                        />
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
