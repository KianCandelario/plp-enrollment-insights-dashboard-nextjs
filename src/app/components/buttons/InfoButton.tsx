import { Button } from "@/components/ui/button";
import { InfoIcon, Download, UserPlus, History, FileDown, ShieldCheck, FileSpreadsheet, UploadCloud, Edit } from "lucide-react";
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
                    {/* Sample Files Section */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <FileSpreadsheet size={20} className="mr-2" />
                            <span className="text-xl font-bold">Sample files</span>
                        </div>
                        <p className="text-sm">Use the following files for testing or as a reference:</p>

                        <div className="w-full space-y-4 mt-4">
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
                                <p className="text-xs text-gray-600 ml-1">Sample file for Applicant-to-Enrollee correlation format</p>
                            </div>

                            <div className="flex flex-col space-y-1 p-3 bg-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">students_ecological_profile_sample.csv</span>
                                    <Button 
                                        className="rounded"
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            const fileUrl = '/sample-files/students_ecological_profile_sample.csv';
                                            const link = document.createElement('a');
                                            link.href = fileUrl;
                                            link.download = 'students_ecological_profile_sample.csv';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-600 ml-1">Sample file for Students' Ecological Profile format</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    {/* Existing File Preparation Section */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <UploadCloud size={20} className="mr-2" />
                            <span className="text-xl font-bold">Preparing and Uploading Your File</span>
                        </div>
                        <p className="ml-2 my-2 text-sm">
                            Our system requires specific file formats and field names for accurate processing. Please ensure your files match the required formats below:
                        </p>
                        <div className="bg-gray-100 p-3 rounded">
                            <div>
                                <span className="text-md font-semibold">Applicant-to-Enrollee Correlation File</span>
                                <p className="ml-2 my-2 text-sm">
                                    <strong>Required Columns:</strong> <code>academic_year</code>, <code>course</code>, <code>applicant_count</code>, <code>enrollee_count</code>
                                    <br />
                                    <br />
                                    <strong>Note:</strong> 
                                    These columns are case-sensitive, so make sure they are formatted exactly as shown. Additionally, it's recommended to limit the range to four or five years to preserve the chart's readability.
                                </p>
                            </div>
                            <div>
                                <span className="text-md font-semibold">Students' Ecological Profile File</span>
                                <p className="ml-2 my-2 text-sm">
                                    <strong>Required Columns:</strong> <code>email</code>, <code>sex</code>, <code>isLGBTQIA</code>, <code>age</code>, <code>civilStatus</code>, <code>isPasigueno</code>, <code>yearsInPasig</code>, <code>barangay</code>, <code>familyMonthlyIncome</code>, <code>religion</code>, <code>curricularProgram</code>, <code>academicStatus</code>, <code>workingStudent</code>, <code>deansLister</code>, <code>presidentsLister</code>, <code>feederSchool</code>, <code>strandInSHS</code>, <code>isPWD</code>
                                    <br />
                                    <br />
                                    <strong>Note:</strong> Column names are case-sensitive and must match precisely.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    {/* Upload Process Section */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <UploadCloud size={20} className="mr-2" />
                            <span className="text-xl font-semibold">Upload Process and Visualization</span>
                        </div>
                        <p className="ml-2 my-2 text-sm">
                            Before uploading a new file or updating visualizations, always press the <strong>"reset visualization"</strong> button. This ensures previous data is cleared, preventing any conflicts.
                        </p>
                        <p className="ml-2 my-2 text-sm">
                            Once a file is uploaded or visualizations has been cleared, a <strong>toaster notification</strong> will appear on the screen. <strong>Please wait for this notification to complete</strong> before performing additional actions or uploading another file. This step is crucial to avoid any processing errors.
                        </p>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    {/* Adding Account Section */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <UserPlus size={20} className="mr-2" />
                            <span className="text-xl font-semibold">Adding Account</span>
                        </div>
                        <div className="ml-2 my-2 text-sm space-y-2">
                            <p>To create a new account:</p>
                            <ol className="list-decimal list-inside">
                                <li>Navigate to the sidebar and hover over the admin section</li>
                                <li>Click on the "Add Account"</li>
                                <li>Fill in the required fields:
                                    <ul className="list-disc list-inside ml-4">
                                        <li>Username (must be unique)</li>
                                        <li>Password (must meet complexity requirements)</li>
                                        <li>Confirm Password</li>
                                    </ul>
                                </li>
                                <li>The created account will be assigned as a staff</li>
                            </ol>
                        </div>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    {/* Login History Section */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <History size={20} className="mr-2" />
                            <span className="text-xl font-semibold">Login History</span>
                        </div>
                        <div className="ml-2 my-2 text-sm space-y-2">
                            <p>To access and monitor your login history:</p>
                            <ol className="list-decimal list-inside">
                                <li>Navigate to the sidebar and hover over the admin section</li>
                                <li>Click the "Login History"</li>
                                <li>View details such as:
                                    <ul className="list-disc list-inside ml-4">
                                        <li>Username</li>
                                        <li>Status</li>
                                        <li>Details</li>
                                        <li>Timestamp</li>
                                    </ul>
                                </li>
                            </ol>
                            <p className="text-xs text-gray-600">Tip: Regularly check your login history to detect any unauthorized access. You can also export to PDF by clicking the "Export PDF" button.</p>
                        </div>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    {/* Exporting Reports Section */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <FileDown size={20} className="mr-2" />
                            <span className="text-xl font-semibold">Exporting Reports</span>
                        </div>
                        <div className="ml-2 my-2 text-sm space-y-2">
                            <p>To export reports as PDF:</p>
                            <ol className="list-decimal list-inside">
                                <li>Simply look for the "Export PDF" button</li>
                                <li>Click the button</li>
                            </ol>
                            <p className="text-xs text-gray-600">Note: Exported PDFs maintain the visual formatting of the original dashboard.</p>
                        </div>
                    </div>

                    <Separator className="my-5 w-[80%]" />

                    {/* DPA Policy Section */}
                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <ShieldCheck size={20} className="mr-2" />
                            <span className="text-xl font-semibold">Data Privacy Act (DPA) Policy</span>
                        </div>
                        <div className="ml-2 my-2 text-sm space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Navigate to the sidebar and hover over the admin section</li>
                                <li>Look for "DPA Policy"</li>
                                <li>Read the contents</li>
                            </ul>
                            <p className="text-xs text-gray-600">
                                Compliance with Republic Act No. 10173 (Data Privacy Act of 2012) is our top priority.
                            </p>
                        </div>
                    </div>

                    {/* Existing Account Information Section */}
                    <Separator className="my-5 w-[80%]" />

                    <div className="w-full max-w-lg">
                        <div className="flex items-center">
                            <Edit size={20} className="mr-2" />
                            <span className="text-xl font-semibold">Editing Account Information</span>
                        </div>
                        <p className="ml-2 my-2 text-sm">
                            To change the <strong>username</strong> or <strong>password</strong> of an existing account, hover over the <strong>Admin area</strong> located on the sidebar, and click the "Edit Account".
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