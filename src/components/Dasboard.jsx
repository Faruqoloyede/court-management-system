import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FiFolder, FiCheckCircle, FiClock, FiCheckSquare } from "react-icons/fi";

const Dashboard = ({ activePage }) => {
  const [totalCases, setTotalCases] = useState(0);
  const [pendingCases, setPendingCases] = useState(0);
  const [ongoingCases, setOngoingCases] = useState(0);
  const [completedCases, setCompletedCases] = useState(0);

  useEffect(() => {
  const fetchCases = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cases"));
      let total = 0,
        pending = 0,
        ongoing = 0,
        completed = 0;

      querySnapshot.forEach((doc) => {
        total++;
        const data = doc.data();
        const status = (data.status || "").trim().toLowerCase();

        if (status === "pending") pending++;
        if (status === "ongoing") ongoing++;
        if (status === "completed") completed++;
      });

      setTotalCases(total);
      setPendingCases(pending);
      setOngoingCases(ongoing);
      setCompletedCases(completed);
    } catch (err) {
      console.error("Error fetching cases:", err);
    }
  };

  fetchCases();
}, []);


  return (
    <div>
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="py-5">
            <h1 className="text-2xl font-bold text-gray-900">{activePage}</h1>
          </div>

          {/* Dashboard content */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Cases */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <FiFolder className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Cases</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{totalCases}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Cases */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <FiClock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Cases</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{pendingCases}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Ongoing Cases */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <FiCheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Ongoing Cases</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{ongoingCases}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Cases */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <FiCheckSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Cases</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{completedCases}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
