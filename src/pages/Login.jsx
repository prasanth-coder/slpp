import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { dispatch } = useContext(AuthContext); // Correctly destructuring dispatch from the context
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/petitioner/login", formData);
      const token = response.data.token;

      // Decode the token to extract user role
      const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      console.log(decodedUser)

      // Save token to localStorage and update AuthContext
      localStorage.setItem("token", token);

      dispatch({ type: "LOGIN", payload: decodedUser });

      // Redirect based on role
      if (decodedUser.role === "admin") {
        navigate("/admin");
      } else if(decodedUser.role === 'petitioner') {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
 