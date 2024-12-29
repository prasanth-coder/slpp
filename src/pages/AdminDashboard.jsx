import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const AdminDashboard = () => {
  const [petitions, setPetitions] = useState([]); // All petitions
  const [responseText, setResponseText] = useState(""); // Admin response text
  const [selectedPetition, setSelectedPetition] = useState(null); // Petition selected for response

  // Fetch petitions when the component mounts
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const response = await axios.get("/admin/petitions");
        setPetitions(response.data.petitions); // Populate the petitions list
      } catch (err) {
        console.error(err.response?.data?.error || "Failed to fetch petitions.");
      }
    };

    fetchPetitions();
  }, []);

  // Handle admin response submission
  const handleRespond = async (petitionId) => {
    try {
      await axios.post(`/admin/petitions/${petitionId}/respond`, {
        response: responseText,
      });
      alert("Response submitted!");
      setSelectedPetition(null); // Clear the selection
      setResponseText(""); // Clear the response text

      // Refresh petitions after responding
      const updatedResponse = await axios.get("/admin/petitions");
      setPetitions(updatedResponse.data.petitions);
    } catch (err) {
      console.error(err.response?.data?.error || "Failed to respond.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Display all petitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {petitions.map((petition) => (
          <div
            key={petition._id}
            className="bg-white p-4 rounded shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-bold">{petition.title}</h3>
            <p className="text-sm text-gray-600">{petition.text}</p>
            <p className="text-sm text-gray-600">
              Status: <span className="font-semibold">{petition.status}</span>
            </p>
            <p className="text-sm text-gray-600">
              Signatures: {petition.signatures.length}
            </p>

            {/* Show response if petition is already closed */}
            {petition.status === "closed" && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>Response:</strong> {petition.response}
              </p>
            )}

            {/* Button to respond if the petition is open */}
            {petition.status === "open" && (
              <button
                onClick={() => setSelectedPetition(petition)}
                className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                Respond
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal for responding to a petition */}
      {selectedPetition && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              Respond to Petition: {selectedPetition.title}
            </h2>
            <textarea
              rows="4"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your response here..."
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedPetition(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedPetition._id)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
