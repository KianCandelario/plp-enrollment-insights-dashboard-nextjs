"use client";

import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/app/components/buttons/SignOut";
import { quicksand } from "../utilities/fonts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" 

export function SideBar({children}: any) {
    return ( 
        <div className="h-screen flex flex-col border-r min-h-screen bg-gray-100">
            <div className="w-full flex justify-end py-3 pr-3">
                <Button className="rounded" variant="outline" size="icon">
                    <InfoIcon className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-slate-500 text-xs font-bold mb-3 pl-3">Colleges</p>
            <div className="flex-1 w-full px-3 overflow-y-auto">
                <div className="w-full">
                    <ul className="w-full ml-2 pr-2 space-y-3"> {/* Added space between items */}
                        {children}
                    </ul>
                </div>
            </div>
            <div className="px-3 py-3 mt-2 border-t border-gray-300 flex flex-col justify-center">
                <div className="flex items-center mb-2">
                <Avatar>
                    <AvatarImage src="/images/plp_logo.png" />
                    <AvatarFallback>PLP Logo</AvatarFallback>
                </Avatar>
                    
                    <div className="ml-2">
                        <p className="text-xs text-slate-500">Currently signed in:</p>
                        <p className={`${quicksand.className} font-bold`}>PLP SSO</p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <SignOutButton />
                </div>
                
            </div>
        </div>
    );
}

export function SideBarItem({ icon, text, active, onClick }: any) {
    return (
        <li 
            className={`relative w-full text-sm flex items-center text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer font-medium transition-colors mb-3 p-2 rounded
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

export default { SideBar, SideBarItem };