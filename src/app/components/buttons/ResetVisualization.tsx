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
      const endpoints = [
        '/api/applicant-enrollee',
        '/api/cleaned-data'
      ];

      const results = await Promise.allSettled(
        endpoints.map(endpoint =>
          fetch(endpoint, { method: 'DELETE' })
        )
      );

      // Check if any requests failed
      const failedRequests = results.filter(
        result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.ok)
      );

      if (failedRequests.length === 0) {
        toast.success("The visualizations were cleared successfully! Reloading...", {
          autoClose: 3000
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        // Handle partial or complete failure
        const errorMessages = results.map((result, index) => {
          if (result.status === 'rejected') {
            return `${endpoints[index]}: Request failed`;
          } else if (result.status === 'fulfilled' && !result.value.ok) {
            return `${endpoints[index]}: ${result.value.statusText}`;
          }
          return null;
        }).filter(Boolean);

        toast.error(
          `Failed to clear some data:\n${errorMessages.join('\n')}`, 
          { autoClose: 5000 }
        );
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error(
        'An unexpected error occurred while trying to clear data.', 
        { autoClose: 5000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
              This action will clear all visualization data from multiple sources. 
              This action <b>cannot be undone</b> and should only be performed 
              when you need to completely refresh the visualization data.
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