import { useEffect, useState } from 'react';
import axios from 'axios';

const LowonganList = () => {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyStatus, setApplyStatus] = useState({}); // Untuk menyimpan status apply per lowongan

  useEffect(() => {
    const fetchLowongan = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getAllLowongan');
        setLowongan(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLowongan();
  }, []);

  const handleApply = async (lowonganId) => {
    try {
      // Kirim permintaan apply ke API
      const response = await axios.post(`http://localhost:3000/api/applyToLowongan/${lowonganId}/aply`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Asumsikan token disimpan di localStorage
        },
      });

      // Update status apply untuk lowongan yang bersangkutan
      setApplyStatus((prevStatus) => ({
        ...prevStatus,
        [lowonganId]: 'Applied successfully!', // Pesan sukses
      }));

      console.log('Apply response:', response.data);
    } catch (err) {
      console.error('Error applying to lowongan:', err);

      // Update status apply untuk lowongan yang bersangkutan
      setApplyStatus((prevStatus) => ({
        ...prevStatus,
        [lowonganId]: 'Failed to apply. Please try again.', // Pesan error
      }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Daftar Lowongan</h1>
      <div className='mt-5 text-color2'>
        {lowongan.length > 0 ? (
          <ul className='grid grid-cols-1 gap-5'>
            {lowongan.map((item) => (
              <li
                key={item.id}
                className='py-12 mb-5 hover:border-2 hover:border-secondary p-5 bg-color5 rounded-lg hover:shadow-custom3 cursor-pointer'
              >
                <h2 className='text-xl font-bold'>{item.judul}</h2>
                <p className='mt-2'>{item.deskripsi}</p>
                <p className='mt-2'><strong>Perusahaan:</strong> {item.PT.namaPT}</p>
                <p className='mt-2'><strong>Alamat:</strong> {item.PT.alamat}</p>
                <p className='mt-2'><strong>Tanggal Buka:</strong> {new Date(item.tanggalBuka).toLocaleDateString()}</p>
                <p className='mt-2'><strong>Tanggal Tutup:</strong> {new Date(item.tanggalTutup).toLocaleDateString()}</p>
                
                {/* Tombol Apply */}
                <button
                  onClick={() => handleApply(item.id)}
                  className='mt-4 px-4 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary-dark transition-colors'
                >
                  Apply
                </button>

                {/* Tampilkan status apply */}
                {applyStatus[item.id] && (
                  <p className={`mt-2 ${applyStatus[item.id].includes('Failed') ? 'text-merah' : 'text-green-500'}`}>
                    {applyStatus[item.id]}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada lowongan tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default LowonganList;