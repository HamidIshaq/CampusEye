import React, { useState } from "react";
import axios from "axios";

const LoginBox = ({ onPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (password.length !== 8) {
      setError("Password must be exactly 8 characters.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: email,
        password,
      });

      if (response.data.message === "Login successful") {
        onPress(); // Navigate to Home
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-lg w-full">
      <div
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-center text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="mt-4 text-center text-gray-400">Sign in to continue</p>
          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginBox;
