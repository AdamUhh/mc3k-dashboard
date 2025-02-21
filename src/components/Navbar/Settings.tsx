'use client';

import { LogOut, UserCircle } from 'lucide-react';
import { startTransition } from 'react';

import { Button } from '@/shadcn/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { signOutAction } from './action';

export default function SettingsDropdown() {
    const onClick = () => {
        startTransition(async () => {
            await signOutAction();
        });
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3">
                    <UserCircle />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={onClick}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
                {/* The below kind of works? */}
                {/* <DropdownMenuItem asChild> */}
                {/*     <form action={() => signOutAction()}> */}
                {/*         <button */}
                {/*             type="submit" */}
                {/*             className="flex items-center gap-2" */}
                {/*         > */}
                {/*             <LogOut className="mr-2 h-4 w-4" /> */}
                {/*             <span>Log out</span> */}
                {/*         </button> */}
                {/*     </form> */}
                {/* </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
