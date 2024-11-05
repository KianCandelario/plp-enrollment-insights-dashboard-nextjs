import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetVisualization = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleReset = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/applicant-enrollee', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success("The visualizations were cleared successfully! Reloading...", { autoClose: 3000 });
        setTimeout(() => {
          window.location.reload(); // Reload page after 3 seconds
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Failed to clear data: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('An error occurred while trying to clear data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-left" />
      <AlertDialog>
          <AlertDialogTrigger asChild>
              <div>
                  <Button
                      variant="destructive"
                      className="rounded"
                      size="sm"
                      disabled={isLoading}
                  >
                      <RotateCcwIcon size={13} className="mr-1" />
                      {isLoading ? "Resetting..." : "Reset Visualizations"}
                  </Button>
              </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action should only be done if you want to update the visualizations. This action <b>cannot be undone</b>.
                  </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                  <AlertDialogCancel className="rounded">
                      Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="rounded">
                      Continue
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ResetVisualization;