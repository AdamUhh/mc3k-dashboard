import { cn } from '@/lib/utils';

export default function Header({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className={cn(description && 'mb-4')}>
            <h1 className="text-4xl font-extralight">{title}</h1>
            {description && (
                <span className="text-lg text-foreground/50">
                    {description}
                </span>
            )}
        </div>
    );
}
