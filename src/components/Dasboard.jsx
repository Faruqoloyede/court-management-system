import React from 'react'
import { 
  FiHome,       // Dashboard
  FiFolder,     // Cases
  FiCalendar,   // Calendar
  FiFileText    // Documents
} from "react-icons/fi";

const Dasboard = ({activePage}) => {
  return (
     <div>
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="py-5">
              <h1 className="text-2xl font-bold text-gray-900">{activePage}</h1>
            </div>
            
            {/* Dashboard content */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <FiFolder className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">24</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500"> View all</a>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <FiCalendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Today's Hearings</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">3</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500"> View calendar</a>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <FiFileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Documents</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">7</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500"> Review now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}

export default Dasboard