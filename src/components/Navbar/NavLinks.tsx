'use client';

import { navigation } from '@/constants/navigation';
import { useActivePath } from '@/hooks/useActivePath';
import Link from 'next/link';

export default function Navlinks() {
    const isActivePath = useActivePath();
    return (
        <ul className="flex items-center gap-8">
            {navigation.map(({ href, name }) => (
                <li key={href}>
                    <Link
                        href={href}
                        className={
                            isActivePath(href) ? '' : 'text-foreground/50'
                        }
                    >
                        <span>{name}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
