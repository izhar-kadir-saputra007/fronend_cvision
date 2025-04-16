import { useState, useEffect } from "react";
import axios from "axios";

import DownloadCSVButton from "../components/DownloadCSVButton";

const Setting = () => {
  const [timerDuration, setTimerDuration] = useState(5); // Default 5 menit

  useEffect(() => {
    const fetchTimerDuration = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getTimerDuration`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTimerDuration(response.data.timerDuration);
      } catch (error) {
        console.error("Failed to fetch timer duration:", error);
      }
    };
    fetchTimerDuration();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to save the timer duration");
      return;
    }

    // Validasi timerDuration: pastikan itu angka positif
    const numericTimerDuration = Number(timerDuration); // Mengonversi ke angka

    if (isNaN(numericTimerDuration) || numericTimerDuration <= 0) {
      alert("Durasi timer harus berupa angka positif yang lebih besar dari 0");
      return;
    }

    try {
      console.log("Timer Duration:", numericTimerDuration);  // Log untuk memastikan nilai yang dikirim
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/setTimerDuration`,
        { timerDuration: numericTimerDuration }, // Kirim sebagai angka
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response);  // Log respons dari API
      alert("Timer updated successfully!");
    } catch (error) {
      console.error("Failed to update timer:", error);
      if (error.response) {
        console.log("Response error:", error.response.data); // Pastikan error yang diterima dari API tercetak
      }
    }
  };

  return (
    <div className="admin-settings mx-auto p-14 bg-white rounded-lg shadow-custom5 ">
      <h1 className="text-3xl font-semibold mb-4 text-center"></h1>

      <div className="mb-6 text-secondary text-center">
        <label className="block text-lg text-color1 font-medium mb-2" htmlFor="timerDuration">
          Timer untuk mengatur durasi ujian Psikotest <br />
           (in minutes)
        </label>
        <input
          id="timerDuration"
          type="number"
          value={timerDuration}
          onChange={(e) => setTimerDuration(e.target.value)}
          className="w-full p-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-secondary text-primary font-semibold rounded-lg hover:border-x-sidebar-hover transition duration-300"
        >
          Save
        </button>
      </div>
      <div className="flex gap-4 mt-16">
        <DownloadCSVButton type="above_60" /> {/* Untuk mengunduh data prediksi ≥60% */}
        <DownloadCSVButton type="below_60" /> {/* Untuk mengunduh data prediksi <60% */}
      </div>
    </div>
  );
};

export default Setting;
