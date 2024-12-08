import { Button } from "@/components/ui/button";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";
const DPAPolicyButton = () => {
    return ( 
        <Link href="/dpa_policy">
            <Button variant="outline" className="rounded text-black_ h-12 ">
                <ShieldAlertIcon size={14} className="mr-2" />
                <span className="text-xs">DPA Policy</span>
            </Button>
        </Link>
    );
}
 
export default DPAPolicyButton;