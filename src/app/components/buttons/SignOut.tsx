'use client';

import { signOut } from "next-auth/react";

const SignOutButton = () => {
    return ( 
        <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => signOut({ callbackUrl: '/' })} // Redirects to '/' after signout
        >
            Sign Out
        </button>
    );
}
 
export default SignOutButton;