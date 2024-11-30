// components/Dashboard.tsx

import { poppins, quicksand } from "@/app/utilities/fonts";
import { YearlyTrend } from "../charts/enrollments/YearlyTrend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApplicantEnrolleeCorrelation } from "../charts/enrollments/ApplicantEnrolleeCorrelation";
import { AcademicProgramEnrollment } from "../charts/enrollments/AcademicProgramEnrollment";
import { Residency } from "../charts/applicant-origins/Residency";
import { PasigResidentStudents } from "../charts/applicant-origins/PasigResidentStudents";
import { NonPasigResidentStudents } from "../charts/applicant-origins/NonPasigResidentStudents";
import { Gender } from "../charts/demographics/Gender";
import { Age } from "../charts/demographics/Age";
import { FamilyMonthlyIncome } from "../charts/socio-economic-background/FamilyMonthlyIncome";
import { FeederSchools } from "../charts/socio-economic-background/FeederSchools";
import { CivilStatusAndReligion } from "../charts/tables/CivilStatusAndReligion";
import ResetVisualization from "../buttons/ResetVisualization";
import { StrandInSHS } from "../charts/enrollments/StrandInSHS";
import { AcademicStatus } from "../charts/enrollments/AcademicStatus";
import { WorkingStudent } from "../charts/enrollments/WorkingStudent";
import { YearsOfResidency } from "../charts/applicant-origins/YearsOfResidency";
import { IsLGBTQIA } from "../charts/demographics/IsLGBTQIA";
import { IsPWD } from "../charts/demographics/IsPWD";
import { DeansLister } from "../charts/academic-achievements/DeansLister";
import { PresidentsLister } from "../charts/academic-achievements/PresidentsLister";
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface DashboardProps {
  selectedCollege: string;
}

const Dashboard = ({ selectedCollege }: DashboardProps) => {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;

    // Disable buttons during export
    const resetButton = document.querySelector('button[aria-label="Reset Visualization"]');
    const exportButton = document.querySelector('button[aria-label="Export PDF"]');
    
    if (resetButton) (resetButton as HTMLButtonElement).disabled = true;
    if (exportButton) (exportButton as HTMLButtonElement).disabled = true;

    try {
      // Capture the entire dashboard
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2, // Increases resolution
        useCORS: true, // Helps with rendering external images
        logging: false, // Disable logging
        allowTaint: true, // Allows rendering of images from other domains
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      // Save PDF
      pdf.save(`PLP_Students_Ecological_Profile_${selectedCollege || 'All_Colleges'}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      // Re-enable buttons
      if (resetButton) (resetButton as HTMLButtonElement).disabled = false;
      if (exportButton) (exportButton as HTMLButtonElement).disabled = false;
    }
  };

  return (
    <div ref={dashboardRef} className="z-10 flex flex-col p-10 space-y-5 bg-gray-50">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className={`${poppins.className} text-3xl font-bold`}>
              PLP Students' Ecological Profile Insights & Forecasting
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                aria-label="Export PDF"
                onClick={handleExportPDF}
                className="flex items-center gap-2 rounded"
              >
                <Download size={13} /> Export PDF
              </Button>
              <ResetVisualization />
            </div>
          </CardTitle>
          <CardDescription>
            <span className={`${quicksand.className} `}>
              Data-Driven Decision Support for Planning and Resource Allocation
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="font-bold">Selected College:</span> {selectedCollege}
        </CardContent>
      </Card>

      {/* Rest of the dashboard remains the same */}
      <div className="flex flex-col gap-7">
        {/* Enrollments */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>
              Enrollment Overview
            </h1>
          </div>
          <div>
            <YearlyTrend courseCode={selectedCollege || "GRAND_TOTAL"} />
          </div>
          <div className="flex gap-3">
            <ApplicantEnrolleeCorrelation course={selectedCollege} />
            <div className="flex-1">
              <AcademicProgramEnrollment selectedCollege={selectedCollege} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-[40%]">
              <StrandInSHS selectedCollege={selectedCollege} />
            </div>
            <div className="flex gap-3 w-[60%]">
              <div className="w-1/2">
                <AcademicStatus selectedCollege={selectedCollege} />
              </div>
              <div className="w-1/2">
                <WorkingStudent selectedCollege={selectedCollege} />
              </div>
            </div>
          </div>
        </div>

        {/* Applicant Origins */}
        <div className="w-full flex flex-col gap-3">
          <div>
            <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>
              Applicant Origins
            </h1>
          </div>

          <div className="flex gap-3 w-full">
            <div className="flex w-[30%]">
              <Residency selectedCollege={selectedCollege} />
            </div>
            <div className="flex-1">
              <YearsOfResidency selectedCollege={selectedCollege} />
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <div className="flex w-1/2">
              <PasigResidentStudents selectedCollege={selectedCollege} />
            </div>
            <div className="flex w-1/2">
              <NonPasigResidentStudents selectedCollege={selectedCollege} />
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>
              Demographics Summary
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex w-full gap-3">
              <div className="w-1/3">
                <Gender selectedCollege={selectedCollege} />
              </div>
              <div className="w-1/3">
                <IsLGBTQIA selectedCollege={selectedCollege} />
              </div>
              <div className="w-1/3">
                <IsPWD selectedCollege={selectedCollege} />
              </div>
            </div>
            <div className="flex flex-1 gap-3 w-full">
              <div className="w-[40%] h-[617px]">
                <Age selectedCollege={selectedCollege} />
              </div>
              <div className="w-[60%]">
                <CivilStatusAndReligion selectedCollege={selectedCollege} />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Achievements */}
        <div className="flex-col">
          <div className="mb-2">
            <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>
              Academic Achievements
            </h1>
          </div>
          <div className="flex w-full gap-3">
            <div className="w-1/2">
              <DeansLister selectedCollege={selectedCollege} />
            </div>
            <div className="w-1/2">
              <PresidentsLister selectedCollege={selectedCollege} />
            </div>
          </div>
        </div>

        {/* Socio-Economic Background */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>
              Socio-Economic Background
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="w-[63%]">
              <FamilyMonthlyIncome selectedCollege={selectedCollege} />
            </div>
            <div className="w-[37%]">
              <FeederSchools selectedCollege={selectedCollege} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;