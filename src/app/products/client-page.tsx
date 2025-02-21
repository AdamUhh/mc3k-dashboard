'use client';

import { CoreDataType, useAppState } from '@/context/context';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';

import { UpdateProductFormType } from '@/db/validations/products';

import { CreateProductButton, UpdateProductButton } from './edit-button';

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
            placeholder="Search products..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function UpdateState({ coreData }: { coreData: CoreDataType }) {
    const [once, setOnce] = useState(false);
    const { setCoreData } = useAppState();
    useEffect(() => {
        console.log('useeffect');
        if (coreData && setCoreData && !once) {
            setOnce(true);
            setCoreData(coreData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export default function ClientProductList({
    initialData,
    coreData,
}: {
    initialData: UpdateProductFormType[];
    coreData: CoreDataType;
}) {
    const [search, setSearch] = useQueryState('q', { defaultValue: '' });

    const filteredData = initialData.filter((product) => {
        const searchTerms = search.toLowerCase().replace(/\s+/g, '');
        const normalizedProductName = product.name
            .toLowerCase()
            .replace(/\s+/g, '');

        // Check if search terms exist in any order within the product name
        return searchTerms
            .split('')
            .every((char) => normalizedProductName.includes(char));
    });

    return (
        <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <UpdateState coreData={coreData} />
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                <CreateProductButton />
                {filteredData.length > 0 ? (
                    filteredData.map((product) => (
                        <div className="group relative" key={product.id}>
                            <Button className="h-full w-full" variant="outline">
                                {product.name}
                            </Button>
                            <div className="invisible absolute right-0 top-0 h-full transition-all group-hover:visible">
                                <UpdateProductButton {...product} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products found...</div>
                )}
            </div>
        </div>
    );
}
