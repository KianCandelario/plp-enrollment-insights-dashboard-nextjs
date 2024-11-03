import { Button } from "@/components/ui/button";
import { UploadIcon } from "@radix-ui/react-icons";
import { XCircle, CheckCircle, Upload, Trash2 } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileState {
    [key: string]: File | null;
}

interface ErrorState {
    [key: string]: string;
}

export function UploadFile() {
    const [files, setFiles] = useState<FileState>({
        'Applicant-to-Enrollee Correlation': null,
        'Number of Enrollment per Curricular Program': null,
        'Applicant Origins': null,
        'Demographics Summary': null,
        'Socio-Economic Background': null
    });
    
    const [errors, setErrors] = useState<ErrorState>({});
    
    const handleFileChange = (category: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (file) {
            if (!file.name.endsWith('.csv')) {
                setErrors({
                    ...errors,
                    [category]: 'Please upload a CSV file'
                });
                event.target.value = ''; // Reset input
                return;
            }
            
            const newErrors = { ...errors };
            delete newErrors[category];
            setErrors(newErrors);
            
            setFiles({
                ...files,
                [category]: file
            });
        }
    };

    const handleRemoveFile = (category: string) => {
        const newFiles = { ...files };
        newFiles[category] = null;
        setFiles(newFiles);

        // Clear any errors for this category
        const newErrors = { ...errors };
        delete newErrors[category];
        setErrors(newErrors);
    };
    
    const isAllFilesUploaded = (): boolean => {
        return Object.values(files).every(file => file !== null) && Object.keys(errors).length === 0;
    };
    
    const handleSubmit = () => {
        if (isAllFilesUploaded()) {
            console.log('Files ready for submission:', files);
        }
    };
    
    // Split visualizations into two rows
    const visualizations = Object.keys(files);
    const firstRow = visualizations.slice(0, 3);
    const secondRow = visualizations.slice(3);
    
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button size="sm" className="rounded w-full">
                    <UploadIcon className="h-3 w-3 mr-1" /> Upload File
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[77vh]">
                <div className="mx-auto w-full max-w-5xl">
                    <DrawerHeader>
                        <DrawerTitle>Upload the CSV Files</DrawerTitle>
                        <DrawerDescription>Provide all required documents to be able to submit.</DrawerDescription>
                    </DrawerHeader>
                    
                    <div className="p-4">
                        {/* First row - 3 items */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {firstRow.map((viz) => (
                                <div key={viz} className="space-y-2">
                                    <div className="flex items-center min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate pr-2">
                                                {viz} <span className="text-red-500">*</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {files[viz] && !errors[viz] && (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <button
                                                        onClick={() => handleRemoveFile(viz)}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                        title="Remove file"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </button>
                                                </>
                                            )}
                                            {errors[viz] && (
                                                <>
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    <button
                                                        onClick={() => handleRemoveFile(viz)}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                        title="Remove file"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <label 
                                            className={cn(
                                                "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed cursor-pointer transition-colors rounded",
                                                errors[viz] ? "border-red-400 bg-red-50 hover:bg-red-100" : 
                                                files[viz] ? "border-green-400 bg-green-50 hover:bg-green-100" :
                                                "bg-gray-50 hover:bg-gray-100"
                                            )}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-4 pb-4 w-full max-w-[90%]">
                                                <Upload className={cn(
                                                    "h-5 w-5 mb-2",
                                                    errors[viz] ? "text-red-500" : 
                                                    files[viz] ? "text-green-500" : 
                                                    "text-gray-500"
                                                )} />
                                                <p className="text-sm text-gray-500 truncate w-full text-center overflow-hidden">
                                                    {files[viz]?.name || <span className="font-semibold">Click to upload</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">CSV files only</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept=".csv"
                                                onChange={(e) => handleFileChange(viz, e)}
                                            />
                                        </label>
                                        {errors[viz] && (
                                            <p className="text-xs text-red-500 mt-1">{errors[viz]}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Second row - 2 items */}
                        <div className="grid grid-cols-2 gap-4">
                            {secondRow.map((viz) => (
                                <div key={viz} className="space-y-2">
                                    <div className="flex items-center min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate pr-2">
                                                {viz} <span className="text-red-500">*</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {files[viz] && !errors[viz] && (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <button
                                                        onClick={() => handleRemoveFile(viz)}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                        title="Remove file"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </button>
                                                </>
                                            )}
                                            {errors[viz] && (
                                                <>
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    <button
                                                        onClick={() => handleRemoveFile(viz)}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                        title="Remove file"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <label 
                                            className={cn(
                                                "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed cursor-pointer transition-colors rounded",
                                                errors[viz] ? "border-red-400 bg-red-50 hover:bg-red-100" : 
                                                files[viz] ? "border-green-400 bg-green-50 hover:bg-green-100" :
                                                "bg-gray-50 hover:bg-gray-100"
                                            )}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-4 pb-4 w-full max-w-[90%]">
                                                <Upload className={cn(
                                                    "h-5 w-5 mb-2",
                                                    errors[viz] ? "text-red-500" : 
                                                    files[viz] ? "text-green-500" : 
                                                    "text-gray-500"
                                                )} />
                                                <p className="text-sm text-gray-500 truncate w-full text-center overflow-hidden">
                                                    {files[viz]?.name || <span className="font-semibold">Click to upload</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">CSV files only</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept=".csv"
                                                onChange={(e) => handleFileChange(viz, e)}
                                            />
                                        </label>
                                        {errors[viz] && (
                                            <p className="text-xs text-red-500 mt-1">{errors[viz]}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <DrawerFooter className="w-full">
                        <Button 
                            className="rounded"
                            disabled={!isAllFilesUploaded()}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                        <DrawerClose asChild>
                            <Button className="rounded" variant="outline">
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}