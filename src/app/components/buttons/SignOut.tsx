'use client';

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

export function SignOutButton() {
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" className="rounded">
                <LogOutIcon size={13} className="mr-1"></LogOutIcon>
                Sign Out
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    You're about to sign out of the website. Are you sure you want to continue?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="rounded">Cancel</AlertDialogCancel>
                <AlertDialogAction className="rounded" onClick={() => signOut({ callbackUrl: '/' })}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    )
}