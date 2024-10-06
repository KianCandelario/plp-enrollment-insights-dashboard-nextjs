'use client';

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react";

export function SignOutButton() {
  return (
        <Button size="sm" variant="destructive" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOutIcon size={13} className="mr-1"></LogOutIcon>
            Sign Out
        </Button>
    )
}