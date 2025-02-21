import { ChangeEvent, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';

import { previewImage } from '@/lib/previewImage';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export interface ImagePreview {
    url: string | null;
    size: string | null;
}

export interface ImageInput {
    file: File | null;
    url: string | null;
}

type TransformOptions =
    | {
          width: number;
          height: number;
          transformIfBigger?: boolean;
      }
    | {
          width?: never;
          height?: never;
          transformIfBigger?: boolean;
      };
export const useImageUpload = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>,
    options?: TransformOptions,
    formImgSetter = 'img'
) => {
    const [imagePreview, setImagePreview] = useState<ImagePreview>({
        url: null,
        size: null,
    });
    const [imageInput, setImageInput] = useState<ImageInput>({
        file: null,
        url: null,
    });
    const [showUrl, setShowUrl] = useState(true);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileReset = (forceFormValue?: string) => {
        if (imageInputRef.current) imageInputRef.current.value = '';
        setImagePreview({ url: null, size: null });
        setImageInput({ file: null, url: null });
        form.setValue(formImgSetter, forceFormValue || null, {
            shouldDirty: true,
        });
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size exceeds 2MB limit');
            return;
        }

        try {
            const result = await previewImage(file, options);
            const base64Image = `data:${result.contentType};base64,${result.b64Data}`;
            const sizeInfo = `Original: ${result.originalSize} (${result.originalDimensions}) → Processed: ${result.processedSize} (${result.processedDimensions})`;

            setImagePreview({ url: base64Image, size: sizeInfo });
            setImageInput((prev) => ({ ...prev, file }));
            form.setValue(formImgSetter, file, { shouldDirty: true });
        } catch (error) {
            toast.error('Failed to process image');
            console.error('Failed to process image:', error);
        }
    };

    const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        setImageInput((prev) => ({ ...prev, url }));
        form.setValue(formImgSetter, url, { shouldDirty: true });
    };

    const toggleImageInputType = () => {
        setShowUrl((prev) => !prev);
        if (!imageInput.url && !imageInput.file) return;
        form.setValue(
            formImgSetter,
            showUrl ? imageInput.file : imageInput.url
        );
    };

    return {
        imagePreview,
        imageInput,
        showUrl,
        imageInputRef,
        onFileReset: handleFileReset,
        onFileChange: handleFileChange,
        onUrlChange: handleUrlChange,
        onToggleType: toggleImageInputType,
    };
};
