'use client';

import { ReactNode, useState } from 'react';

import { AppStateContext, CoreDataType } from './context';

export default function AppStateProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [coreData, setCoreData] = useState<CoreDataType>({ collections: [] });

    return (
        <AppStateContext.Provider
            value={{
                coreData,
                setCoreData,
            }}
        >
            {children}
        </AppStateContext.Provider>
    );
}
