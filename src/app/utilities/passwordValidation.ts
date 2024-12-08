export const validatePassword = (password: string): { isValid: boolean; error: string } => {
  // Check minimum password length (e.g., at least 8 characters)
  if (password.length < 8) {
    return { 
      isValid: false, 
      error: 'Password must be at least 8 characters long.' 
    };
  }

  // Optional: You can set a maximum length if desired
  if (password.length > 64) {
    return {
      isValid: false,
      error: 'Password must not exceed 64 characters.'
    };
  }

  // Check for at least one uppercase letter
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter.' 
    };
  }

  // Check for at least one lowercase letter
  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter.'
    };
  }

  // Check for at least one number
  const hasNumber = /[0-9]/.test(password);
  if (!hasNumber) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one number.' 
    };
  }

  // Check for special character
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character.'
    };
  }

  // If all checks pass
  return { 
    isValid: true, 
    error: '' 
  };
};