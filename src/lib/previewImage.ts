'use server';

import sharp from 'sharp';

import { NotFoundError, ValidationError, handleError } from './errors';
import { uploadFile } from './s3';
import { generateRandomHex } from './utils';

const IMAGE_CONFIG = {
    maxSizeMB: 2,
    dimensions: {
        width: 600,
        height: 600,
    },
    format: 'webp',
} as const;

export async function processImageIfProvided(
    img?: File | string | null,
    filename?: string | null,
    options?: TransformOptions
) {
    if (!img) return null;

    const processedBuffer = await (
        img instanceof File
            ? transformImageFile(img, options)
            : transformImageURL(img, options)
    ).then((result) => result.processedBuffer);

    const uploadResult = await uploadFile(
        processedBuffer,
        filename || generateRandomHex()
    );
    return uploadResult.key;
}

async function fetchURLBuffer(url: string): Promise<Buffer> {
    try {
        const response = await fetch(url, {
            headers: { Accept: 'image/*' },
        });

        if (!response.ok) {
            throw new ValidationError(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.startsWith('image/')) {
            throw new ValidationError('URL does not point to an image');
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        handleError(error, 'Failed to fetch url image');
    }
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

async function transformImage(
    fileBuffer: Buffer,
    options?: TransformOptions
): Promise<Buffer> {
    if (fileBuffer.length > IMAGE_CONFIG.maxSizeMB * 1024 * 1024) {
        throw new ValidationError(
            `Image size exceeds ${IMAGE_CONFIG.maxSizeMB}MB limit`
        );
    }

    // TODO: These options all need to be worked on properly.
    // I don't know if i should force a width/height, or leave it be
    // Or if i force it, what dimensions to force it to
    try {
        const image = sharp(fileBuffer);
        const metadata = await image.metadata();

        // No options provided, use default config dimensions
        if (!options?.width && !options?.height) {
            return image
                .resize({
                    height: IMAGE_CONFIG.dimensions.height,
                    width: IMAGE_CONFIG.dimensions.width,
                    fit: 'contain',
                    background: '#ffffff',
                })
                .toFormat(IMAGE_CONFIG.format)
                .toBuffer();
        }

        const shouldResize =
            !options.transformIfBigger || // Always resize if transformIfBigger is false/undefined
            (options.width &&
                metadata.width &&
                metadata.width > options.width) ||
            (options.height &&
                metadata.height &&
                metadata.height > options.height);

        if (shouldResize) {
            return image
                .resize({
                    height: options.height,
                    width: options.width,
                    // fit: 'contain',
                    background: '#ffffff',
                })
                .toFormat(IMAGE_CONFIG.format)
                .toBuffer();
        }

        return image.toFormat(IMAGE_CONFIG.format).toBuffer();
    } catch (error) {
        handleError(error, 'Image transformation failed');
    }
}

export async function transformImageFile(
    file: File,
    options?: TransformOptions
) {
    if (!file.type.startsWith('image/')) {
        throw new ValidationError('Invalid file type. Please upload an image.');
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        const processedBuffer = await transformImage(fileBuffer, options);

        return { processedBuffer, fileBuffer };
    } catch (error) {
        handleError(error, 'File processing failed');
    }
}

export async function transformImageURL(
    fileURL: string,
    options?: TransformOptions
) {
    try {
        const fileBuffer = await fetchURLBuffer(fileURL);
        const processedBuffer = await transformImage(fileBuffer, options);

        return { processedBuffer, fileBuffer };
    } catch (error) {
        handleError(error, 'URL processing failed');
    }
}

export async function previewImage(file: File, options?: TransformOptions) {
    if (!file) throw new NotFoundError('file');

    try {
        const { processedBuffer, fileBuffer } = await transformImageFile(
            file,
            options
        );
        const originalMetadata = await sharp(fileBuffer).metadata();
        const processedMetadata = await sharp(processedBuffer).metadata();

        return {
            b64Data: processedBuffer.toString('base64'),
            contentType: `image/${IMAGE_CONFIG.format}`,
            originalSize: `${(file.size / 1024).toFixed(2)} KB`,
            processedSize: `${(processedBuffer.length / 1024).toFixed(2)} KB`,
            originalDimensions: `${originalMetadata.width}x${originalMetadata.height}`,
            processedDimensions: `${processedMetadata.width}x${processedMetadata.height}`,
        };
    } catch (error) {
        handleError(error, 'Preview generation failed');
    }
}
