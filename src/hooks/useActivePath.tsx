import { usePathname } from 'next/navigation';

/** Returns a function that checks if a given path is the active path in the current URL. */
export function useActivePath(): (path: string) => boolean {
    const pathname = usePathname();

    const isActivePath = (path: string) => {
        if (path === '/' && pathname !== path) {
            return false;
        }
        return pathname.startsWith(path);
    };

    return isActivePath;
}
