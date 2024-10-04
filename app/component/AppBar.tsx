"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link"

export function AppBar(){
    const session = useSession();
    return <div>
        <div className="flex justify-between bg-black">
            <Link className="flex items-center justify-center" href="/">
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 mr-2 text-red-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            <span className="font-bold text-xl text-white">Musix</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:text-red-600 transition-colors flex items-center text-white" href="#">
                Features
            </Link>
            <Link className="text-sm font-medium hover:text-red-600 transition-colors flex items-center text-white" href="#">
                About
            </Link>
            <Link className="text-sm font-medium hover:text-red-600 transition-colors flex items-center text-white" href="#">
                Contact
            </Link>
            <div className="pt-2">
                {session.data?.user && <Button className="focus:outline-none text-black bg-white hover:bg-red-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex items-center"  onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>}

                {!session.data?.user && <Button className="focus:outline-none text-black bg-white hover:bg-red-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex items-center" onClick={() => signIn()}>Sign In</Button>}
            </div>
            </nav>
        </div>
    </div>
}