'use client';

import { useQueryState } from 'nuqs';

import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';

import { UpdateLabelType } from '@/db/validations/labels';

import { CreateLabelButton, UpdateLabelButton } from './edit-button';

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
            placeholder="Search labels..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default function ClientLabelList({
    initialData,
}: {
    initialData: UpdateLabelType[];
}) {
    const [search, setSearch] = useQueryState('q', { defaultValue: '' });

    const filteredData = initialData.filter((label) => {
        const searchTerms = search.toLowerCase().replace(/\s+/g, '');
        const normalizedLabelName = label.name
            .toLowerCase()
            .replace(/\s+/g, '');

        // Check if search terms exist in any order within the brand name
        return searchTerms
            .split('')
            .every((char) => normalizedLabelName.includes(char));
    });

    return (
        <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                <CreateLabelButton />
                {filteredData.length > 0 ? (
                    filteredData.map((label) => (
                        <div className="group relative" key={label.id}>
                            <Button variant="outline" className="h-full w-full">
                                {label.name}
                            </Button>
                            <div className="invisible absolute right-0 top-0 h-full transition-all group-hover:visible">
                                <UpdateLabelButton {...label} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No labels found...</div>
                )}
            </div>
        </div>
    );
}
