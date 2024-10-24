import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface LogInErrorProps {
    errorMessage: string;
}

export function LogInError({errorMessage}: LogInErrorProps) {
  return (
    <Alert className="rounded">
      <ExclamationTriangleIcon className="w-4 h-4" color="red" />
      <AlertTitle className="text-red-500 text-sm">Log In Error!</AlertTitle>
      <AlertDescription className="text-xs text-red-300">
        {errorMessage}
      </AlertDescription>
    </Alert>
  )
}
