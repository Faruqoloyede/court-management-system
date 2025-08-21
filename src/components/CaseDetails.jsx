import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const CaseDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const docRef = doc(db, "cases", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCaseData({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such case!");
        }
      } catch (err) {
        console.error("Error fetching case:", err);
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

  if (!caseData) return <p className="p-6">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-4 py-2 rounded"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Case Details</h1>

      <p><strong>Case Number:</strong> {caseData.caseNumber}</p>
      <p><strong>Parties:</strong> {caseData.parties}</p>
      <p><strong>Judge:</strong> {caseData.judge}</p>

      {/* ✅ Status update */}
      <div className="mt-2">
        <strong>Status:</strong>{" "}
        <select
          value={caseData.status || "Pending"}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          className="ml-2 border rounded px-2 py-1"
        >
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
        {updating && <span className="ml-2 text-gray-500">Updating...</span>}
      </div>

      {/* ✅ Date */}
      <p className="mt-2">
        <strong>Date Added:</strong>{" "}
        {caseData.createdAt?.toDate
          ? caseData.createdAt.toDate().toLocaleString()
          : "—"}
      </p>

      {/* ✅ Verdict */}
      <h2 className="mt-6 font-semibold text-lg">Verdict</h2>
      <p className="bg-gray-100 p-3 rounded">
        {caseData.verdict?.trim()
          ? caseData.verdict
          : "No verdict provided yet."}
      </p>

      {/* ✅ Documents */}
      <h2 className="mt-6 font-semibold text-lg">Uploaded Documents</h2>
      {caseData.evidences.length > 0 ? (
        <ul className="list-disc ml-6 space-y-2">
          {caseData.evidences.map((doc, index) => (
            <li key={index}>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                📄 {doc.name || `Document ${index + 1}`}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents uploaded.</p>
      )}
    </div>
  );
};

export default CaseDetails;
