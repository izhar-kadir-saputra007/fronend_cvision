import heroLogin from "../assets/images/heroLogin.png";
import { Form, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/login`, {
        email,
        password,
      });
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken); 
        localStorage.setItem("role", response.data.role);
        
        // Redirect berdasarkan role
        switch(response.data.role) {
          case 'admin':
            navigate("/admin");
            break;
          case 'adminPT': // Asumsi role untuk admin PT adalah 'admin_pt'
            navigate("/adminpt/dashboard"); // Arahkan ke dashboard admin PT
            break;
          default:
            navigate("/home");
        }
      } else {
        console.error("Token tidak ada dalam respons:", response.data);
      }
    } catch (error) {
      setError(error.response?.data?.msg || "Login failed");
    }
  }
  return (
    <>
      <div className="Login flex justify-center min-h-screen items-center">
        <div className="border-2 grid grid-cols-2 border-secondary max-w-fit rounded-3xl overflow-hidden shadow-custom3">

          {/* Image Section */}
          <div className="box flex justify-center py-20">
            <img src={heroLogin} alt="login image" className="w-[300px]" />
          </div>


        {/* form imput */}
          <div className="box bg-color5 text-secondary pl-10 pt-10">
            <h1 className="text-3xl mb-4 font-bold">Login</h1>
            <p className="text-sm mb-16">
              Dont have an account?{" "}
              <Link to="/register" className="font-bold text-color1">
                Sign Up
              </Link>
            </p>
            {error && <p className="text-color1 font-semibold ">{error}</p>}
            <Form
              method="post"
              className="flex flex-col space-y-4 gap-5 mt-5 pr-8"
              onSubmit={handleSubmit}
            >
              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-700 dark:text-secondary font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-primary dark:border-secondary dark:text-secondary dark:placeholder-color3 dark:focus:ring-[#00C3FE] dark:focus:bg-primary focus:shadow-custom3"
                  placeholder="Example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-700 dark:text-secondary font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary dark:border-secondary dark:text-secondary dark:placeholder-color3 dark:focus:ring-[#00C3FE] focus:shadow-custom3"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn bg-color1 font-semibold text-primary rounded-full py-2 mx-32 fokus:shadow-custom4 hover:scale-x-105 hover: transition-all"
              >
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
