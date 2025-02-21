import { navigation } from '@/constants/navigation';
import Link from 'next/link';

import Header from '@/components/Header';

function NavItem({ n }: { n: { href: string; name: string } }) {
    return (
        <Link
            key={n.href}
            href={n.href}
            className="flex h-48 w-full items-center justify-center rounded-md bg-muted p-4 text-2xl hover:bg-input"
        >
            {n.name}
        </Link>
    );
}
export default async function DashboardPage() {
    return (
        <main>
            <Header title="Dashboard" description="Welcome!" />
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    {navigation.slice(6, 9).map((n) => (
                        <NavItem key={n.name} n={n} />
                    ))}
                </div>
                <div className="flex gap-4">
                    {navigation.slice(4, 6).map((n) => (
                        <NavItem key={n.name} n={n} />
                    ))}
                </div>
                <div className="flex gap-4">
                    {navigation.slice(1, 4).map((n) => (
                        <NavItem key={n.name} n={n} />
                    ))}
                </div>
            </div>
        </main>
    );
}
