import { poppins, quicksand } from "@/app/utilities/fonts";
import { YearlyTrend } from "../charts/enrollments/YearlyTrend";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ApplicantEnrolleeCorrelation } from "../charts/enrollments/ApplicantEnrolleeCorrelation";
import { AcademicProgramEnrollment } from "../charts/enrollments/AcademicProgramEnrollment";
import { Residency } from "../charts/applicant-origins/Residency";
import { PasigResidentStudents } from "../charts/applicant-origins/PasigResidentStudents";
import { NonPasigResidentStudents } from "../charts/applicant-origins/NonPasigResidentStudents";
import { Gender } from "../charts/demographics/Gender";
import { Age } from "../charts/demographics/Age";
import { CivilStatus } from "../charts/demographics/CivilStatus";
import { Religion } from "../charts/demographics/Religion";
import { FamilyMonthlyIncome } from "../charts/socio-economic-background/FamilyMonthlyIncome";
import { FeederSchools } from "../charts/socio-economic-background/FeederSchools";

const Dashboard = ({ selectedCollege }: any) => {
  return (
    <div className="z-10 flex flex-col p-10 space-y-5 bg-gray-100">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className={`${poppins.className} text-4xl font-bold`}>
              PLP Enrollment Insights & Forecasting
            </h1>
          </CardTitle>
          <CardDescription>
            <p className={`${quicksand.className} `}>
              Data-Driven Decision Support for Planning and Resource Allocation
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className={``}>
            <span className="font-bold">Selected College:</span> {selectedCollege}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-7">

        {/* Enrollments */}
        <div className="flex flex-col gap-3">
          <div>
           <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>Enrollment Overview</h1>
          </div>
          <div className="flex gap-3">
            <YearlyTrend></YearlyTrend>
            <ApplicantEnrolleeCorrelation></ApplicantEnrolleeCorrelation>
          </div>
          <div>
            <AcademicProgramEnrollment></AcademicProgramEnrollment>
          </div>
        </div>

        {/* Applicant Origins */}
        <div className="w-full flex flex-col gap-3">
          <div>
           <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>Applicant Origins</h1>
          </div>
          <div className="flex gap-3 w-full">
            <div className="flex flex-1 w-[30%]">
              <Residency></Residency>
            </div>
            <div className="flex flex-1 w-[30%]">
              <PasigResidentStudents></PasigResidentStudents>
            </div>
            <div className="flex flex-1 w-[30%]">
              <NonPasigResidentStudents></NonPasigResidentStudents>
            </div>
          </div>
          
        </div>

        {/* Demographics */}
        <div className="flex flex-col gap-3">
          <div>
           <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>Demographics Summary</h1>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col w-[40%] gap-3">
              <Gender></Gender>
              <Age></Age>
            </div>
            <div className="flex flex-1 gap-3 w-[60%]">
              <CivilStatus></CivilStatus>
              <Religion></Religion>
            </div>
          </div>
          
        </div>

        {/* Socio-Economic Background */}
        <div className="flex flex-col gap-3">
          <div>
           <h1 className={`${poppins.className} text-2xl font-bold ml-3`}>Socio-Economic Background</h1>
          </div>
          <div className="flex gap-3">
            <div className="w-[65%]">
              <FamilyMonthlyIncome></FamilyMonthlyIncome> 
            </div>
            <FeederSchools></FeederSchools> 
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
