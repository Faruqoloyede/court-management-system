import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { 
  FiArrowLeft, FiEdit2, FiSave, FiX, FiFile, 
  FiClock, FiCheckCircle, FiHash
} from "react-icons/fi";

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Verdict
  const [isEditingVerdict, setIsEditingVerdict] = useState(false);
  const [newVerdict, setNewVerdict] = useState("");

  // Next Hearing Date
  const [nextHearingDate, setNextHearingDate] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const docRef = doc(db, "cases", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };

          // Default status to "Pending" if missing
          if (!data.status) data.status = "Pending";

          setCaseData(data);
          setNewVerdict(data.verdict || "");
          setNextHearingDate(data.nextHearingDate || "");
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

      if (newStatus === "Adjourn") {
        await updateDoc(caseRef, { status: newStatus, nextHearingDate });
        setCaseData((prev) => ({ ...prev, status: newStatus, nextHearingDate }));
      } else {
        await updateDoc(caseRef, { status: newStatus, nextHearingDate: "" });
        setCaseData((prev) => ({ ...prev, status: newStatus, nextHearingDate: "" }));
      }
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
      case "Completed": return "bg-green-100 text-green-800";
      case "Adjourn": return "bg-purple-100 text-purple-800";
      case "Pending":
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <FiCheckCircle className="mr-1" />;
      case "Adjourn": return <FiClock className="mr-1" />;
      case "Pending":
      default: return <FiClock className="mr-1" />;
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!caseData) return <p className="p-6">Case not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {/* Case Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Case Details</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(caseData.status)}`}>
          {getStatusIcon(caseData.status)} {caseData.status || "Pending"}
        </span>
      </div>

      {/* Case Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiHash className="mr-2" /> Case Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><span className="font-medium">Case Number:</span> {caseData.caseNumber}</p>
          <p><span className="font-medium">Parties:</span> {caseData.parties}</p>
          <p><span className="font-medium">Judge:</span> {caseData.judge}</p>
          <p><span className="font-medium">Date Added:</span> {caseData.createdAt?.toDate?.().toLocaleDateString() || "—"}</p>
        </div>

        {/* Status update */}
        <div className="mt-6">
          <label className="font-medium mr-2">Update Status:</label>
          <select
            value={caseData.status || "Pending"}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Adjourn">Adjourn</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Next Hearing Date (only if Adjourned) */}
        {caseData.status === "Adjourn" && (
          <div className="mt-4">
            <label className="font-medium mr-2">Next Hearing Date:</label>
            <input
              type="date"
              value={nextHearingDate}
              onChange={(e) => setNextHearingDate(e.target.value)}
              onBlur={() => handleStatusChange("Adjourn")}
              className="border rounded px-3 py-2"
            />
          </div>
        )}
      </div>

      {/* Verdict */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Verdict</h2>
          {!isEditingVerdict && (
            <button onClick={() => setIsEditingVerdict(true)} className="text-blue-600">
              <FiEdit2 className="inline mr-1" /> Edit
            </button>
          )}
        </div>
        {isEditingVerdict ? (
          <>
            <textarea
              value={newVerdict}
              onChange={(e) => setNewVerdict(e.target.value)}
              className="w-full border rounded p-2"
            />
            <div className="mt-2 flex gap-2">
              <button onClick={handleSaveVerdict} className="bg-blue-600 text-white px-3 py-2 rounded">
                <FiSave className="inline mr-1" /> Save
              </button>
              <button onClick={() => setIsEditingVerdict(false)} className="bg-gray-200 px-3 py-2 rounded">
                <FiX className="inline mr-1" /> Cancel
              </button>
            </div>
          </>
        ) : (
          <p>{caseData.verdict || "No verdict yet."}</p>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiFile className="mr-2" /> Uploaded Documents
        </h2>
        {caseData.evidences?.length ? (
          caseData.evidences.map((doc, i) => (
            <div key={i} className="p-2 border rounded mb-2">
              <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {doc.name || `Document ${i + 1}`}
              </a>
            </div>
          ))
        ) : (
          <p>No documents uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
