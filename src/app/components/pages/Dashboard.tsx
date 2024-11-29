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

interface DashboardProps {
  selectedCollege: string;
}

const Dashboard = ({ selectedCollege }: DashboardProps) => {
  return (
    <div className="z-10 flex flex-col p-10 space-y-5 bg-gray-50">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className={`${poppins.className} text-3xl font-bold`}>
              PLP Students' Ecological Profile Insights & Forecasting
            </span>
            <ResetVisualization />
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
