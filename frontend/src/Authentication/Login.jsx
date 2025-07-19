




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.success) {
        setMessage(res.data.message);
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-purple-950 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-black/40 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-md border border-purple-800"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-300">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-2">{message}</p>}

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 transition-all p-3 rounded-lg font-semibold"
        >
          Login
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-purple-300 hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-purple-300 hover:underline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
