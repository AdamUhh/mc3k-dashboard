'use client';

import { ROUTES } from '@/constants/navigation';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';

import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';

import { UpdateCollectionType } from '@/db/validations/collections';

import { CreateCollectionButton, UpdateCollectionButton } from './edit-button';

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
            placeholder="Search collections..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default function ClientCollectionList({
    initialData,
}: {
    initialData: UpdateCollectionType[];
}) {
    const [search, setSearch] = useQueryState('q', { defaultValue: '' });

    const filteredData = initialData.filter((collection) => {
        const searchTerms = search.toLowerCase().replace(/\s+/g, '');
        const normalizedCollectionName = collection.name
            .toLowerCase()
            .replace(/\s+/g, '');

        // Check if search terms exist in any order within the collection name
        return searchTerms
            .split('')
            .every((char) => normalizedCollectionName.includes(char));
    });

    return (
        <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                <CreateCollectionButton />
                {filteredData.length > 0 ? (
                    filteredData.map((collection) => (
                        <div className="group relative" key={collection.id}>
                            <Button variant="outline" asChild>
                                <Link
                                    href={`${ROUTES.COLLECTIONS}/${collection.id}`}
                                    className="h-full w-full"
                                >
                                    {collection.name}
                                </Link>
                            </Button>
                            {collection.img && (
                                <div className="pointer-events-none absolute left-2 top-2.5 h-full">
                                    <ImageIcon
                                        size={18}
                                        className="rounded-lg stroke-gray-400"
                                    />
                                </div>
                            )}
                            <div className="invisible absolute right-0 top-0 h-full transition-all group-hover:visible">
                                <UpdateCollectionButton
                                    {...collection}
                                    originalImg={collection.img as string}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No collections found...</div>
                )}
            </div>
        </div>
    );
}
