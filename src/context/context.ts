import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export type CoreDataType = {
    collections: { id: string; name: string }[];
    brands: { id: string; name: string }[];
    models: { id: string; name: string }[];
};

export interface AppStateContext {
    coreData?: CoreDataType;
    setCoreData?: Dispatch<SetStateAction<CoreDataType>>;
}

export const AppStateContext = createContext<AppStateContext>({});

export const useAppState = () => useContext(AppStateContext);
