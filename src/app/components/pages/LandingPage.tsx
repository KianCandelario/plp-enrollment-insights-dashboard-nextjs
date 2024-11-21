"use client";

import Image from "next/image";
import { quicksand, poppins } from "../../utilities/fonts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const LandingPage = () => {
  return (
    <div className="relative w-full flex items-center justify-start">
      <div className="w-[60%] flex flex-col justify-center items-start text-white_ px-10 py-7 z-50">
        <div className="flex flex-col justify-center mb-5">
          <Image
            className="mb-7 drop-shadow-2xl"
            src="/images/plp_logo.png"
            alt="PLP Logo"
            width={170}
            height={170}
          />
          <h1
            className={`${poppins.className} text-5xl font-bold leading-tight drop-shadow-2xl`}
          >
            PLP's Students' <br /> Ecological Profile <br /> Dashboard
          </h1>
        </div>

        <p className={`${quicksand.className} text-left mb-16 drop-shadow-xl`}>
          Gain actionable insights to inform decisions and shape <br /> the
          future of education at Pamantasan ng <br /> Lungsod ng Pasig.
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-[#94a684] rounded h-12 w-36 font-semibold">
                <Link
                  className={`${quicksand.className} flex justify-center items-center h-full text-sm relative z-10`}
                  href={"/login"}
                >
                  <LogInIcon 
                    width={18}
                    height={18}
                    className="mr-2.5"
                  />
                  Get Started
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded mb-1">
              <p className={`${quicksand.className}`}>Go to Login page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="absolute left-1/2">
        <Image
          className="drop-shadow-2xl hover:rotate-12 hover:scale-110 transition-all duration-200 ease-in-out"
          src="/images/laptop.png"
          alt="Dashboard"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
};

export default LandingPage;
