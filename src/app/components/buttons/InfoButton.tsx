import { Button } from "@/components/ui/button";
import { InfoIcon, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
 
export function InfoButton() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="rounded">
                    <InfoIcon size={14} className="mr-2" /> 
                    <span className="text-xs">Quick Guide</span>
                </Button>
            </SheetTrigger>

            <SheetContent className="h-dvh sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle className="flex items-center">
                        <InfoIcon size={20} className="mr-2" /> Quick Guide
                    </SheetTitle>
                    <SheetDescription>
                        An easy-to-follow guide for utilizing the dashboard features correctly and efficiently.
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-5" />

                <div className="h-[75%] overflow-y-scroll flex items-center flex-col">
                    <div className="w-full">
                        <span className="text-xl font-bold">Sample files</span>
                        <p className="text-sm">Use the following files for testing or as a reference:</p>
                    </div>

                    <div className="w-full max-w-lg p-4 space-y-4">
                        <div className="flex flex-col space-y-1 bg-gray-100 p-3">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">applicant_enrollee_sample.csv</span>
                                <Button 
                                    className="rounded"
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                        const fileUrl = '/sample-files/applicant_enrollee_sample.csv';
                                        const link = document.createElement('a');
                                        link.href = fileUrl;
                                        link.download = 'applicant_enrollee_sample.csv';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                            <p className="text-xs text-gray-600 ml-1">Sample file for Applicant-to-Enrollee correlation data</p>
                        </div>

                        <div className="flex flex-col space-y-1 p-3 bg-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">cleaned_data_sample.csv</span>
                                <Button 
                                    className="rounded"
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                        const fileUrl = '/sample-files/cleaned_data_sample.csv';
                                        const link = document.createElement('a');
                                        link.href = fileUrl;
                                        link.download = 'cleaned_data_sample.csv';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                            <p className="text-xs text-gray-600 ml-1">Sample file for Cleaned Data format</p>
                        </div>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    <div>
                        <span className="text-xl font-bold">Preparing and Uploading Your File</span>
                        <p className="ml-2 my-2 text-sm">
                            Our system requires specific file formats and field names for accurate processing. Please ensure your files match the required formats below:
                        </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded m-4">
                        <div>
                            <span className="text-md font-semibold">Applicant-to-Enrollee Correlation File</span>
                            <p className="ml-2 my-2 text-sm">
                                <strong>Required Columns:</strong> <code>academic_year</code>, <code>course</code>, <code>applicant_count</code>, <code>enrollee_count</code>
                                <br />
                                <strong>Note:</strong> These columns are case-sensitive. Ensure they appear exactly as shown.
                            </p>
                        </div>
                        <div>
                            <span className="text-md font-semibold">Cleaned Data CSV File</span>
                            <p className="ml-2 my-2 text-sm">
                                <strong>Required Columns:</strong> <code>studentID</code>, <code>gender</code>, <code>age</code>, <code>civilStatus</code>, <code>religion</code>, <code>course</code>, <code>barangay</code>, <code>familyMonthlyIncome</code>, <code>feederSchoolType</code>
                                <br />
                                <strong>Note:</strong> Column names are case-sensitive and must match precisely.
                            </p>
                        </div>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    <div>
                        <span className="text-xl font-semibold">Upload Process and Visualization</span>
                        <p className="ml-2 my-2 text-sm">
                            Before uploading a new file or updating visualizations, always press the <strong>"reset visualization"</strong> button. This ensures previous data is cleared, preventing any conflicts.
                        </p>
                        <p className="ml-2 my-2 text-sm">
                            Once a file is uploaded or visualizations has been cleared, a <strong>toaster notification</strong> will appear on the screen. <strong>Please wait for this notification to complete</strong> before performing additional actions or uploading another file. This step is crucial to avoid any processing errors.
                        </p>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    <div>
                        <span className="text-xl font-semibold">Editing Account Information</span>
                        <p className="ml-2 my-2 text-sm">
                            To change your <strong>username</strong> or <strong>password</strong>, click on the <strong>PLP-SSO</strong> area of the website located on the sidebar.
                        </p>
                    </div>
                </div>

                <SheetFooter className="mt-5">
                    <SheetClose asChild>
                        <Button variant="outline" className="rounded text-sm">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}