"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import db from "@/app/utilities/firebase/firestore";
import { validatePassword } from "@/app/utilities/passwordValidation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, User2 } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAccount: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPasswords, setShowPasswords] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);
  const handleShowPasswordsToggle = () => setShowPasswords(!showPasswords);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Create a new user document in Firestore
      const newUserDocRef = doc(db, "users", username);
      await setDoc(newUserDocRef, {
        username,
        password,
        role: "staff",
      });

      setUsername("");
      setPassword("");
      setConfirmPassword("");

      toast.success("Account created successfully!", {
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to clear the error message after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer); // Clean up the timer on component unmount or error change
    }
  }, [error]);

  return (
    <div className="max-w-md mx-auto">
      {/* ToastContainer for toast notifications */}
      <ToastContainer position="top-left" />
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="w-full flex justify-between items-center text-black_">
              <User2 className="mb-2" size={40} />

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="rounded flex items-center"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Back
              </Button>
            </div>
            <span className="text-black_ text-xl">Add Account</span>
          </CardTitle>
          <CardDescription>
            Create a new staff account. You'll need to provide a username and password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mb-3">
            <div className="space-y-1 text-black_">
              <Label htmlFor="username">
                Username
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                className="rounded"
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter new username"
                required
              />
            </div>

            <div className="space-y-1 text-black_">
              <Label htmlFor="password">
                Password
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                className="rounded"
                type={showPasswords ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-1 text-black_">
              <Label htmlFor="confirmPassword">
                Confirm Password
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                className="rounded"
                type={showPasswords ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                className="rounded"
                id="showPasswords"
                checked={showPasswords}
                onCheckedChange={handleShowPasswordsToggle}
              />
              <Label htmlFor="showPasswords" className="font-normal">
                Show passwords
              </Label>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded">
                <AlertDescription className="flex items-center">
                  <ExclamationTriangleIcon
                    className="w-4 h-4 mr-1.5"
                    color="red"
                  />
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full rounded"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddAccount;