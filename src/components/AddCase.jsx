import React, { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  FaSave, 
  FaUpload, 
  FaTimes,
  FaFilePdf,
  FaFileWord,
  FaFileAlt
} from "react-icons/fa";
import { 
  FiArrowLeft, 
  FiHash, 
  FiUsers, 
  FiUser, 
  FiFileText,
  FiPlus,
  FiX
} from "react-icons/fi";
import { toast } from "react-toastify";

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
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FaFilePdf className="text-red-500 text-xl" />;
    } else if (fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx')) {
      return <FaFileWord className="text-blue-500 text-xl" />;
    } else {
      return <FaFileAlt className="text-gray-500 text-xl" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

     const caseNumberPattern = /^[A-Z]{2}-\d{4}-\d{4}$/;
  if (!caseNumberPattern.test(caseData.caseNumber)) {
    toast.error("Case Number must be in the format CR-2023-0456");
    return;
  }

  const judgePattern = /^[A-Za-z\s]+$/;
  if (!judgePattern.test(caseData.judge)) {
    toast.error("Judge name must contain only letters and spaces");
    return;
  }

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
        status: "Pending",
        createdAt: new Date(),
      });
      toast.success("Case added successfully!");
      navigate("/cases");
    } catch (error) {
      console.error("Error adding case:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Form header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Add New Case</h1>
          <p className="text-blue-100 mt-1">Enter the details of the new court case</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Case Number Field */}
          <div>
            <label htmlFor="caseNumber" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiHash className="mr-2 text-gray-500" /> Case Number
            </label>
            <input
              type="text"
              id="caseNumber"
              name="caseNumber"
              placeholder="e.g., CR-2023-0456"
              value={caseData.caseNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Parties Involved Field */}
          <div>
            <label htmlFor="parties" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUsers className="mr-2 text-gray-500" /> Parties Involved
            </label>
            <input
              type="text"
              id="parties"
              name="parties"
              placeholder="e.g., Plaintiff vs Defendant"
              value={caseData.parties}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Judge Field */}
          <div>
            <label htmlFor="judge" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUser className="mr-2 text-gray-500" /> Presiding Judge
            </label>
            <input
              type="text"
              id="judge"
              name="judge"
              placeholder="e.g., Honorable Jane Smith"
              value={caseData.judge}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Verdict Field */}
          <div>
            <label htmlFor="verdict" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiFileText className="mr-2 text-gray-500" /> Verdict
            </label>
            <textarea
              id="verdict"
              name="verdict"
              placeholder="Enter the case verdict..."
              value={caseData.verdict}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaUpload className="mr-2 text-gray-500" /> Supporting Documents
            </label>
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.txt,.rtf"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB each</p>
              </div>
            </div>

            {/* File previews */}
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Documents:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {getFileIcon(file.name)}
                        <span className="ml-2 text-sm font-medium text-gray-700 truncate max-w-xs">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 transition-colors"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Case
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCase;