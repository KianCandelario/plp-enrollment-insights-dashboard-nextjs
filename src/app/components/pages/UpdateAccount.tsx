"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import db from '@/app/utilities/firebase/firestore';
import { validatePassword } from '@/app/utilities/passwordValidation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, User2 } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateAccount: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', 'usersID');
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || '');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleCurrentPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);
  const handleConfirmNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmNewPassword(e.target.value);
  const handleShowPasswordsToggle = () => setShowPasswords(!showPasswords);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate new password if it's being changed
    if (newPassword) {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error);
        return;
      }
    }
    
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const userDocRef = doc(db, 'users', 'usersID');
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        setError('User not found');
        return;
      }

      const userData = userDoc.data();
      
      if (userData.password !== currentPassword) {
        setError('Current password is incorrect');
        return;
      }

      const updates: { username?: string; password?: string } = {};
      
      if (username !== userData.username) {
        updates.username = username;
      }
      
      if (newPassword) {
        updates.password = newPassword;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(userDocRef, updates);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        
        toast.success("Account details updated successfully!", { autoClose: 3000 });
      } else {
        setError('No changes to update');
      }

    } catch (err) {
      console.error('Error updating account:', err);
      setError('Failed to update account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to clear the error message after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
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
            <div className='w-full flex justify-between items-center text-black_'>
              <User2 className='mb-2' size={40} />

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
            <span className='text-black_ text-xl'>Edit Account</span>
          </CardTitle>
          <CardDescription>
            Update your account settings. You'll need your current password to make changes.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mb-3">
            <div className="space-y-1 text-black_">
              <Label htmlFor="username">
                Username <span className='text-gray-500 italic font-normal text-xs'>(enter your username/desired username)</span>
                <span className='text-red-500 ml-0.5'>*</span>
              </Label>
              <Input
                className='rounded'
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter new username"
              />
            </div>
            
            <div className="space-y-1 text-black_">
              <Label htmlFor="currentPassword">
                Current Password
                <span className='text-red-500 ml-0.5'>*</span>
              </Label>
              <Input
                className='rounded'
                type={showPasswords ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                required
                placeholder="Enter current password"
              />
            </div>
            
            <div className="space-y-1 text-black_">
              <Label htmlFor="newPassword">
                New Password
                <span className='text-red-500 ml-0.5'>*</span>
              </Label>
              <Input
                className='rounded'
                type={showPasswords ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-1 text-black_">
              <Label htmlFor="confirmNewPassword">
                Confirm New Password
                <span className='text-red-500 ml-0.5'>*</span>
              </Label>
              <Input
                className='rounded'
                type={showPasswords ? 'text' : 'password'}
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
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
              <Alert variant="destructive" className='rounded'>
                <AlertDescription className='flex items-center'>
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1.5" color="red" />
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
                  Updating...
                </>
              ) : (
                'Update Account'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UpdateAccount;