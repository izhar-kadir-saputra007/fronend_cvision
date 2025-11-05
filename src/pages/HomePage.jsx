import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import useMobileDetect from "../../hooks/useMobileDetect";

//animasi
import AnimatedText from "../components/AnimatedTex";
import Lottie from "lottie-react";
import AVATAR from "../assets/icons/AVATAR.json";
import BlurText from "../components/reactbits/BlurText";
import DecryptedText from "../components/reactbits/DecryptedText";
import TextPressure from "../components/reactbits/TextPressure";
import ShinyText from "../components/reactbits/ShinyText";
import SplitText from "../components/reactbits/SplitText";
import ScrollReveal from "../components/reactbits/ScrollReveal";

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
  const isMobile = useMobileDetect();
// Di dalam komponen Anda, tambahkan:
const [lottieRef, lottieInView] = useInView({
  threshold: 0.2,
  triggerOnce: true
});

// Definisikan variasi animasi dengan efek blur
const lottieVariants = {
  hidden: {
    x: 100,           // Nilai lebih kecil untuk menghindari overflow
    opacity: 0,       // Mulai transparan
    filter: "blur(15px)" // Efek blur saat tersembunyi
  },
  visible: {
    x: 0,             // Bergerak ke posisi aslinya
    opacity: 1,       // Menjadi sepenuhnya terlihat
    filter: "blur(0px)", // Hapus blur
    transition: {
      x: {
        type: "spring",
        damping: 12,
        stiffness: 80,
        duration: 0.8
      },
      opacity: {
        duration: 0.6
      },
      filter: {
        duration: 1.0  // Durasi efek blur lebih lama untuk efek yang halus
      }
    }
  }
};
  const handleAnimationComplete = () => {};

  const containerRef = useRef(null);

  // Komponen Kartu Testimonial - moved outside useEffect
  const TestimonialCard = ({ image, delay, name, quote }) => {
    const [ref, inView] = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay }}
        className="grid grid-flow-row-dense bg-primary p-6 sm:p-8 lg:p-10 rounded-[30px] border-2 border-secondary hover:shadow-custom2 hover:scale-105 transition-all h-full"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col justify-center items-center">
            <motion.img
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: delay + 0.2, type: "spring" }}
              className="w-[70px] h-[70px] object-cover mb-4 rounded-full border-2 border-color1"
              alt="Profile"
              src={image}
            />
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: delay + 0.3 }}
              className="text-center font-bold text-color3 text-xl sm:text-2xl lg:text-2xl mb-4"
            >
              {name}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: delay + 0.4 }}
              className="text-color4 text-base sm:text-lg lg:text-lg text-center mb-6 lg:mb-8"
            >
              "{quote}"
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.5 }}
            className="flex flex-col items-center mt-auto"
          >
            <a
              href="https://www.instagram.com/"
              rel="noopener noreferrer"
              target="_blank"
              className="px-8 sm:px-12 lg:px-14 py-2 sm:py-2.5 bg-secondary hover:bg-color1 text-sm sm:text-base lg:text-base font-bold text-[#070f2b] hover:text-white flex items-center justify-center rounded-full shadow-md transition-all duration-300"
            >
              <i className="ri-chat-3-line mr-2"></i> Hubungi
            </a>
          </motion.div>
        </div>
      </motion.div>
    );
  };

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

    // Komponen Kartu Testimonial

  }, []);

  return (
    <>
      <Navbar />
      <div className="homepage pt-12 md:pt-20 lg:pt-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          {/* Hero Section */}
          <div className="hero xs:pt-96  flex flex-col lg:flex-row items-center py-16 lg:py-28 gap- lg:pb-52 lg:gap-0">
            <div className="box sm:mb-48 flex flex-col gap-2 lg:mr-20 w-full lg:w-auto">
              <div className="text-color1 text-xl sm:text-xl lg:text-4xl font-bold flex flex-col gap-4 lg:gap-8">
                <BlurText
                  text="Halo, selamat datang"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                  className="text-secondary mb-3 lg:mb-5"
                />
                <div className="font-lobster">
                  <AnimatedText text={userName} />
                </div>
              </div>

              <h1 className="text-secondary text-3xl sm:text-5xl lg:text-8xl font-bold mb-3 lg:mb-5 text-shadow"></h1>
              <div className="text-color3 tracking-wider text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                <h3>
                  Welcome to MindMates, your haven for mental wellness! Explore
                  resources, find support, and connect with a community
                  dedicated to well-being
                </h3>
              </div>

              <Link
                to="/register"
                className="bg-color1 px-4 sm:px-6 md:px-9 mt-4 sm:mt-6 lg:mt-12 py-1.5 sm:py-2 md:py-3 text-base sm:text-xl md:text-2xl lg:text-3xl rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-color1 hover:border-color1 hover:shadow-custom4 transition-all shadow-custom max-w-fit"
              >
                Get Started
              </Link>
            </div>
            <div className="box w-full lg:w-auto overflow-hidden">
  <motion.div
    ref={lottieRef}
    initial="hidden"
    animate={lottieInView ? "visible" : "hidden"}
    variants={lottieVariants}
    style={{ cursor: "pointer" }} 
    className="mx-auto lg:max-0"
  >
    <Lottie 
      animationData={AVATAR} 
      loop={true} 
    />
  </motion.div>
</div>
          </div>

          <div className="alasan flex flex-col lg:grid lg:grid-cols-2">
            {/* Gambar - Hanya muncul di desktop (lg ke atas) */}
            <div className="hidden lg:flex flex-col gap-2 mr-20">
              <img
                src={hero2}
                alt="hero image"
                className="w-[400px] md:w-[400px] mx-auto"
              />
            </div>

            {/* Konten Teks - Tampil di semua ukuran */}
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 leading-relaxed px-4 sm:px-0">
              <h1 className="text-secondary text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-2">
                <br />
                <SplitText
                  text="Kenapa Harus Menggunakan "
                  className="text-secondary text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold"
                  delay={150}
                  animationFrom={{
                    opacity: 0,
                    transform: "translate3d(0,50px,0)",
                  }}
                  animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                  easing="easeOutCubic"
                  threshold={0.2}
                  rootMargin="-50px"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
                <span className="text-secondary font-bodoni">
                  CV<span className="text-color1">ision</span> ?
                </span>
              </h1>
              <p className="text-color3 sm:tracking-widest text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-justify sm:text-left">
                Layanan kami yang didukung oleh{" "}
                <span className="text-color1">MACHINE LEARNING</span> untuk
                menganalisis dan memprediksi kecocokan CV Anda dengan berbagai
                lowongan pekerjaan. Hasilnya akan memberikan wawasan mendalam
                serta rekomendasi yang dipersonalisasi untuk membantu Anda
                menemukan peluang kerja
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6 lg:mt-12"> 
              <Link
                to="/register"
                className="bg-secondary px-4 sm:px-6 md:px-8 lg:px-10 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-base sm:text-xl md:text-2xl lg:text-3xl rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-secondary hover:border-secondary transition-all duration-300 shadow-custom hover:shadow-custom2 max-w-fit mx-auto sm:mx-0"
              >
                Start Test
              </Link>
              </div>
              
            </div>
          </div>

           {/* Testimonial Section */}
      <div className="flex flex-col items-center w-full h-auto py-10 mt-36 lg:mt-52 mb-36">
        <div className="w-full h-auto">
          {/* Title */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center grid grid-flow-row gap-6 lg:gap-10 text-2xl sm:text-3xl lg:text-4xl mb-12 lg:mb-20"
          >
            <ShinyText
              text="Testimony"
              disabled={false}
              delay={0.3}
              speed={3}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl sm:text-2xl lg:text-2xl mb-12 lg:mb-24"
            >
              <h1 className="text-color2">
                Kisah Sukses Bagaimana <br /> 
                <span className="text-color1">Machine Learning</span>{" "}
                Membantu Menemukan Pekerjaan yang Tepat
              </h1>
            </motion.div>
          </motion.div>

          {/* Testimonial Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 m-auto">
            <TestimonialCard 
              image={testimony1}
              delay={ isMobile ? 0.8 : 0.8}
              name="John Doe"
              quote="Sangat membantu meningkatkan CV saya. Dalam 2 minggu dapat 5 interview!"
            />
            
            <TestimonialCard 
              image={testimony2}
              delay={isMobile ? 0.8 : 1.6}
              name="Jane Smith"
              quote="Analisisnya sangat detail. Saya akhirnya diterima di perusahaan impian!"
            />
            
            <TestimonialCard 
              image={testimony3} 
              delay={ isMobile ? 0.8 : 2.4}
              name="Robert Johnson"
              quote="Prediksi kecocokan pekerjaannya akurat. Sekarang kerja di bidang yang saya sukai."
            />
            
            <TestimonialCard 
              image={testimony3}
              delay={isMobile ? 1 : 3.2}
              name="Sarah Williams"
              quote="Dari yang awalnya tidak percaya diri, sekarang dapat pekerjaan dengan gaji 2x lipat."
            />
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
