import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useEffect } from "react";

import PieChartUmum from "../components/PieChartUmum";

const UmumTestPage = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Memuat data prediksi dari localStorage jika tersedia
    const savedPrediction = localStorage.getItem("predictionUmum");
    if (savedPrediction) {
      setPrediction(JSON.parse(savedPrediction));
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    setPrediction(null);
    setError("");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);
  
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file); // Key "file" sesuai dengan backend
      } else {
        throw new Error("Please upload a file or enter resume text.");
      }
  
   
  
  
      // Kirim request ke endpoint predictCVUmum
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/predictCVUmum`, // Endpoint baru
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            
          },
          withCredentials: true,
        }
      );
  
      // Simpan hanya data yang diperlukan ke state
      setPrediction({
        predicted_category: response.data.prediction.posisi, // Ambil "posisi"
        probability: response.data.prediction.probability, // Ambil "probability"
        probabilities: response.data.prediction.top_5_positions, // Ambil "top_5_positions"
      });
  
      // Simpan ke localStorage
      localStorage.setItem(
        "predictionUmum",
        JSON.stringify({
          predicted_category: response.data.prediction.posisi,
          probability: response.data.prediction.probability,
          probabilities: response.data.prediction.top_5_positions,
        })
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "An error occurred while processing your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="service pt-60 flex flex-col items-center justify-center ">
        <div className="flex flex-col gap-5 items-center justify-center px-12 pb-20">
          <h1 className="text-color1 font-bold text-4xl text-center">
            {" "}
            CV ATS Checker Gratis
          </h1>
          <h1 className="text-color3">
            Tool gratis membantu Anda memeriksa apakah CV Anda dioptimalkan
            untuk applicant tracking systems (ATS).
          </h1>
        </div>
        <h1>Test</h1>
        <div className="rounded-lg border-secondary border-2 p-10 overflow-hidden shadow-custom3 pb-10">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center flex-col gap-5"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              {/* <h1 className="text-2xl font-bold mb-4">Cover photo</h1> */}
              <div className="border-2 border-dashed border-secondary p-6 rounded-lg px-24 flex flex-col items-center">
                <label className="text-color2 mb-4 font-semibold">
                  Upload a file or drag and drop
                </label>

                <label htmlFor="cv-upload" className="cursor-pointer ">
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className=" hover:bg-color3 text-color2 font-semibold py-2 px-4 rounded-lg border border-color3 shadow-md transition-all"
                  />
                </label>

                <p className="text-color3 text-sm mt-3">
                  PDF CV ATS up to 10MB
                </p>
              </div>
            </div>
            <button
              className="items-center bg-secondary px-7 py-2 text-3xl rounded-full text-primary font-semibold border-2 border-transparent hover:bg-primary hover:text-secondary hover:border-secondary transition-all shadow-custom max-w-fit hover:shadow-custom2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </form>
          <div className="flex items-center justify-center"></div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {
  prediction && (
    <div className="pt-20 mt-20 px-20 flex  flex-col items-center border-2 border-secondary overflow-hidden shadow-custom3 rounded-md ">
      <h3 className="text-color1 font-bold">
        Hasil Prediksi CV Anda :
      </h3>
      <p className="text-color2 text-2xl">
        <strong>Predicted Category:</strong>{" "}
        <span className="text-color1">
          {prediction.predicted_category}{" "}
        </span>{" "}
        ({prediction.probability})
      </p>
      {/* Gabungkan predicted_category dengan top_5_positions */}
      <div className="flex flex-col items-center text-secondary">
        
      {prediction.probabilities && typeof prediction.probabilities === "object" ? (
        <PieChartUmum
          probabilities={{
            [prediction.predicted_category]: prediction.probability, // Tambahkan predicted_category
            ...prediction.probabilities, // Gabungkan dengan top_5_positions
          }}
        />
      ) : (
        <p className="text-color2">No probabilities data available.</p>
      )}
      </div>
    </div>
  )
}
      </div>

    

      <Footer />
    </>
  );
};

export default UmumTestPage;
