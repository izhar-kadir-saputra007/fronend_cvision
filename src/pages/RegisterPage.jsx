import heroRegister from "../assets/images/heroRegister.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [phoneNumber,setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/users", {
        name,
        phoneNumber,
        email,
        password,
        confPassword,
      });
      navigate("/login");
    } catch (err) {
      if (err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError(err.response.data.error);
      }
    }
  };

  return (
    <>
      <div className="register flex justify-center min-h-screen items-center mx-auto">
        <div className="box border-2 grid grid-cols-2 border-secondary max-w-fit rounded-3xl overflow-hidden shadow-custom3">
          {/* Image Section */}
          <div className="box flex justify-center py-36 px-20 bg-color5">
            <img src={heroRegister} alt="register image" className="w-[350px]" />
          </div>

          {/* Form Input */}
          <div className="box bg-primary text-secondary pl-24 py-20">
            <h1 className="text-3xl mb-4 font-bold">Register</h1>
            <p className="text-sm mb-16">
              Already have an account?{" "}{" "}
              <Link to="/login" className="font-bold text-lg text-color1 hover:transition-all hover:scale-105">
                 Login
              </Link>
            </p>
            {error && <p className="text-color1 font-semibold ">{error}</p>} {/* Menampilkan pesan kesalahan */}
            <form
              method="post"
              className="flex flex-col space-y-4 gap-4 mt-5 pr-24"
              onSubmit={handleSubmit}
            >
              <div className="space-y-3">
                <label
                  htmlFor="name"
                  className="block text-sm text-gray-700 dark:text-secondary font-semibold"
                >
                  User name
                </label>
                <input
                  type="text"
                  placeholder="izhar kadir saputra"
                  onChange={(e) => setName(e.target.value)}
                  className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-color5 dark:border-secondary dark:text-secondary dark:placeholder-color3 dark:focus:ring-[#00C3FE] dark:focus:bg-primary focus:shadow-custom3"
                />
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="Phone Number"
                  className="block text-sm text-gray-700 dark:text-secondary font-semibold"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="6212345678"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-color5 dark:border-secondary dark:text-secondary dark:placeholder-color3 dark:focus:ring-[#00C3FE] dark:focus:bg-primary focus:shadow-custom3"
                />
              </div>
              <div className="space-y-3">
                <label
                  className="block text-sm text-gray-700 dark:text-secondary font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-color5 dark:border-secondary dark:text-secondary dark:placeholder-color3 dark:focus:ring-[#00C3FE] dark:focus:bg-primary focus:shadow-custom3"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label
                  className="block text-sm text-gray-700 dark:text-secondary font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-color5 dark:border-secondary dark:text-secondary dark:placeholder-color3 dark:focus:ring-[#00C3FE] dark:focus:bg-primary focus:shadow-custom3"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label
                  className="block text-sm text-gray-700 dark:text-secondary font-semibold"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-color5 dark:border-secondary dark:text-secondary dark:placeholder-color3 dark:focus:ring-[#00C3FE] dark:focus:bg-primary focus:shadow-custom3"
                  placeholder="********"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn bg-color1 font-semibold text-primary mx-40 rounded-full py-2 fokus:shadow-custom4 hover:scale-x-105 hover: transition-all"
              >
                Submit
              </button>
            </form>
            <p className=" mt-8">
  Want to register as a company?{" "}
  <Link to="/register-adminpt" className="font-bold text-color1">
    Register as Company
  </Link>
</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
