import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";

//animasi
import AnimatedText from "../components/AnimatedTex";
import Lottie from "lottie-react";
import AVATAR from "../assets/icons/AVATAR.json";
import BlurText from "../components/reactbits/BlurText";
import DecryptedText from "../components/reactbits/DecryptedText";
import TextPressure from "../components/reactbits/TextPressure";
import ShinyText from "../components/reactbits/ShinyText";
import SplitText from "../components/reactbits/SplitText";
import ScrollReveal from '../components/reactbits/ScrollReveal';


import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "../components/About";

import hero2 from "../assets/images/hero2.png";
import testimony1 from "../assets/images/testimo1.png";
import testimony2 from "../assets/images/testimoni2.png";
import testimony3 from "../assets/images/testimoni3.png";
import Artikel from "../components/Artikel";


import { setupLordIcon } from "../components/setupLordIcon";

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAnimationComplete = () => {
   
  };

  const containerRef = useRef(null);

  useEffect(() => {
    // Fungsi untuk mengambil data pengguna dari API
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; 
        const userName = decodedToken.name; 

        // Periksa apakah userId dan userName tersedia
        if (!userId || !userName) {
          console.error("Token tidak berisi ID pengguna atau nama.");
          setIsLoggedIn(false);
          return;
        }

        // Ambil data pengguna dari backend API
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserName(response.data.name);
        localStorage.setItem("userName", response.data.name);
       
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();

    setupLordIcon();
  }, []);

  return (
    <>
      <Navbar />
      <div className="homepaga">
        <div className="container mx-auto px-20">
          <div className="hero grid grid-cols-2 items-center py-28 pb-60">
            <div className="box flex flex-col gap-2 mr-20">
              <div className="text-color1 text-4xl font-bold flex flex-col gap-8">
                <BlurText
                  text="Halo, selamat datang"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                  className="text-secondary mb-5"
                />
                <div className="font-lobster">
                  <AnimatedText text={userName} />
                </div>
              </div>

              <h1 className="text-secondary lg:text-8xl text-3xl font-bold mb-5 text-shadow"></h1>
              <div>
                <DecryptedText
                  text="Welcome to MindMates, your haven for mental wellness! Explore resources, find support, and connect with a community dedicated to well-being"
                  speed={40}
                  maxIterations={10}
                  className="text-color3 tracking-widest lg:text-3xl text-2xl mb-10"
                  parentClassName="all-letters"
                  encryptedClassName="encrypted"
                  useOriginalCharsOnly={true}
                />
              </div>

              <Link
                to="/register"
                className="bg-color1 px-9 mt-12 py-3 text-3xl rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-color1 hover:border-color1 hover:shadow-custom4 transition-all shadow-custom max-w-fit"
              >
                Get Started
              </Link>
            </div>
            <div className="box">
              <div style={{ cursor: "pointer" }}>
                <Lottie animationData={AVATAR} loop={true} />
              </div>
            </div>
          </div>

          {/* ALASAN */}
          <div className="alasan hero grid grid-cols-2">
            <div className="box flex flex-col gap-2 mr-20">
              <img
                src={hero2}
                alt="hero iamge"
                className="md:w-[550px] w-[450px] mx-auto"
              />
            </div>
            <div className="box flex flex-col gap-10 leading-relaxed">
              <h1 className="text-secondary lg:text-8xl text-3xl font-bold mb-2">
                <br />
            <SplitText
  text="Kenapa Harus Menggunakan "
  className="text-secondary lg:text-8xl text-3xl font-bold"
  delay={150}
  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
  easing="easeOutCubic"
  threshold={0.2}
  rootMargin="-50px"
  onLetterAnimationComplete={handleAnimationComplete}
/>
                <span className="text-secondary font-bodoni">CV<span className="text-color1">ision</span> ?</span>{" "}
              </h1>
              <p className="text-color3 tracking-widest lg:text-3xl text-2xl mb-10">Layanan kami yang didukung oleh{" "} <span className="text-color1">MACHINE LEARNING</span>{" "}
              untuk menganalisis dan memprediksi kecocokan CV Anda dengan berbagai lowongan pekerjaan. Hasilnya akan memberikan wawasan mendalam serta rekomendasi yang dipersonalisasi untuk membantu Anda menemukan peluang kerja</p>
             
            
              <Link
                to="/register"
                className="bg-secondary px-11 py-3 text-3xl rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-secondary hover:border-secondary transition-all shadow-custom max-w-fit hover:shadow-custom2 "
              >
                Start Test
              </Link>
            </div>
          </div>

          {/* Testimonial */}
          <div className="flex flex-col items-center w-full h-auto py-10 mt-12">
            <div className="w-full h-auto">
              {/* Title */}
              <div className="text-center grid grid-flow-row gap-10 text-4xl mb-20">
                <ShinyText
                  text="Testimony"
                  disabled={false}
                  speed={3}
                  className=" text-4xl font-extrabold"
                />
                {/* <GradientText
  colors={["#40ffaa", "#FFffff", "#40ffaa"]}
  animationSpeed={2}
  showBorder={true}
  className="text-color1 font-extrabold"
>
  Add a splash of color!
</GradientText> */}
                <div className="text-2xl mb-24">
                  <h1 className="text-color2 ">
                    {" "}
                    Kisah Sukses Bagaimana  <br />{" "}
                    <span className="text-color1">Machine Learning</span>{" "}
                    Membantu Menemukan Pekerjaan yang Tepat
                  </h1>
                </div>
              </div>

              {/* Testimonial Container */}
              <div className="grid grid-cols-4 gap-10 m-auto ">
                {/* Box 1 */}
                <div className="grid grid-flow-row-dense bg-primary p-10 rounded-[30px] border-2 border-secondary hover:shadow-custom2 hover:scale-105 transition-all h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col justify-center items-center">
                      <img
                        className="w-[50px] object-cover mb-4 rounded-full"
                        alt="Ellipse"
                        src={testimony1}
                      />
                      <h3 className="text-center font-normal text-color3 text-4xl mb-4">
                        Your Well Wisher
                      </h3>
                      <p className="text-color4 text-xl text-center mb-8">
                        Simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry standard
                        dummy text ever since the 1500s.
                      </p>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                      <a
                        href="https://www.instagram.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="px-20 py-3 bg-secondary text-lg font-bold text-[#070f2b] flex items-center justify-center rounded-[30px] shadow-md"
                      >
                        Start Chat
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-flow-row-dense bg-primary p-10 rounded-[30px] border-2 border-secondary hover:shadow-custom2 hover:scale-105 transition-all h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col justify-center items-center">
                      <img
                        className="w-[50px] object-cover mb-4 rounded-full"
                        alt="Ellipse"
                        src={testimony1}
                      />
                      <div className="text-center font-semibold text-color3 text-[26px] mb-4">
                        Your Well Wisher
                      </div>
                      <p className="text-color4 text-xl text-center mb-8">
                        Simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry standard
                        dummy text ever since the 1500s.
                      </p>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                      <a
                        href="https://www.instagram.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="px-20 py-3 bg-secondary text-lg font-bold text-[#070f2b] flex items-center justify-center rounded-[30px] shadow-md"
                      >
                        Start Chat
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-flow-row-dense bg-primary p-10 rounded-[30px] border-2 border-secondary hover:shadow-custom2 hover:scale-105 transition-all h-full">
                  {/* box 2 */}
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col justify-center items-center">
                      <img
                        className="w-[50px] object-cover mb-4 rounded-full"
                        alt="Ellipse"
                        src={testimony2}
                      />
                      <div className="text-center font-semibold text-color3 text-[26px] mb-4">
                        Your Well Wisher
                      </div>
                      <p className="text-color4 text-xl text-center mb-8">
                        Simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry standard
                        dummy text ever since the 1500s.
                      </p>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                      <a
                        href="https://www.instagram.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="px-20 py-3 bg-secondary text-lg font-bold text-[#070f2b] flex items-center justify-center rounded-[30px] shadow-md"
                      >
                        Start Chat
                      </a>
                    </div>
                  </div>
                </div>

                {/* box 3 */}
                <div className="grid grid-flow-row-dense bg-primary p-10 rounded-[30px] border-2 border-secondary hover:shadow-custom2 hover:scale-105 transition-all h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col justify-center items-center">
                      <img
                        className="w-[50px] object-cover mb-4 rounded-full"
                        alt="Ellipse"
                        src={testimony3}
                      />
                      <div className="text-center font-semibold text-color3 text-[26px] mb-4">
                        Your Well Wisher
                      </div>
                      <p className="text-color4 text-xl text-center mb-8">
                        Simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry standard
                        dummy text ever since the 1500s.
                      </p>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                      <a
                        href="https://www.instagram.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="px-20 py-3 bg-secondary text-lg font-bold text-[#070f2b] flex items-center justify-center rounded-[30px] shadow-md"
                      >
                        Start Chat
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <About />
          <Artikel />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
