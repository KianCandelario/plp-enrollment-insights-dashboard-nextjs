"use client";

import Dashboard from "@/app/components/pages/Dashboard";
import { SideBar, SideBarItem } from "@/app/components/SideBar";
import { CombineIcon, ComputerIcon, BookIcon, BriefcaseMedicalIcon, Building2Icon, FolderCode, HotelIcon } from 'lucide-react';
import { useState } from "react";


const DashboardPageUser = () => {
  const [selectedCollege, setSelectedCollege] = useState('All Colleges');

  const handleCollegeSelection = (college: string) => {
    setSelectedCollege(college);
  };

  return (
    <main className="w-screen min-h-screen h-screen flex">
      <SideBar>
        <SideBarItem 
          icon={<CombineIcon size={20} />}
          text="All Colleges"
          active={selectedCollege === 'All Colleges'}
          onClick={() => handleCollegeSelection('All Colleges')}
        />
        <SideBarItem 
          icon={<ComputerIcon size={20} />}
          text="BSCS"
          active={selectedCollege === 'BSCS'}
          onClick={() => handleCollegeSelection('BSCS')}
        />
        <SideBarItem 
          icon={<FolderCode size={20} />}
          text="BSIT"
          active={selectedCollege === 'BSIT'}
          onClick={() => handleCollegeSelection('BSIT')}
        />
        <SideBarItem 
          icon={<BookIcon size={20} />}
          text="BSED"
          active={selectedCollege === 'BSED'}
          onClick={() => handleCollegeSelection('BSED')}
        />
        <SideBarItem 
          icon={<BriefcaseMedicalIcon size={20} />}
          text="BSN"
          active={selectedCollege === 'BSN'}
          onClick={() => handleCollegeSelection('BSN')}
        />
        <SideBarItem 
          icon={<Building2Icon size={20} />}
          text="BSE"
          active={selectedCollege === 'BSE'}
          onClick={() => handleCollegeSelection('BSE')}
        />
        <SideBarItem 
          icon={<HotelIcon size={20} />}
          text="BSHM"
          active={selectedCollege === 'BSHM'}
          onClick={() => handleCollegeSelection('BSHM')}
        />
      </SideBar>
      <Dashboard selectedCollege={selectedCollege} />
    </main>
  );
};

export default DashboardPageUser;
