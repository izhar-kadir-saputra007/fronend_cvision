import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import PropTypes from 'prop-types'; // Impor PropTypes untuk validasi

const AnimatedText = ({ text = "" }) => {
  const [isReady, setIsReady] = useState(false); // State untuk menunggu penundaan
  const defaultText = "di web kami, web rekrutmen karyawan berbasis machine learning"; // Text default

  // Menunda efek animasi dengan useEffect dan setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true); // Mengubah isReady menjadi true setelah penundaan
    }, 2000); // Penundaan 2 detik, bisa disesuaikan sesuai kebutuhan

    // Membersihkan timer jika komponen dibersihkan
    return () => clearTimeout(timer);
  }, []);

  // Menentukan text yang akan digunakan
  const displayText = text === "" ? defaultText : text; // Jika text kosong, pakai defaultText

  return (
    <div>
      {/* Render hanya jika isReady bernilai true */}
      {isReady && (
        <TypeAnimation
          sequence={[
            // Urutan teks jika text kosong
            text === "" && `Web kami`, 
            text === "" && 2000, 
            text === "" && `Web : rekrutmen`, 
            text === "" && 2000, 
            text === "" && `Web : karyawan`, 
            text === "" && 2000, 
            text === "" && `Web : berbasis`, 
            text === "" && 2000, 
            text === "" && `Web : Machine Learning`, 
            text === "" && 2000, 
            
            // Urutan teks jika text ada isinya
            text !== "" && `> ${displayText} <`,
            text !== "" && 2000,
            text !== "" && ` ~ ${displayText} ~`,
            text !== "" && 2000,
          ].filter(Boolean)} 
          wrapper="span"
          speed={200} // Kecepatan pengetikan
          style={{ fontSize: '2em', display: 'inline-block' }} // Gaya inline
          repeat={Infinity} // Animasi berulang terus menerus
        />
      )}
    </div>
  );
};

// Menambahkan validasi props menggunakan PropTypes
AnimatedText.propTypes = {
  text: PropTypes.string, // Memastikan 'text' adalah tipe string
};

export default AnimatedText;
