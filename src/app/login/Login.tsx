// Login.tsx
"use client";

import Image from "next/image";
import { LockIcon } from "lucide-react";
import { poppins, quicksand } from "../utilities/fonts";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { LogInError } from "@/app/components/alert/LogInError";
import { trackLoginAttempt, checkLoginAttempts } from "@/app/utilities/loginAttempts";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // Check login attempts when username changes
  useEffect(() => {
    const checkAttempts = async () => {
      if (username) {
        const attemptStatus = await checkLoginAttempts(username);
        
        if (attemptStatus.isLocked) {
          setErrorMessage(`Account is locked. Try again in ${attemptStatus.lockTimeRemaining} seconds.`);
          setLockTimeRemaining(attemptStatus.lockTimeRemaining || 0);
        } else {
          setRemainingAttempts(attemptStatus.remainingAttempts || 3);
          setLockTimeRemaining(0);
        }
      }
    };

    checkAttempts();
  }, [username]);

  // Countdown timer for locked account
  useEffect(() => {
    if (lockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setLockTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setErrorMessage('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockTimeRemaining]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Check if account is locked
    if (lockTimeRemaining > 0) {
      setErrorMessage(`Account is locked. Try again in ${lockTimeRemaining} seconds.`);
      setLoading(false);
      return;
    }

    try {
      // Attempt to sign in
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      // Track login attempt
      const loginAttemptResult = await trackLoginAttempt(username, !!result?.ok);

      if (!result?.ok) {
        // Login failed
        if (loginAttemptResult.isLocked) {
          // Account is now locked
          setErrorMessage(`Too many failed attempts. Account locked for ${loginAttemptResult.lockTimeRemaining} seconds.`);
          setLockTimeRemaining(loginAttemptResult.lockTimeRemaining || 0);
        } else {
          // Show remaining attempts
          setErrorMessage(`Invalid username or password. ${loginAttemptResult.remainingAttempts} attempt(s) remaining.`);
        }
        setLoading(false);

        // Automatically hide the error message after 4 seconds
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      } else {
        // Successful login
        // Store username and determine role
        localStorage.setItem('userUsername', username);
        localStorage.setItem('userRole', username === 'plp_admin' ? 'admin' : 'staff');
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setErrorMessage("An error occurred during login.");
      setLoading(false);
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
        <h1 className={`${poppins.className} font-bold text-2xl`}>
          PLP Student Success Office
        </h1>

        <div className="w-[80%] mt-5 ">
          {/* Enhanced Lockout Countdown Display */}
          {lockTimeRemaining > 0 && (
            <div className="mb-4 flex items-center justify-center">
              <div className={`bg-red-100 text-red-700 px-4 py-2 rounded flex items-center animate-pulse ${quicksand.className} text-sm`}>
                <LockIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">
                  Account Locked: {Math.floor(lockTimeRemaining / 60)}m {lockTimeRemaining % 60}s remaining
                </span>
              </div>
            </div>
          )}

          {/* Display error message */}
          {errorMessage && !lockTimeRemaining && (
            <div className="mb-2 -mt-2">
              <LogInError errorMessage={errorMessage} />
            </div>
          )}

          <form
            className="flex flex-col gap-5 items-center"
            onSubmit={handleSubmit}
          >
            <div
              className={`${quicksand.className} w-full text-sm flex flex-col gap-1`}
            >
              <label htmlFor="username" className="font-semibold text-xs">
                Username
              </label>
              <input
                className="px-3 py-2 rounded"
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div
              className={`${quicksand.className} flex flex-col gap-1 w-full mb-4`}
            >
              <label className="text-xs font-semibold" htmlFor="password">
                Password
              </label>
              <input
                className="px-3 py-2 text-sm rounded"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-xs flex items-center mt-2 ml-1">
                <input
                  type="checkbox"
                  name="show-password"
                  id="show-password"
                  onChange={togglePasswordVisibility}
                  checked={showPassword}
                />
                <span className="ml-1">Show password</span>
              </div>
            </div>

            {/* Button text changes to "Signing in..." and animates when loading */}
            <input
              className={`${
                quicksand.className
              } text-sm gradient-bg w-[45%] h-10 rounded text-[#EBEBEB] font-semibold cursor-pointer drop-shadow-md hover:drop-shadow-xl transition-all ${
                loading ? "button-shake" : ""
              }`}
              type="submit"
              value={loading ? "Signing in..." : "Log In"}
              disabled={loading || lockTimeRemaining > 0}
            />
          </form>
        </div>
      </div>
      <div className="h-full w-[60%] bg-[#394033] flex flex-col gap-10 justify-center items-center rounded-2xl rounded-es-3xl rounded-ss-3xl p-5">
        <div className="relative bg-[#EBEBEB] h-[55%] w-[55%] p-4 rounded-full">
          <Image
            className="relative top-3 drop-shadow-2xl"
            src="/images/dashboard.png"
            alt="Back to School"
            width={400}
            height={400}
          />
        </div>
        <div className="text-white_ flex flex-col justify-center items-center gap-4">
          <h1 className={`${poppins.className} text-3xl font-bold`}>
            Log In your account
          </h1>
          <p
            className={`${quicksand.className} text-xs text-center leading-4 text-gray-200`}
          >
            Start exploring PLP's Students' Ecological Profile Dashboard. <br />{" "}
            Dive deep into students' data, uncovering trends and patterns <br />{" "}
            that provide actionable insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;