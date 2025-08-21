import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AddCase from '../components/AddCase'

const AddCasePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Add Case");

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
        <AddCase activePage={activePage}  />
      </div>
    </div>
  )
}

export default AddCasePage