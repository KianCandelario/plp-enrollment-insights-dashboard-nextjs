'use client';

import Image from 'next/image';
import { poppins, quicksand } from '../utilities/fonts';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the form from refreshing the page
        
        // Call signIn with username and password
        const result = await signIn('credentials', {
            redirect: true,
            username,
            password,
            callbackUrl: '/dashboard',
        });

        if (!result?.ok) {
            window.Error('SignIn failed');
        }
    };

    return ( 
        <div className="flex w-[70%] h-[80%] justify-center items-center bg-[#EBEBEB] rounded-2xl drop-shadow-2xl">
            <div className="w-[40%] flex flex-col gap-5 justify-center items-center text-black_">
                <Image 
                    src="/images/plp_logo.png"
                    alt="PLP Logo"
                    width={150}
                    height={150}
                />
                <h1 className={`${poppins.className} font-bold text-2xl`}>PLP Admission Office</h1>
                <div className='w-[75%] mt-5'>
                    <form className='flex flex-col gap-5 items-center' onSubmit={handleSubmit}>
                        <div className={`${quicksand.className} w-full text-sm flex flex-col gap-1`}>
                            <label 
                            htmlFor="username" 
                            className='font-semibold text-xs'>Username</label>
                            <input 
                                className='px-3 py-2' 
                                type="text" 
                                name="username" 
                                id="username" 
                                placeholder='Enter username' 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                            
                        </div>

                        <div className={`${quicksand.className} flex flex-col gap-1 w-full mb-4`}>
                            <label className="text-xs font-semibold" htmlFor="password">Password</label>
                            <input className='px-3 py-2 text-sm rounded-md' 
                                id="password" 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
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
            <div className="h-full w-[60%] bg-[#394033] flex flex-col gap-10 justify-center items-center rounded-2xl rounded-es-3xl rounded-ss-3xl p-5">
                <div className='relative bg-[#EBEBEB] h-[55%] w-[55%] p-4 rounded-full'>
                    <Image 
                        className="relative top-3 drop-shadow-2xl"
                        src="/images/dashboard.png"
                        alt="Back to School"
                        width={400}
                        height={400}
                    />
                </div>
                <div className='text-white_ flex flex-col justify-center items-center gap-4'>
                    <h1 className={`${poppins.className} text-3xl font-bold`}>Log In your account</h1>
                    <p className={`${quicksand.className} text-xs text-center leading-4 text-gray-200`}>
                        Start exploring PLP's Enrollment Insights Dashboard. <br /> Dive deep into student enrollment data, uncovering trends and patterns <br /> that provide actionable insights.
                    </p>
                </div>
            </div>
        </div>
    );
}
 
export default Login;