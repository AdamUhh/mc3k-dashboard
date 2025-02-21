'use client';

import { ROUTES } from '@/constants/navigation';
import Link from 'next/link';
import { useQueryState } from 'nuqs';

import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';

import { UpdateModelType } from '@/db/validations/models';

import { CreateModelButton, UpdateModelButton } from './edit-button';

function SearchBar({
    value,
    onChange,
}: {
    value: string;
    onChange: (query: string) => void;
}) {
    return (
        <Input
            type="search"
            placeholder="Search models..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default function ClientModelList({
    initialData,
}: {
    initialData: UpdateModelType[];
}) {
    const [search, setSearch] = useQueryState('q', { defaultValue: '' });

    const filteredData = initialData.filter((model) => {
        const searchTerms = search.toLowerCase().replace(/\s+/g, '');
        const normalizedModelName = model.name
            .toLowerCase()
            .replace(/\s+/g, '');

        // Check if search terms exist in any order within the brand name
        return searchTerms
            .split('')
            .every((char) => normalizedModelName.includes(char));
    });

    return (
        <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                <CreateModelButton />
                {filteredData.length > 0 ? (
                    filteredData.map((model) => (
                        <div className="group relative" key={model.id}>
                            <Button variant="outline" asChild>
                                <Link
                                    href={`${ROUTES.MODELS}/${model.id}`}
                                    className="h-full w-full"
                                >
                                    {model.name}
                                </Link>
                            </Button>
                            <div className="invisible absolute right-0 top-0 h-full transition-all group-hover:visible">
                                <UpdateModelButton {...model} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No models found...</div>
                )}
            </div>
        </div>
    );
}
