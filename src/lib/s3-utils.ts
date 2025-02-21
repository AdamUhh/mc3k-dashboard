import { env } from "./env";

const CLOUDFRONT_URL = env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL.replace(/\/+$/, '');

export function getObjectUrl(imgId: string): string {
    return `${CLOUDFRONT_URL}/${imgId}`;
}
