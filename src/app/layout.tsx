import AppStateProvider from '@/context';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'react-hot-toast';

import Navbar from '@/components/Navbar';

import './globals.css';

const helvetica = localFont({
    src: [
        {
            path: '../lib/fonts/HELVETICANOWDISPLAY-BLACK.ttf',
            weight: '800',
        },
        {
            path: '../lib/fonts/HELVETICANOWDISPLAY-BOLD.ttf',
            weight: '600',
        },
        {
            path: '../lib/fonts/HELVETICANOWDISPLAY-MEDIUM.ttf',
            weight: '500',
        },
        {
            path: '../lib/fonts/HELVETICANOWDISPLAY-REGULAR.ttf',
            weight: '400',
        },
        {
            path: '../lib/fonts/HELVETICANOWDISPLAY-LIGHT.ttf',
            weight: '300',
        },
        {
            path: '../lib/fonts/HELVETICANOWDISPLAY-EXTLT.ttf',
            weight: '200',
        },
        {
            path: '../lib/fonts/HELVETICANOWDISPLAY-THIN.ttf',
            weight: '100',
        },
    ],
    variable: '--font-helvetica',
});

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'A dashboard',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${helvetica.variable} font-helvetica antialiased`}
            >
                <AppStateProvider>
                    <Toaster />
                    <div className="container mx-auto grid min-h-screen grid-rows-[auto_1fr]">
                        <Navbar />
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </div>
                </AppStateProvider>
            </body>
        </html>
    );
}
