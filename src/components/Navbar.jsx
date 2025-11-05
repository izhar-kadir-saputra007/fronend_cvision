import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import logo from "../assets/images/logo.png";
import AvatarButton from "./AvatarButton";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false); // Set loading ke false jika tidak ada token
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/validateToken`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.valid) {
          setIsLoggedIn(true);
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        } else {
          handleLogout();
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          handleLogout();
          navigate("/login");
        }
      } finally {
        setIsLoading(false); // Pastikan loading di-set ke false setelah validasi selesai
      }
    };

    checkAuth();

    const handleScroll = () => {
      if (window.scrollY > 5) {
        setScroll(true);
        setIsOpen(false);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/logout`);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("lamaranId");
      localStorage.removeItem("prediction");
      localStorage.removeItem("predictionUmum");
      localStorage.removeItem("savedScore");
      localStorage.removeItem("savedAnswers");
      localStorage.removeItem("isStarted");
      localStorage.removeItem("startTime");
      localStorage.removeItem("timer");
      localStorage.removeItem("hasSubmitted");
      localStorage.removeItem("hasSubmitted");
      localStorage.removeItem("isFinished");
      localStorage.removeItem("userData");
      localStorage.removeItem("userName");
      localStorage.removeItem("selectedJenisSoal");
      localStorage.removeItem("currentPage");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  const checkLoginAndRedirect = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent navigation
      handleNavigateToRegister(); // Redirect to register page
    }
  };

  let aktif =
    "text-secondary border-b-2 border-secondary font-bold px-1 sm:px-2 scale-105";
  let scrollAktif = scroll
    ? "bg-primary border-b-2 border-secondary py-1 sm:py-2 shadow-custom"
    : "";
  let menuAktif = isOpen ? "left-0" : "-left-full";

  return (
    <div
      className={`navbar fixed w-full transition-all bg-primary z-50 ${scrollAktif}`}
    >
      <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-5 md:pt-6 pb-2 sm:pb-4">
        <div className="navbar-box flex items-center justify-between">
          {/* Logo Section - Diperkecil untuk mobile */}
          <div className="logo flex items-center font-bodoni">
            <img
              src={logo}
              alt="logo"
              className="w-[30px] sm:w-[40px] md:w-[50px] -z-10" // Diperkecil di mobile
            />
            <h1 className="ml-2 md:ml-4 text-lg sm:text-xl md:text-2xl text-color3 hover:text-color2 font-bold">
              <span className="text-secondary  text-xl md:text-3xl">CV</span>
              <span className="text-color1 ">ision.</span>
            </h1>
          </div>

          {/* Menu Items */}
          <ul
            className={`flex lg:gap-12 md:static md:flex-row md:shadow-none md:bg-primary md:w-auto md:h-full md:translate-y-0 md:text-black md:p-0 md:m-auto gap-8 fixed ${menuAktif} top-1/2 -translate-y-1/2 flex-col px-14 py-16 rounded  bg-primary shadow-custom text-color3 text-lg sm:text-xl md:text-2xl  font-bold transition-all`}
          >
            {/* Home */}
            <li className="flex items-center gap-3">
              <i className="ri-home-4-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/home"
                className="font-medium text-base text-color2 hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2"
              >
                Home
              </NavLink>
            </li>

            {/* CV Prediction - Umum only */}
            <li>
              <NavLink
                to="/umumtest"
                className={({ isActive }) =>
                  `text-color2 transition-all px-2 py-2 text-base ${
                    isActive
                      ? "text-secondary border-b-2 border-secondary font-bold"
                      : "hover:text-secondary hover:border-b-2 border-transparent hover:font-bold font-medium"
                  }`
                }
              >
                CV Prediction
              </NavLink>
            </li>

            {/* Artikel */}
            <li className="flex items-center gap-3">
              <i className="ri-settings-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/artikel"
                className={({ isActive, isPending }) =>
                  `text-color2 text-base hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
               
              >
                Artikel
              </NavLink>
            </li>

            {/* Karir */}
            <li className="flex items-center gap-3">
              <i className="ri-settings-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/karir"
                className={({ isActive, isPending }) =>
                  `text-color2 text-base hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
               
              >
                Karir
              </NavLink>
            </li>

            {/* Psychotest */}
            <li className="flex items-center gap-3">
              <i className="ri-image-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/psikotest"
                className={({ isActive, isPending }) =>
                  `text-color2 text-base hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
                onClick={(e) => checkLoginAndRedirect(e, "/psikotest")}
              >
                Psikotest
              </NavLink>
            </li>

            {/* About Us */}
            <li className="flex items-center gap-3">
              <i className="ri-image-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/about"
                className={({ isActive, isPending }) =>
                  `text-color2 text-base hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
              
              >
                About Us
              </NavLink>
            </li>
          </ul>

          {/* Social/Auth Section */}
          <div className="social flex items-center gap-2 sm:gap-4">
            {isLoading ? (
              <div className="mr-2 sm:mr-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="flex items-center">
                {/* Avatar Button dengan shadow */}
                <button
                  onClick={handleMenuOpen}
                  className="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-secondary flex items-center justify-center">
                    <AvatarButton className="w-full h-full object-cover" />
                  </div>
                </button>

                {/* Menu dropdown dengan shadow yang dipertahankan */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: "12px",
                      boxShadow: "5px 5px 12px 5px rgba(0,0,0,0.9)", // Shadow dipertahankan
                      minWidth: "180px",
                      maxWidth: "calc(100vw - 32px)",
                      marginTop: "8px",
                      backgroundColor: "#070F2B",
                      color: "white",
                      padding: "8px 0",
                      "& .MuiList-root": {
                        padding: "0",
                      },
                    },
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      padding: "8px 16px",
                      minHeight: "auto",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "rgba(0, 195, 254, 0.9)",
                        color: "#070F2B",
                        margin: "0 8px",
                        borderRadius: "6px",
                        width: "calc(100% - 16px)",
                      },
                      "& svg, & i": {
                        fontSize: "1.1rem",
                        marginRight: "12px",
                        width: "20px",
                        textAlign: "center",
                      },
                    },
                    "& .MuiDivider-root": {
                      borderColor: "rgba(255, 255, 255, 0.12)",
                      margin: "6px 0",
                    },
                  }}
                  MenuListProps={{
                    "aria-labelledby": "user-menu-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-user-line" /> Profil
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/riwayat");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-history-line" /> Riwayat
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/lamaranuser");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-file-list-line" /> Lamaran Saya
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/setting");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-settings-3-line" /> Pengaturan
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleMenuClose();
                    }}
                    sx={{
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "rgba(255, 82, 82, 0.9) !important",
                        color: "#ffffff !important",
                      },
                    }}
                  >
                    <i className="ri-logout-box-r-line" /> Logout
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <NavLink
                to="/register"
                className="bg-color1 mr-1 sm:mr-4 px-3 sm:px-6 md:px-9 py-1.5 sm:py-3 rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-color1 hover:border-color1 transition-all text-sm sm:text-base shadow-custom shadow-gray-600 hover:shadow-custom4"
              >
                Sign Up
              </NavLink>
            )}
            <button
              className="md:hidden bg-primary text-secondary focus:outline-none"
              onClick={handleClick}
              aria-label="Toggle menu"
            >
              <i className="ri-menu-fold-3-fill text-2xl shadow-sm shadow-gray-400"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Navbar);
