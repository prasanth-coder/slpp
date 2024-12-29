import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import QrReader from "react-qr-scanner";

// List of valid BioIDs
const validBioIds = new Set([
  "K1YL8VA2HG", "V30EPKZQI2", "QJXQOUPTH9", "CET8NUAE09", "BZW5WWDMUY",
  "7DMPYAZAP2", "O3WJFGR5WE", "GOYWJVDA8A", "VQKBGSE3EA", "340B1EOCMG",
  "D05HPPQNJ4", "SEIQTS1H16", "6EBQ28A62V", "E7D6YUPQ6J", "CG1I9SABLL",
  "2WYIM3QCK9", "X16V7LFHR2", "30MY51J1CJ", "BPX8O0YB5L", "49YFTUA96K",
  "DHKFIYHMAZ", "TLFDFY7RDG", "FH6260T08H", "AT66BX2FXM", "V2JX0IC633",
  "LZK7P0X0LQ", "PGPVG5RF42", "JHDCXB62SA", "1PUQV970LA", "C7IFP4VWIL",
  "H5C98XCENC", "FPALKDEL5T", "O0V55ENOT0", "CCU1D7QXDT", "RYU8VSS4N5",
  "6X6I6TSUFG", "2BIB99Z54V", "F3ATSRR5DQ", "TTK74SYYAN", "S22A588D75",
  "QTLCWUS8NB", "ABQYUQCQS2", "1K3JTWHA05", "4HTOAI9YKO", "88V3GKIVSF",
  "Y4FC3F9ZGS", "9JSXWO4LGH", "FINNMWJY0G", "PD6XPNB80J", "8OLYIE2FRC",
]);

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dob: "",
    password: "",
    bioId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      if (validBioIds.has(data.text)) {
        setFormData((prevFormData) => ({ ...prevFormData, bioId: data.text }));
        setError("");
      } else {
        setError("Invalid BioID scanned. Please scan a valid BioID.");
      }
    }
  };

  const handleError = (err) => {
    console.error("QR scanning error:", err);
    setError("QR scanner error. Please try again.");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validBioIds.has(formData.bioId)) {
      setError("Invalid BioID. Please enter a valid BioID.");
      return;
    }

    try {
      const response = await axios.post("/petitioner/register", formData);
      setSuccess("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. " + (err.response?.data?.message || err.message));
    }
  };

  const previewStyle = {
    height: 240,
    width: 320,
    margin: "1rem auto",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="bioId"
            placeholder="BioID"
            value={formData.bioId}
            onChange={handleChange}
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <QrReader
            delay={300}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
