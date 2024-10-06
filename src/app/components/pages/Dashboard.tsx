import { poppins, quicksand } from "@/app/utilities/fonts";
import { YearlyTrend } from "../charts/YearlyTrend";

const Dashboard = ({ selectedCollege }: any) => {
  return (
    <div className="z-10 flex flex-col">
      <h1 className={`${poppins.className} text-4xl font-bold`}>
        PLP Enrollment Insights Dashboard
      </h1>
      <p className={`${quicksand.className} `}>
        Data-Driven Decision Support for Planning and Resource Allocation
      </p>
      <p className={`${quicksand.className}`}>
        Selected College: {selectedCollege}
      </p>
      <YearlyTrend></YearlyTrend>
    </div>
  );
};

export default Dashboard;
