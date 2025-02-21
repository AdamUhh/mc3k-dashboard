export class PublicError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends PublicError {
    constructor(message: string, overrideMessage?: boolean) {
        super(!overrideMessage ? `${message} not found` : message);
        this.name = '[NOT_FOUND_ERROR]';
    }
}

export class ImageProcessingError extends PublicError {
    constructor(message: string) {
        super(message);
        this.name = '[IMAGE_PROCESSING_ERROR]';
    }
}

export class ValidationError extends PublicError {
    constructor(message: string) {
        super(message);
        this.name = '[VALIDATION_ERROR]';
    }
}
export class NetworkError extends PublicError {
    constructor(message: string) {
        super(message);
        this.name = '[NETWORK_ERROR]';
    }
}

export class AuthenticationError extends PublicError {
    constructor() {
        super('You must be logged in to view this content');
        this.name = '[AUTHENTICATION_ERROR]';
    }
}

export class UnknownError extends PublicError {
    constructor(message: string) {
        super(message);
        this.name = '[UNKNOWN_ERROR]';
    }
}

function formatErrorMessage(baseMessage: string, error: unknown): string {
    return `${baseMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`;
}

export function handleError(error: unknown, baseMessage: string): never {
    if (error instanceof Error && error instanceof PublicError) {
        throw error;
    }
    throw new UnknownError(formatErrorMessage(baseMessage, error));
}
