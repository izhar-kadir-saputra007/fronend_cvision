import { useEffect, useState } from 'react';
import axios from 'axios';
import LamaranCard from "../MUI/LamaranDropdown"; // Sesuaikan path-nya

const LamaranList = () => {
  const [lamaranData, setLamaranData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLamaranData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token tidak ditemukan. Silakan login kembali.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getLamaranForUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setLamaranData(response.data.data);
        } else {
          setError('Data tidak valid');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLamaranData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="lamaran-list">
      <h1 className="text-2xl font-bold mb-8 text-color3">Daftar Lamaran Saya</h1>
      {lamaranData?.length > 0 ? (
        lamaranData.map((lamaran) => (
          <div key={lamaran.id} className="mb-10 lamaran-item bg-primary p-6 px-10 text-color2 rounded-lg shadow-md hover:scale-105 transition-all ease-in-out" style={{boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)"}}>
          <h2 className="text-xl font-semibold mb-2 text-secondary">{lamaran.Lowongan?.judul}</h2>
          <p>Perusahaan:{lamaran.Lowongan?.PT?.namaPT}</p>
          <p>Status: <strong><span className='text-color3'>{lamaran.status}</span></strong></p>
          <div className='mt-3'>
            <LamaranCard lamaranId={lamaran.id} />  {/* Pastikan ini mengirim lamaranId */}
          </div>
        </div>
        ))
      ) : (
        <p>Tidak ada data lamaran.</p>
      )}
    </div>
  );
};

export default LamaranList;