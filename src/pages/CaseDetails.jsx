import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CaseDetails from "../components/CaseDetails";

const CaseDetailsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Cases");

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
         <Header setSidebarOpen={setSidebarOpen} />
        <CaseDetails activePage={activePage}  />
      </div>
    </div>
  )
}

export default CaseDetailsPage