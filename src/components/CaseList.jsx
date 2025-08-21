import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CaseList = ({ activePage }) => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch cases from Firestore
  useEffect(() => {
    const fetchCases = async () => {
      const querySnapshot = await getDocs(collection(db, "cases"));
      const caseList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCases(caseList);
    };
    fetchCases();
  }, []);

  // Delete case
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      await deleteDoc(doc(db, "cases", id));
      setCases(cases.filter((c) => c.id !== id));
    }
  };

  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.parties?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{activePage}</h1>
        <button
          onClick={() => navigate("/addcase")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Case
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cases..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Case Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Parties</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Judge</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Date Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/cases/${c.id}`)} // ✅ navigate by Firestore ID
                  >
                    <td className="px-6 py-4">{c.caseNumber}</td>
                    <td className="px-6 py-4">{c.parties}</td>
                    <td className="px-6 py-4">{c.judge}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {c.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.createdAt?.toDate
                        ? c.createdAt.toDate().toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // ✅ Prevent row click from firing
                          handleDelete(c.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaseList;
