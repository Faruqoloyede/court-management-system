// components/Sidebar.jsx
import { signOut } from "firebase/auth";
import {
  FiHome,       // Dashboard
  FiFolder,     // Cases
  FiUsers,      // Clients
  FiX ,
  FiLogOut          // Close
} from "react-icons/fi";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage }) => {
  const navigationItems = [
    { name: "Dashboard", to: '/dashboard', icon: <FiHome className="h-5 w-5" /> },
    { name: "Cases", to: '/cases', icon: <FiFolder className="h-5 w-5" /> },
    { name: "Add Case", to: '/addcase', icon: <FiUsers className="h-5 w-5" /> },
  ];

  const navigate = useNavigate();

  const handleLogout = async()=>{
    await signOut(auth);
    navigate('/');
  }
  return (
    <>
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 transform transition duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-blue-900 border-b border-blue-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center mr-2">
                <FiHome className="h-6 w-6 text-blue-900" />
              </div>
              <span className="text-white text-xl font-semibold">
                CourtDocs
              </span>
            </div>
          </div>
          <button
            className="text-blue-200 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="mt-5 px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`group flex items-center px-2 py-2 mb-10 text-sm font-medium rounded-md transition-colors ${
                  activePage === item.name
                    ? "bg-blue-800 text-white"
                    : "text-blue-100 hover:bg-blue-800 hover:text-white"
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
            <span onClick={handleLogout} className="text-blue-100 hover:bg-blue-800 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors">
              <FiLogOut className="h-5 w-5" />
              <button className="ml-3">Logout</button>
            </span>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
