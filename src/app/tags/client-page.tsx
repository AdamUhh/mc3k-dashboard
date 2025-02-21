'use client';

import { useQueryState } from 'nuqs';

import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';

import { ClientTagListProps, UpdateTagItemType } from '@/db/validations/tags';

import {
    CreateTagButton,
    CreateTagItemButton,
    UpdateTagButton,
    UpdateTagItemButton,
} from './edit-button';

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
            placeholder="Search tags..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function TagItem({ id, name }: UpdateTagItemType) {
    return (
        <div className="group relative">
            <Button variant="outline" className="h-full w-full">
                {name}
            </Button>
            <div className="invisible absolute right-0 top-0 h-full transition-all group-hover:visible">
                <UpdateTagItemButton id={id} name={name} />
            </div>
        </div>
    );
}

export default function ClientTagList({
    initialData,
}: {
    initialData: ClientTagListProps[];
}) {
    const [search, setSearch] = useQueryState('q', { defaultValue: '' });

    const filteredData = initialData.filter((tag: ClientTagListProps) => {
        const searchTerms = search.toLowerCase().replace(/\s+/g, '');

        // Check tag name
        const normalizedTagName = tag.name.toLowerCase().replace(/\s+/g, '');
        const matchesTagName = searchTerms
            .split('')
            .every((char) => normalizedTagName.includes(char));

        // Check tag items
        const matchesTagItems =
            tag.tagItems?.some((item) => {
                const normalizedItemName = item.name
                    .toLowerCase()
                    .replace(/\s+/g, '');
                return searchTerms
                    .split('')
                    .every((char) => normalizedItemName.includes(char));
            }) ?? false;

        // Return true if either the tag name or any tag item matches
        return matchesTagName || matchesTagItems;
    });

    return (
        <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <CreateTagButton />
            {filteredData.length > 0 ? (
                filteredData.map((tag) => (
                    <div
                        key={tag.id}
                        className="flex w-full flex-col gap-2 py-2"
                    >
                        <div
                            className="group relative flex h-8 items-center gap-2"
                            key={tag.id}
                        >
                            <div>{tag.name}</div>
                            <div className="invisible h-full transition-all group-hover:visible">
                                <UpdateTagButton id={tag.id} name={tag.name} />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 grid-rows-2 gap-4">
                            <CreateTagItemButton tagId={tag.id} />
                            {tag?.tagItems && tag.tagItems.length > 0 ? (
                                tag.tagItems.map((tagItem) => (
                                    <TagItem
                                        key={tagItem.id}
                                        id={tagItem.id}
                                        name={tagItem.name}
                                    />
                                ))
                            ) : (
                                <div>No tag items found...</div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div>No tags found...</div>
            )}
        </div>
    );
}
