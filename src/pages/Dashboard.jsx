import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PetitionerDashboard = () => {
  const [petitions, setPetitions] = useState([]); // All petitions
  const [openPetitions, setOpenPetitions] = useState([]); // Open petitions
  const [closedPetitions, setClosedPetitions] = useState([]); // Closed petitions
  const [title, setTitle] = useState(""); // New petition title
  const [text, setText] = useState(""); // New petition text
  const [success, setSuccess] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message
  const navigate = useNavigate();

  // Fetch all petitions on mount
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/petitioner/petitions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPetitions(response.data.petitions);
        setOpenPetitions(
          response.data.petitions.filter((petition) => petition.status === "open")
        );
        setClosedPetitions(
          response.data.petitions.filter((petition) => petition.status === "closed")
        );
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch petitions.");
      }
    };

    fetchPetitions();
  }, []);

  // Chart Data
  const chartData = {
    labels: ["Open Petitions", "Closed Petitions"],
    datasets: [
      {
        label: "Petitions",
        data: [openPetitions.length, closedPetitions.length],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Petition Status Overview" },
    },
  };

  // Handle Create Petition
  const handleCreatePetition = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/petitioner/petitions",
        { title, text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Petition created successfully!");
      setError("");
      setTitle("");
      setText("");

      // Refresh petitions
      const updatedResponse = await axios.get("/petitioner/petitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPetitions(updatedResponse.data.petitions);
      setOpenPetitions(
        updatedResponse.data.petitions.filter((petition) => petition.status === "open")
      );
      setClosedPetitions(
        updatedResponse.data.petitions.filter((petition) => petition.status === "closed")
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create petition.");
      setSuccess("");
    }
  };

  // Handle Sign Petition
  const handleSignPetition = async (petitionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/petitioner/petitions/${petitionId}/sign`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Petition signed successfully!");
      setError("");

      // Refresh petitions
      const updatedResponse = await axios.get("/petitioner/petitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPetitions(updatedResponse.data.petitions);
      setOpenPetitions(
        updatedResponse.data.petitions.filter((petition) => petition.status === "open")
      );
      setClosedPetitions(
        updatedResponse.data.petitions.filter((petition) => petition.status === "closed")
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to sign petition.");
      setSuccess("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the stored token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Petitioner Dashboard</h1>
        <button onClick={handleLogout} className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      {/* Success/Error Messages */}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Chart Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Petition Status Overview</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Create Petition Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Create a New Petition</h2>
        <form onSubmit={handleCreatePetition}>
          <input
            type="text"
            placeholder="Petition Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Petition Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit Petition
          </button>
        </form>
      </div>

      {/* View All Petitions */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">All Petitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {petitions.map((petition) => (
            <div
              key={petition._id}
              className="bg-gray-100 p-4 rounded shadow hover:shadow-lg"
            >
              <h3 className="text-lg font-bold">{petition.title}</h3>
              <p className="text-sm text-gray-600">{petition.text}</p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-semibold">{petition.status}</span>
              </p>
              <p className="text-sm text-gray-600">
                Signatures: {petition.signatures.length}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Open Petitions */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Sign Open Petitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openPetitions.map((petition) => (
            <div
              key={petition._id}
              className="bg-gray-100 p-4 rounded shadow hover:shadow-lg"
            >
              <h3 className="text-lg font-bold">{petition.title}</h3>
              <p className="text-sm text-gray-600">{petition.text}</p>
              <button
                onClick={() => handleSignPetition(petition._id)}
                className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                Sign Petition
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetitionerDashboard;
