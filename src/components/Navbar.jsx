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
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

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
    "text-secondary border-b-2 border-secondary font-bold  px-2 scale-105";
  let scrollAktif = scroll
    ? " bg:primary border-b-2 border-secondary py-2 shadow-custom"
    : "";
  let menuAktif = isOpen ? "left-0" : "-left-full";

  return (
    <div
      className={`navbar fixed w-full transition-all bg-primary z-50 ${scrollAktif}`}
    >
      <div className="container mx-auto px-6 pt-7 pb-5">
        <div className="navbar-box flex items-center justify-between">
          <div className="logo flex items-center justify-between">
            <img src={logo} alt="logo" className="w-[50px] -z-10" />
            <h1 className="md:ml-4 sm:text-2xl text-color3 text-xl hover:text-color2 font-bold">
              <span className="text-secondary font-bodoni text-3xl">CV</span>
              <span className="text-color1 font-bodoni">ision.</span>
            </h1>
          </div>
          <ul
            className={`flex lg:gap-12 md:static md:flex-row md:shadow-none md:bg-primary md:w-auto md:h-full md:translate-y-0 md:text-black md:p-0 md:m-auto gap-8 fixed ${menuAktif} top-1/2 -translate-y-1/2 flex-col px-8 py-6 rounded shadow-xl bg-secondary font-bold text-color2 transition-all`}
          >
            {/* Home */}
            <li className="flex items-center gap-3">
              <i className="ri-home-4-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/home"
                className="font-medium text-color2 hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2"
              >
                Home
              </NavLink>
            </li>

            {/* Dropdown Service */}
            <li
              className="relative group"
              onMouseEnter={() => setIsOpenDropDown(true)}
              onMouseLeave={() => setIsOpenDropDown(false)}
            >
              <NavLink
                to="#"
                className={`text-color2 transition-all px-2 py-2 ${
                  isOpenDropDown
                    ? "text-secondary border-b-2 border-secondary font-bold"
                    : "hover:text-secondary hover:border-b-2 border-transparent hover:font-bold font-medium"
                }`}
              >
                CV Prediction
              </NavLink>

              {/* Dropdown Menu */}
              {isOpenDropDown && (
                <div
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-md shadow-primary ring-1 ring-secondary ring-opacity-50 focus:outline-none transition-all scale-100 opacity-100"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <NavLink
                      to="/test"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-color2 transition-all ${
                          isActive
                            ? "text-secondary font-bold border-b-2 border-secondary"
                            : "hover:text-secondary hover:border-b-2 border-transparent hover:font-bold"
                        }`
                      }
                      onClick={(e) => {
                        setIsOpenDropDown(false);
                        checkLoginAndRedirect(e, "/test");
                      }}
                    >
                      Khusus
                    </NavLink>
                    <NavLink
                      to="/umumtest"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-color2 transition-all ${
                          isActive
                            ? "text-secondary font-bold border-b-2 border-secondary"
                            : "hover:text-secondary hover:border-b-2 border-transparent hover:font-bold"
                        }`
                      }
                      onClick={() => {
                        setIsOpenDropDown(false);
                      }}
                    >
                      Umum
                    </NavLink>
                  </div>
                </div>
              )}
            </li>

            {/* Artikel */}
            <li className="flex items-center gap-3">
              <i className="ri-settings-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/artikel"
                className={({ isActive, isPending }) =>
                  `text-color2 hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
                onClick={(e) => checkLoginAndRedirect(e, "/artikel")}
              >
                Artikel
              </NavLink>
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-settings-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/karir"
                className={({ isActive, isPending }) =>
                  `text-color2 hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
                onClick={(e) => checkLoginAndRedirect(e, "/artikel")}
              >
                Karir
              </NavLink>
            </li>

            {/* Contact */}
            <li className="flex items-center gap-3">
              <i className="ri-image-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/psikotest"
                className={({ isActive, isPending }) =>
                  `text-color2 hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
                onClick={(e) => checkLoginAndRedirect(e, "/psikotest")}
              >
                Psychotest
              </NavLink>
            </li>

            {/* About Us */}
            <li className="flex items-center gap-3">
              <i className="ri-image-line text-3xl md:hidden text-color2"></i>
              <NavLink
                to="/about"
                className={({ isActive, isPending }) =>
                  `text-color2 hover:text-secondary hover:border-b-2 border-secondary hover:font-bold transition-all hover:scale-105 hover:px-2 ${
                    isActive ? aktif : isPending ? "" : "font-medium"
                  }`
                }
                onClick={(e) => checkLoginAndRedirect(e, "/about")}
              >
                About Us
              </NavLink>
            </li>
          </ul>

          <div className="social flex items-center gap-4">
            {isLoading ? (
              // Tampilkan placeholder/skeleton selama loading
              <div className="mr-4 w-24 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isLoggedIn ? (
              <div>
                <AvatarButton onClick={handleMenuOpen} />   
                {/* Menu dropdown */}
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
                      boxShadow: "2px 2px 12px 5px rgba(0,0,0,0.5)",
                      minWidth: "180px",
                      marginTop: "8px",
                      bgcolor: "#070F2B",
                      color: "white",
                      padding: "4px 8px",
                    },
                    "& .MuiMenuItem-root": {
                      borderRadius: "8px",
                      margin: "2px 0",
                      padding: "8px 12px",
                      "&:hover": {
                        backgroundColor: "#00C3FE",
                        color: "#070F2B",
                        width: "calc(100% - 16px)",
                        fontWeight: "bold", 
                        marginLeft: "8px",
                        marginRight: "8px",
                      },
                    },
                    "& .MuiDivider-root": {
                      borderColor: "rgba(233, 237, 255, 0.2)",
                      margin: "4px 8px",
                      width: "calc(100% - 16px)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-user-line mr-2" /> Profil
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/riwayat");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-history-line mr-2" /> Riwayat
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/lamaranuser");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-file-list-line mr-2" /> Lamaran Saya
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/setting");
                      handleMenuClose();
                    }}
                  >
                    <i className="ri-settings-3-line mr-2" /> Pengaturan
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleMenuClose();
                    }}
                    sx={{
                      color: "white !important",
                      "&:hover": {
                        backgroundColor: "#ff5252 !important",
                        color: "white",
                        width: "calc(100% - 16px)",
                        marginLeft: "8px",
                        marginRight: "8px",
                        
                      },
                    }}
                  >
                    <i className="ri-logout-box-r-line mr-2" /> Logout
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <NavLink
                to="/register"
                className="bg-color1 mr-4 px-9 py-3 rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-color1 hover:border-color1 hover:shadow-custom4 transition-all shadow-custom text-xl"
              >
                Sign Up
              </NavLink>
            )}
            <i
              className="ri-menu-fold-3-fill text-3xl md:hidden block text-secondary"
              onClick={handleClick}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Navbar);
