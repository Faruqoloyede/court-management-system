// components/Header.jsx
import { FaBell, FaSearch, FaBars, FaTh } from 'react-icons/fa';
import { useState } from 'react';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <h1 className='text-3xl font-bold text-gray-800 pt-3 text-center'>Court Management System</h1>
          <div className="flex items-center">
            <button
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="h-6 w-6" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;