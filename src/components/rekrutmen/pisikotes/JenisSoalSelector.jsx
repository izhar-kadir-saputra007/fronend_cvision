import { useState, useEffect } from "react";
import axios from "axios";

const JenisSoalSelector = ({ onStartTest, lamaranId }) => {
  const [jenisSoal, setJenisSoal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        const endpoint = lamaranId
          ? `${import.meta.env.VITE_BASE_URL}/api/getJenisSoalByLamaranId/${lamaranId}`
          : `${import.meta.env.VITE_BASE_URL}/api/getJenisSoalByUserId`;
        
        const url = `${endpoint}?t=${Date.now()}`;
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal
        });

        if (response.data?.data) {
          setJenisSoal(response.data.data);
        } else {
          throw new Error("Data format tidak valid");
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching jenis soal:", err);
          setError(err.message || 
            (lamaranId 
              ? "Gagal memuat tes yang perlu dikerjakan" 
              : "Gagal memuat daftar tes")
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [lamaranId, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  if (loading) {
    return (
      <div className="bg-color4 shadow-lg rounded-lg p-6 border border-color4">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
        </h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-color4 shadow-lg rounded-lg p-6 border border-color4">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
        </h2>
        <div className="text-red-500 p-4 text-center">
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (jenisSoal.length === 0) {
    return (
      <div className="bg-color4 shadow-lg rounded-lg p-6 border border-color4">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
        </h2>
        <div className="text-gray-500 p-4 text-center">
          {lamaranId 
            ? "Tidak ada tes yang perlu dikerjakan untuk lamaran ini"
            : "Tidak ada tes yang tersedia saat ini"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-color4 shadow-lg rounded-lg p-6 border border-color4">
      <h2 className="text-xl font-semibold text-primary mb-4">
        {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
      </h2>
      <div className="grid gap-4">
        {jenisSoal.map((jenis) => (
          <button
            key={jenis.id}
            onClick={() => onStartTest(jenis.id)}
            className="p-4 border text-color2 border-primary rounded-lg hover:bg-secondary hover:text-white transition-all text-left"
          >
            <h3 className="font-semibold text-lg">{jenis.namaJenis}</h3>
            <p className="text-sm text-gray-600">
              {jenis.deskripsi || "Klik untuk memulai tes"}
            </p>
            {jenis.durasi && (
              <p className="text-xs text-gray-500 mt-1">
                Durasi: {jenis.durasi} menit
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JenisSoalSelector;