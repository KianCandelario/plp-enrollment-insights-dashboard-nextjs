// SideBar.tsx
import { SignOutButton } from "@/app/components/buttons/SignOut";
import { Separator } from "@/components/ui/separator";
import { UploadFile } from "./buttons/UploadFile";
import { InfoButton } from "./buttons/InfoButton";
import Account from "./buttons/Account";
import { useEffect, useState } from "react";

export function SideBar({ children }: any) {
  const [currentUserRole, setCurrentUserRole] = useState<string>('staff');

  useEffect(() => {
    // Check role from localStorage
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setCurrentUserRole(storedRole);
    }
  }, []);

  const isAdmin = currentUserRole === "admin";

  return (
    <div className="h-screen flex flex-col border-r min-h-screen bg-gray-100">
      <div className="w-full flex justify-end py-3 pr-3">
        <InfoButton />
      </div>
      <p className="text-slate-500 text-xs font-bold mb-3 pl-3">Colleges</p>
      <div className="flex-1 w-full px-3 overflow-y-auto">
        <div className="w-full">
          <ul className="w-full ml-2 pr-2 space-y-3">
            {children}
          </ul>
        </div>
      </div>
      <Separator className="mt-1.5" />
      <div className="px-3 py-3 border-gray-300 flex flex-col justify-center">
        {isAdmin && (
            <div className="w-full h-14">
              <Account />
            </div>
          )}
        <div className="w-full flex justify-center mt-2">
          {isAdmin && (
            <div className="w-[60%]">
              <UploadFile />
            </div>
          )}
          <Separator orientation="vertical" className="mx-2" />
          <div className="">
            <SignOutButton />
          </div>
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