import { useImageUpload } from '@/hooks/useImageUpload';
import { TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

import { Button } from '@/shadcn/button';
import FormInput from '@/shadcn/custom/form-input';
import { LoaderButton } from '@/shadcn/custom/loading-button';
import { Form } from '@/shadcn/form';

import { env } from '@/lib/env';
import { cn, formatHandle } from '@/lib/utils';

import { ImageUploadField } from './image-upload';

interface BrandFormBaseProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    children?: React.ReactNode;
}

interface ThumbnailProps {
    onFileReset: (forceFormValue?: string) => void;
    img: string | null | undefined;
    urlId: string;
}
interface ImagePreviewProps {
    url: string;
    size?: string | null;
    willDelete?: boolean;
    original?: boolean;
}

const ImagePreview = ({
    url,
    size,
    willDelete = false,
    original = false,
}: ImagePreviewProps) => {
    const dimensions = original ? '150px' : '450px';
    const styles = {
        width: dimensions,
        height: dimensions,
        maxHeight: dimensions,
    };
    return (
        <div style={styles} className="relative shrink-0">
            <Image
                src={url}
                alt="Preview"
                className={cn(
                    'rounded-md border border-input shadow-lg',
                    willDelete && 'border-destructive'
                )}
                height={0}
                width={0}
                sizes={dimensions}
                style={styles}
            />
            {size && (
                <span className="absolute bottom-1 left-1 rounded-md border border-input bg-white/80 px-2 py-1 text-sm backdrop-blur-md">
                    {size}
                </span>
            )}
        </div>
    );
};

export const Thumbnail = ({ urlId, img, onFileReset }: ThumbnailProps) => {
    const [showThumbnail, setShowThumbnail] = useState(false);

    const handleDelete = () => {
        onFileReset(urlId);
    };
    return (
        <div className="group relative">
            {showThumbnail ? (
                <ImagePreview
                    url={`${env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${urlId}`}
                    original
                    willDelete={img === urlId}
                />
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        'aspect-square h-[150px] p-1',
                        img === urlId && 'border-destructive'
                    )}
                    onClick={() => setShowThumbnail((prev) => !prev)}
                >
                    Show Thumbnail
                </Button>
            )}
            {img !== urlId && (
                <Button
                    variant="destructive"
                    className="invisible absolute -bottom-9 right-0 w-full group-hover:visible"
                    type="button"
                    onClick={handleDelete}
                >
                    <TrashIcon />
                    Delete Image
                </Button>
            )}
        </div>
    );
};

export const BrandFormBase = ({
    form,
    onSubmit,
    isPending,
    children,
}: BrandFormBaseProps) => {
    const nameValue = useWatch({ control: form.control, name: 'name' });
    const imageUploadProps = useImageUpload(form);

    useEffect(() => {
        if (
            !form.formState.dirtyFields.handle &&
            form.formState.defaultValues?.handle === ''
        ) {
            form.setValue('handle', formatHandle(nameValue));
        }
    }, [nameValue, form.formState.dirtyFields.handle, form]);

    useEffect(() => {
        return () => {
            if (imageUploadProps.imagePreview.url?.startsWith('blob:')) {
                URL.revokeObjectURL(imageUploadProps.imagePreview.url);
            }
        };
    }, [imageUploadProps.imagePreview.url]);

    const isUpdateMode = Boolean(form?.formState?.defaultValues?.id);
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 p-1">
                <div className="flex gap-4">
                    {children}
                    {isUpdateMode &&
                        form.formState.defaultValues?.originalImg && (
                            <Thumbnail
                                urlId={
                                    form.formState.defaultValues?.originalImg
                                }
                                img={form.getValues('img')}
                                onFileReset={imageUploadProps.onFileReset}
                            />
                        )}
                    <div className="flex w-full flex-col gap-4">
                        <FormInput
                            form={form}
                            formName="name"
                            placeholder="Brand Name"
                            disabled={isPending}
                            required
                            autoFocus
                        />
                        <FormInput
                            form={form}
                            formName="handle"
                            placeholder="brand-url-handle-name"
                            disabled={isPending}
                            required
                        />
                    </div>
                </div>
                <ImageUploadField
                    {...imageUploadProps}
                    imageInput={imageUploadProps.imageInput.url}
                    form={form}
                />
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
