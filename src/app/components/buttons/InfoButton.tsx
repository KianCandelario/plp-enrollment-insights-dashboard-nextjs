import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
 
export function InfoButton() {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant={"outline"} className="rounded">
                <InfoIcon size={14} className="mr-2" /> 
                <span className="text-xs">Quick Guide</span>
            </Button>
        </SheetTrigger>

        <SheetContent>
            <SheetHeader>
                <SheetTitle className="flex items-center">
                    <InfoIcon size={20} className="mr-2" /> Quick Guide
                </SheetTitle>
                <SheetDescription>
                    An easy-to-follow guide for navigating and utilizing the dashboard features efficiently.
                </SheetDescription>

                <div>

                </div>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant={"outline"} className="rounded text-sm">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetHeader>
        </SheetContent>
    </Sheet>
  );
}