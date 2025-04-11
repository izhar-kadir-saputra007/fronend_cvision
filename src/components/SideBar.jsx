import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SideBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:3000/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const activeClass = "bg-sidebar-hover text-primary font-bold px-2";

  return (
    <div className="w-64 h-screen bg-primary text-color1 flex flex-col shadow-customside py-14 border-r-2 border-secondary">
      <h2 className="text-2xl font-bold p-4 border-b-4 border-secondary">
        Admin Panel
      </h2>
      <nav className="flex flex-col mt-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `py-2 px-4 hover:bg-sidebar-hover hover:text-primary ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `py-2 px-4 hover:bg-sidebar-hover hover:text-primary ${isActive ? activeClass : ""}`
          }
        >
          Data Users
        </NavLink>

        <NavLink
          to="/edit"
          className={({ isActive }) =>
            `py-2 px-4 hover:bg-sidebar-hover hover:text-primary ${isActive ? activeClass : ""}`
          }
        >
          Edit Users
        </NavLink>

        <NavLink
          to="/setting"
          className={({ isActive }) =>
            `py-2 px-4 hover:bg-sidebar-hover hover:text-primary ${isActive ? activeClass : ""}`
          }
        >
          setting
        </NavLink>

        <button
          onClick={handleLogout}
          className="py-2 px-4 text-left hover:bg-sidebar-hover hover:text-primary"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default SideBar;
