'use client';

import Image from 'next/image';
import { poppins, quicksand } from '../utilities/fonts';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { LogInError } from "@/app/components/alert/LogInError";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the form from refreshing the page
        
        // Reset the error message and set loading to true
        setErrorMessage('');
        setLoading(true);

        // Call signIn with username and password
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (!result?.ok) {
            // If login fails, show an error message
            setErrorMessage('Invalid username or password.');
            setLoading(false); // Stop loading on failure

            // Automatically hide the error message after 4 seconds
            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
        } else {
            window.location.href = '/dashboard';
        }
    };

    return ( 
        <div className="flex w-[950px] h-[595px] justify-center items-center bg-[#EBEBEB] rounded-2xl drop-shadow-2xl">
            <div className="w-[40%] flex flex-col gap-5 justify-center items-center text-black_">
                <Image 
                    src="/images/plp_logo.png"
                    alt="PLP Logo"
                    width={150}
                    height={150}
                />
                <h1 className={`${poppins.className} font-bold text-2xl`}>PLP Student Success Office</h1>

                <div className='w-[80%] mt-5'>
                    {/* Display error message */}
                    {errorMessage && (
                        <div className='mb-2 -mt-2'>
                            <LogInError errorMessage={errorMessage} />
                        </div>
                    )}
                    <form className='flex flex-col gap-5 items-center' onSubmit={handleSubmit}>
                        <div className={`${quicksand.className} w-full text-sm flex flex-col gap-1`}>
                            <label 
                            htmlFor="username" 
                            className='font-semibold text-xs'>Username</label>
                            <input 
                                className='px-3 py-2 rounded' 
                                type="text" 
                                name="username" 
                                id="username" 
                                placeholder='Enter username' 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required />
                        </div>

                        <div className={`${quicksand.className} flex flex-col gap-1 w-full mb-4`}>
                            <label className="text-xs font-semibold" htmlFor="password">Password</label>
                            <input 
                                className='px-3 py-2 text-sm rounded' 
                                id="password" 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                            <div className='text-xs flex items-center mt-2 ml-1'>
                                <input type="checkbox" 
                                name="show-password" 
                                id="show-password"
                                onChange={togglePasswordVisibility}
                                checked={showPassword} />
                                <span className='ml-1'>Show password</span>
                            </div>
                        </div>

                        {/* Button text changes to "Signing in..." and animates when loading */}
                        <input 
                            className={`${quicksand.className} text-sm gradient-bg w-[45%] h-10 rounded text-[#EBEBEB] font-semibold cursor-pointer drop-shadow-md hover:drop-shadow-xl transition-all ${loading ? 'button-shake' : ''}`} 
                            type="submit" 
                            value={loading ? "Signing in..." : "Log In"} 
                            disabled={loading} // Disable the button while loading
                        />
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
