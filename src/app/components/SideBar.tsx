"use client";

import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/app/components/buttons/SignOut";
import { quicksand } from "../utilities/fonts";
import { User2 } from "lucide-react"; 
import { useState } from "react";

export function SideBar({children}: any) {
    const [expanded, setExpanded] = useState(true);

    return ( 
        <div className="w-60 h-screen flex flex-col border-r min-h-screen mr-10">
            <div className="w-full flex justify-end py-3 pr-3">
                <Button variant="outline" size="icon" onClick={() => setExpanded(!expanded)}>
                    <InfoIcon className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex-1 w-full px-3">
                <div className="w-full">
                    <h2 className="text-slate-500 text-xs font-bold mb-3">Colleges</h2>
                    <ul className="w-full ml-2 pr-2"> {children} </ul>
                </div>
            </div>
            <div className="px-3 py-3 border-t flex flex-col justify-center">
                <div className="flex items-center mb-2">
                    <div className="bg-slate-300 rounded-full p-2">
                        <User2></User2>    
                    </div>
                    
                    <div className="ml-2">
                        <p className="text-xs text-slate-500">Currently signed in as:</p>
                        <p className={`${quicksand.className} font-bold`}>User</p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <SignOutButton></SignOutButton>
                </div>
                
            </div>
        </div>
    );
}

export function SideBarItem({ icon, text, active, onClick }: any) {
    return (
        <li 
            className={`relative w-full flex items-center text-ellipsis overflow-hidden whitespace-nowrap rounded-md cursor-pointer font-medium transition-colors mb-5 p-2
            ${
                active
                ? "bg-gradient-to-tr from-[#C4DAD2] to-[#D6EFD8] text-[#1A5319]"
                : "hover:bg-[#E9EFEC] hover:text-gray-600"
            }`}
            onClick={onClick} 
        >
            {icon}
            <span className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap">{text}</span>
        </li>
    );
}

 
export default {SideBar, SideBarItem};