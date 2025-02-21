'use client';

import { ROUTES } from '@/constants/navigation';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';

import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';

import { UpdateBrandType } from '@/db/validations/brands';

import { CreateBrandButton, UpdateBrandButton } from './edit-button';

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
            placeholder="Search brands..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default function ClientBrandList({
    initialData,
}: {
    initialData: UpdateBrandType[];
}) {
    const [search, setSearch] = useQueryState('q', { defaultValue: '' });

    const filteredData = initialData.filter((brand) => {
        const searchTerms = search.toLowerCase().replace(/\s+/g, '');
        const normalizedBrandName = brand.name
            .toLowerCase()
            .replace(/\s+/g, '');

        // Check if search terms exist in any order within the brand name
        return searchTerms
            .split('')
            .every((char) => normalizedBrandName.includes(char));
    });

    return (
        <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                <CreateBrandButton />
                {filteredData.length > 0 ? (
                    filteredData.map((brand) => (
                        <div className="group relative" key={brand.id}>
                            <Button variant="outline" asChild>
                                <Link
                                    href={`${ROUTES.BRANDS}/${brand.id}`}
                                    className="h-full w-full"
                                >
                                    {brand.name}
                                </Link>
                            </Button>
                            {brand.img && (
                                <div className="pointer-events-none absolute left-2 top-2.5 h-full">
                                    <ImageIcon
                                        size={18}
                                        className="rounded-lg stroke-gray-400"
                                    />
                                </div>
                            )}
                            <div className="invisible absolute right-0 top-0 h-full transition-all group-hover:visible">
                                <UpdateBrandButton
                                    {...brand}
                                    originalImg={brand.img as string}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No brands found...</div>
                )}
            </div>
        </div>
    );
}
