import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, User2, ChevronsRight } from "lucide-react";
import { quicksand } from "@/app/utilities/fonts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Account = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid rendering until component is mounted
  if (!isMounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full h-full flex items-center justify-between hover:bg-gray-200 rounded"
          variant="ghost"
        >
          <div className="flex h-full items-center">
            <Avatar>
              <AvatarImage src="/images/plp_logo.png" />
              <AvatarFallback>PLP Logo</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-xs text-slate-500">Currently signed in:</p>
              <p className={`${quicksand.className} font-bold text-left`}>
                PLP-SSO
              </p>
            </div>
          </div>
          <div>
            <ChevronsUpDown size={15} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-56 rounded">
        <DropdownMenuLabel>
          <User2 className="mb-1" />
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/update_account">
            <DropdownMenuItem className="hover:cursor-pointer">
              <ChevronsRight /> Edit Account
            </DropdownMenuItem>
          </Link>
          <Link href="/add_account">
            <DropdownMenuItem className="hover:cursor-pointer">
              <ChevronsRight /> Add Account
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Account;
