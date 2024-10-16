import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import axios from "axios"; // To handle API requests
import { useNavigate } from "react-router-dom"; // If you're using React Router
import loginImage from '../assets/login.jpeg';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; 

const LoginCard: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Use this to redirect after login

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });

      console.log(response.data); // Check the response structure

      // Assuming the JWT token is in response.data.token
      const token = response.data.token;
      localStorage.setItem("token", token); 
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 5000, // Close after 5 seconds
      });
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (error: any) {
      // Enhanced error handling
      if (error.response) {
        console.error("Error response:", error.response.data); // Log the full error response
        setError(error.response.data.message || "Invalid email or password");
        toast.error(error.response.data.message || "Invalid email or password", {
          position: "top-right",
          autoClose: 5000,
        }); // Show error toast message
      } else if (error.request) {
        console.error("No response from server", error.request);
        setError("No response from server. Please try again.");
        toast.error("No response from server. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        console.error("Error message:", error.message);
        setError("An error occurred: " + error.message);
        toast.error("An error occurred: " + error.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="h-5/6 w-4/6 bg-white flex justify-center items-center rounded-3xl shadow-slate-800 shadow-2xl">
      <div className="w-1/2 h-full">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover rounded-l-3xl"
        />
      </div>

      <div className="w-1/2 flex flex-col h-full justify-around items-center">
        <h1 className="text-6xl font-serif text-teal-950 font-bold">CodePath</h1>
        <h1 className="text-4xl font-bold text-black font-sans">Login</h1>
      
        <form className="flex flex-col h-1/2 w-3/4 justify-evenly" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <div className="relative w-full">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaUser className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400 cursor-pointer" onClick={togglePasswordVisibility} />
                ) : (
                  <FaEye className="text-gray-400 cursor-pointer" onClick={togglePasswordVisibility} />
                )}
              </div>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
     
    </div>
  );
};

export default LoginCard;
