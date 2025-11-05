import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import AboutImage from "../assets/images/testimoni3.png";
import TrueFocus from "../components/reactbits/TrueFocus";

// Hook untuk mendeteksi device mobile
const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const About = () => {
  const isMobile = useMobileDetect();
  const [headerRef, headerInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Variasi animasi container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2, // Lebih cepat di mobile
        delayChildren: isMobile ? 0.2 : 0.3
      }
    }
  };

  // Fungsi untuk menentukan arah animasi card
  const getCardDirection = (index) => {
    if (!isMobile) return { y: 50 }; // Desktop: animasi dari bawah
    
    // Mobile: animasi dari samping, tapi dengan nilai yang lebih kecil
    return index % 2 === 0 ? { x: -50 } : { x: 50 };
  };

  // Variasi animasi item
  const itemVariants = (index) => ({
    hidden: { 
      ...getCardDirection(index), // Menggunakan arah yang sesuai
      opacity: 0 
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: isMobile ? 0.8 : 0.6, // Sedikit lebih cepat di mobile
        ease: "easeOut"
      }
    }
  });

  return (
    <div className="about px-4 sm:px-6 lg:px-8 overflow-x-hidden w-full">
      {/* Header Section */}
      <motion.div 
        ref={headerRef}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="box text-center grid grid-flow-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-12 sm:mt-24 md:mt-36 lg:mt-48 mb-10 sm:mb-16 md:mb-20"
      >
        <motion.div variants={itemVariants(0)}>
          <TrueFocus 
            sentence="Our Team"
            manualMode={false}
            blurAmount={isMobile ? 3 : 5}
            borderColor="#00C3FE"
            animationDuration={isMobile ? 1 : 2}
            pauseBetweenAnimations={isMobile ? 0.5 : 1}
            fontColor="#FFE100"
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
          />
        </motion.div>

        <motion.h1 
          variants={itemVariants(0)}
          className="text-base sm:text-xl md:text-2xl lg:text-3xl text-color2"
        >
          Manage your entire community in a single system
        </motion.h1>
        
        <motion.small 
          variants={itemVariants(0)}
          className="text-xs sm:text-sm text-[#9E9E9E] mb-12 sm:mb-24 md:mb-36"
        >
          Manage your entire community in a single system
        </motion.small>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-14 lg:gap-20 mx-auto max-w-7xl overflow-hidden">
        {[0, 1, 2].map((index) => {
          const [cardRef, cardInView] = useInView({
            threshold: 0.1,
            triggerOnce: true
          });

          return (
            <motion.div 
              key={index}
              ref={cardRef}
              initial="hidden"
              animate={cardInView ? "visible" : "hidden"}
              variants={itemVariants(index)}
              className="grid grid-flow-row-dense bg-color3 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[30px] border-2 hover:border-secondary transition-all h-full"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col items-center text-center">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={cardInView ? { scale: 1 } : {}}
                    transition={{ 
                      delay: isMobile ? 0.8 : 0.8,
                      type: isMobile ? "tween" : "spring"
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full border-2 border-primary mb-4"
                    alt="Team member"
                    src={AboutImage}
                  />
                  
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={cardInView ? { opacity: 1 } : {}}
                    transition={{ delay: isMobile ? 1.2 : 1.2 }}
                    className="font-bold text-primary text-xl sm:text-2xl mb-3"
                  >
                    Your Well Wisher
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={cardInView ? { opacity: 1 } : {}}
                    transition={{ delay: isMobile ? 1.6 : 1.6 }}
                    className="text-color2 text-sm sm:text-base mb-6 leading-relaxed"
                  >
                    Simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry standard dummy text ever 
                    since the 1500s.
                  </motion.p>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={cardInView ? { opacity: 1 } : {}}
                  transition={{ delay: isMobile ? 0.4 : 0.8 }}
                  className="flex justify-center"
                >
                  <a
                    href="https://www.instagram.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-color3 px-6 sm:px-8 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-full shadow-md transition-colors duration-300 flex items-center"
                  >
                    <i className="ri-chat-3-line mr-2 text-color3"></i>
                    Start Chat
                  </a>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default About;