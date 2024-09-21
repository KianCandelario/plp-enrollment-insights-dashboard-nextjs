'use client';

import Image from 'next/image';
import { poppins, quicksand } from '../utilities/fonts';
import { useState } from 'react';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return ( 
        <div className="flex w-[70%] h-[70%] justify-center items-center bg-[#EBEBEB] rounded-2xl drop-shadow-2xl">
            <div className="w-[40%] flex flex-col gap-5 justify-center items-center">
                <Image 
                    src="/images/plp_logo.png"
                    alt="PLP Logo"
                    width={150}
                    height={150}
                />
                <h1 className={`${poppins.className} font-bold text-2xl`}>PLP Admission Office</h1>
                <div className='w-[75%] mt-5'>
                    <form className='flex flex-col gap-7 items-center' action="" method="get">
                        <div className={`${quicksand.className} flex flex-col gap-1 w-full`}>
                            <label className="text-xs font-semibold" htmlFor="password">Password</label>
                            <input className='px-3 py-2 text-sm rounded-md' 
                                id="password" 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder='Enter password' />
                            <div className='text-xs flex items-center mt-2 ml-1'>
                                <input type="checkbox" 
                                name="show-password" 
                                id="show-password"
                                onChange={togglePasswordVisibility}
                                checked={showPassword} />
                                <span className='ml-1'>Show password</span>
                            </div>
                        </div>
                        <input className={`${quicksand.className} text-sm gradient-bg w-[40%] h-10 rounded-lg text-[#EBEBEB] font-semibold cursor-pointer drop-shadow-md hover:drop-shadow-xl hover:-translate-y-1 transition-all `} type="submit" value="Log In" />
                    </form>
                </div>
            </div>
            <div className="h-full w-[60%] bg-[#394033] flex justify-center items-center rounded-2xl">
                <Image 
                    className="drop-shadow-2xl hover:rotate-12 hover:scale-110 transition-all duration-200 ease-in-out"
                    src="/images/back_to_school.png"
                    alt="Back to School"
                    width={400}
                    height={400}
                />
            </div>
        </div>
    );
}
 
export default Login;