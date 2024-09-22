'use client';

import Image from "next/image";
import { quicksand, poppins } from "../utilities/fonts";
import Link from "next/link";

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
                    <h1 className={`${poppins.className} text-6xl font-bold leading-tight drop-shadow-2xl`}>PLP's Enrollment <br /> Insights Dashboard</h1>
                </div>
                
                <p className={`${quicksand.className} text-left mb-16 drop-shadow-xl`}>Gain actionable insights to inform decisions and <br /> shape the future of education at Pamantasan ng <br /> Lungsod ng Pasig.</p>

                <div className="button w-40 h-12 bg-[#c6dec8] cursor-pointer select-none active:translate-y-2 active:[box-shadow:0_0px_0_0_#B7B597] active:border-b-[0px] 
                transition-all duration-150 [box-shadow:0_10px_0_0_#7c8b6f,0_15px_0_0_#94a684] rounded-full border [5px] border-[#a3ddaa] drop-shadow-xl ease-in-out
                
                text-red hover:before:bg-redborder-red-500 relative overflow-hidden px-3 shadow-2xl before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#E4E4D0] before:transition-all before:duration-500 hover:text-white hover:before:left-0 hover:before:w-full">
                    <Link className={`${quicksand.className} flex justify-center items-center h-full text-[#444444] text-sm font-bold relative z-10`} href={"/login"}>
                    <Image 
                        className="mr-2"
                        src="/SVGs/material-symbols_login.svg"
                        alt="Login Icon"
                        width={25}
                        height={25}
                    />
                    Get Started
                    </Link>
                </div>
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
}
 
export default LandingPage;