import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { env } from './env';
import { ValidationError, handleError } from './errors';

type S3UploadResult = {
    location?: string;
    key: string;
};

const s3Client = new S3Client({
    region: env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: env.AWS_PUBLIC_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = env.AWS_BUCKET_KEY;

export async function uploadFile(
    fileBuffer: Buffer,
    filename: string
): Promise<S3UploadResult> {
    if (!fileBuffer) {
        throw new ValidationError('No file provided for upload');
    }

    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: BUCKET_NAME,
                Key: filename,
                Body: fileBuffer,
                ContentType: 'image/webp', // dont know if this is correct
            },
            queueSize: 4,
            leavePartsOnError: false,
        });

        await upload.done();

        return {
            key: filename,
        };
    } catch (error) {
        console.error('S3 Upload Error:', error);
        handleError(error, 'Failed to upload file');
    }
}

export async function deleteObject(
    imgId: string | null | undefined
): Promise<void> {
    if (!imgId) return;

    try {
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: imgId,
            })
        );
    } catch (error) {
        console.error('S3 Delete Error:', error);
        handleError(error, 'Failed to delete file');
    }
}
