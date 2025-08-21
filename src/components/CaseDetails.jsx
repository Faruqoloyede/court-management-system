import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiFile, 
  FiClock, 
  FiCheckCircle,
  FiActivity,
  FiUser,
  FiHash,
  FiCalendar 
} from "react-icons/fi";

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Verdict editing state
  const [isEditingVerdict, setIsEditingVerdict] = useState(false);
  const [newVerdict, setNewVerdict] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const docRef = doc(db, "cases", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setCaseData(data);
          setNewVerdict(data.verdict || "");
        } else {
          console.log("No such case!");
        }
      } catch (err) {
        console.error("Error fetching case:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!id) return;
    try {
      setUpdating(true);
      const caseRef = doc(db, "cases", id);
      await updateDoc(caseRef, { status: newStatus });
      setCaseData((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveVerdict = async () => {
    if (!id) return;
    try {
      setUpdating(true);
      const caseRef = doc(db, "cases", id);
      await updateDoc(caseRef, { verdict: newVerdict });
      setCaseData((prev) => ({ ...prev, verdict: newVerdict }));
      setIsEditingVerdict(false);
    } catch (error) {
      console.error("Error updating verdict:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Ongoing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FiCheckCircle className="mr-1" />;
      case "Ongoing":
        return <FiActivity className="mr-1" />;
      case "Pending":
      default:
        return <FiClock className="mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded mt-6"></div>
            <div className="h-32 bg-gray-200 rounded mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) return <p className="p-6">Case not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {/* Case header with title and status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Case Details</h1>
        <div className="flex items-center mt-2 md:mt-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData.status)}`}>
            {getStatusIcon(caseData.status)}
            {caseData.status || "Pending"}
          </span>
        </div>
      </div>

      {/* Case information card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiHash className="mr-2 text-gray-500" /> Case Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Case Number</span>
            <span className="font-medium">{caseData.caseNumber || "—"}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Parties Involved</span>
            <span className="font-medium">{caseData.parties || "—"}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Presiding Judge</span>
            <span className="font-medium flex items-center">
              <FiUser className="mr-1 text-gray-500" /> {caseData.judge || "—"}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Date Added</span>
            <span className="font-medium flex items-center">
              <FiCalendar className="mr-1 text-gray-500" />
              {caseData.createdAt?.toDate
                ? caseData.createdAt.toDate().toLocaleDateString()
                : "—"}
            </span>
          </div>
        </div>
        
        {/* Status update section */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0 sm:mr-4">Update Status:</span>
            <div className="flex items-center">
              <select
                value={caseData.status || "Pending"}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              {updating && <span className="ml-3 text-gray-500 text-sm">Updating...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Verdict section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Verdict</h2>
          {!isEditingVerdict && (
            <button
              onClick={() => setIsEditingVerdict(true)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FiEdit2 className="mr-1" /> Edit
            </button>
          )}
        </div>

        {isEditingVerdict ? (
          <div className="space-y-4">
            <textarea
              value={newVerdict}
              onChange={(e) => setNewVerdict(e.target.value)}
              rows={6}
              className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter case verdict..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveVerdict}
                disabled={updating}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiSave className="mr-1" /> {updating ? "Saving..." : "Save Verdict"}
              </button>
              <button
                onClick={() => {
                  setIsEditingVerdict(false);
                  setNewVerdict(caseData.verdict || "");
                }}
                className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                <FiX className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className={caseData.verdict?.trim() ? "text-gray-800" : "text-gray-500 italic"}>
              {caseData.verdict?.trim() || "No verdict provided yet."}
            </p>
          </div>
        )}
      </div>

      {/* Documents section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiFile className="mr-2 text-gray-500" /> Uploaded Documents
        </h2>
        
        {caseData.evidences?.length > 0 ? (
          <div className="space-y-3">
            {caseData.evidences.map((doc, index) => (
              <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FiFile className="text-gray-500 mr-3" />
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {doc.name || `Document ${index + 1}`}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No documents uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;