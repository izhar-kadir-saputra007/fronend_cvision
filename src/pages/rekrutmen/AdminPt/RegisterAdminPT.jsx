import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import heroRegister from "../../../assets/images/heroRegister.png";

const RegisterAdminPT = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confPassword: "",
    namaPT: "",
    alamatPT: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/registerAdminPT`, formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register flex justify-center min-h-screen items-center mx-auto">
      <div className="box border-2 grid grid-cols-2 border-secondary max-w-fit rounded-3xl overflow-hidden shadow-custom3">
        {/* Image Section */}
        <div className="box flex justify-center py-36 px-20 bg-color5">
          <img src={heroRegister} alt="register image" className="w-[350px]" />
        </div>

        {/* Form Input */}
        <div className="box bg-primary text-secondary pl-24 py-20">
          <h1 className="text-3xl mb-4 font-bold">Register as Company</h1>
          <p className="text-sm mb-16">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-lg text-color1 hover:transition-all hover:scale-105">
              Login
            </Link>
          </p>
          {error && <p className="text-color1 font-semibold">{error}</p>}
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 gap-4 mt-5 pr-24">
            {/* Personal Information */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 bg-color5"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 bg-color5"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 bg-color5"
                required
              />
            </div>

            {/* Company Information */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Company Name</label>
              <input
                type="text"
                name="namaPT"
                value={formData.namaPT}
                onChange={handleChange}
                className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 bg-color5"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold">Company Address</label>
              <input
                type="text"
                name="alamatPT"
                value={formData.alamatPT}
                onChange={handleChange}
                className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 bg-color5"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 bg-color5"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confPassword"
                value={formData.confPassword}
                onChange={handleChange}
                className="py-3 px-5 block w-full border-[#00C3FE] rounded-full text-sm focus:outline-none focus:border-[#00C3FE] focus:ring-[#00C3FE] focus:ring-2 bg-color5"
                required
              />
            </div>

            <button
              type="submit"
              className="btn bg-color1 font-semibold text-primary mx-40 rounded-full py-2 fokus:shadow-custom4 hover:scale-x-105 hover:transition-all"
            >
              Register as Company
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminPT;