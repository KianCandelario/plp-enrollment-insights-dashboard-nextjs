// dashboard/page.tsx
"use client";

import Dashboard from "@/app/components/pages/Dashboard";
import { SideBar, SideBarItem } from "@/app/components/SideBar";
import { 
  CombineIcon, 
  ComputerIcon,
  BriefcaseBusiness,
  BookTextIcon,
  BookXIcon, 
  BookOpenIcon, 
  BriefcaseMedicalIcon, 
  FolderCode, 
  HotelIcon, 
  CalculatorIcon,
  Brain,
  CogIcon
} from 'lucide-react';
import { useState } from "react";

const DashboardPageUser = () => {
  const [selectedCollege, setSelectedCollege] = useState('All Colleges');

  const handleCollegeSelection = (college: string) => {
    setSelectedCollege(college);
  };

  return (
    <main className="min-h-screen h-screen flex">
      {/* Sidebar with fixed position */}
      <div className="w-72 h-screen relative">
        <SideBar className="sticky top-0 h-screen">
          <SideBarItem 
            icon={<CombineIcon size={17} />}
            text="All Colleges"
            active={selectedCollege === 'All Colleges'}
            onClick={() => handleCollegeSelection('All Colleges')}
          />
          <SideBarItem 
            icon={<ComputerIcon size={17} />}
            text="BSCS"
            active={selectedCollege === 'BSCS'}
            onClick={() => handleCollegeSelection('BSCS')}
          />
          <SideBarItem 
            icon={<FolderCode size={17} />}
            text="BSIT"
            active={selectedCollege === 'BSIT'}
            onClick={() => handleCollegeSelection('BSIT')}
          />
          <SideBarItem 
            icon={<CalculatorIcon size={17} />}
            text="BSA"
            active={selectedCollege === 'BSA'}
            onClick={() => handleCollegeSelection('BSA')}
          />
          <SideBarItem 
            icon={<BriefcaseBusiness size={17} />}
            text="BSBA"
            active={selectedCollege === 'BSBA'}
            onClick={() => handleCollegeSelection('BSBA')}
          />

          <SideBarItem 
            icon={<BookOpenIcon size={17} />}
            text="BEEd"
            active={selectedCollege === 'BEED'}
            onClick={() => handleCollegeSelection('BEED')}
          />
          <SideBarItem 
            icon={<BookTextIcon size={17} />}
            text="BSEd Major in Filipino"
            active={selectedCollege === 'BSED-FIL'}
            onClick={() => handleCollegeSelection('BSED-FIL')}
          />
          <SideBarItem 
            icon={<BookTextIcon size={17} />}
            text="BSEd Major in English"
            active={selectedCollege === 'BSED-ENG'}
            onClick={() => handleCollegeSelection('BSED-ENG')}
          />
          <SideBarItem 
            icon={<BookXIcon size={17} />}
            text="BSEd Major in Math"
            active={selectedCollege === 'BSED-MATH'}
            onClick={() => handleCollegeSelection('BSED-MATH')}
          />

          <SideBarItem 
            icon={<BriefcaseMedicalIcon size={17} />}
            text="BSN"
            active={selectedCollege === 'BSN'}
            onClick={() => handleCollegeSelection('BSN')}
          />
          <SideBarItem 
            icon={<CogIcon size={17} />}
            text="BSECE"
            active={selectedCollege === 'BSECE'}
            onClick={() => handleCollegeSelection('BSECE')}
          />
          <SideBarItem 
            icon={<HotelIcon size={17} />}
            text="BSHM"
            active={selectedCollege === 'BSHM'}
            onClick={() => handleCollegeSelection('BSHM')}
          />
          <SideBarItem 
            icon={<Brain size={17} />}
            text="ABPsych"
            active={selectedCollege === 'ABPsych'}
            onClick={() => handleCollegeSelection('ABPsych')}
          />
        </SideBar>
      </div>

      {/* Scrollable Dashboard Section */}
      <div className="flex-1 h-screen overflow-y-auto">
        <Dashboard selectedCollege={selectedCollege} />
      </div>
    </main>
  );
};

export default DashboardPageUser;
