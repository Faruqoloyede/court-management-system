import React, { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";

const AddCase = () => {
  const [caseData, setCaseData] = useState({
    caseNumber: "",
    parties: "",
    judge: "",
    verdict: "",
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCaseData({ ...caseData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...e.target.files]); // ✅ append files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const fileUrls = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "court_case");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dmx9pkpco/auto/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        fileUrls.push({ name: file.name, url: data.secure_url });
      }

      await addDoc(collection(db, "cases"), {
        ...caseData,
        evidences: fileUrls,
        status: "pending",
        createdAt: new Date(),
      });

      navigate("/cases");
    } catch (error) {
      console.error("Error adding case:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Case</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="caseNumber"
            placeholder="Case Number"
            value={caseData.caseNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="parties"
            placeholder="Parties Involved"
            value={caseData.parties}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="judge"
            placeholder="Judge"
            value={caseData.judge}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            name="verdict"
            placeholder="Verdict"
            value={caseData.verdict}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
            accept=".pdf,.doc,.docx"
          />

          {/* ✅ Preview selected files */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Selected Documents:</h3>
              <ul className="list-disc ml-6 space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-gray-700">
                    📄 {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <FaSave className="mr-2" /> {uploading ? "Uploading..." : "Save Case"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCase;
