import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateJenisSoal() {
  const [formData, setFormData] = useState({
    namaJenis: '',
    deskripsi: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.namaJenis) {
      toast.error('Nama jenis soal harus diisi');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/jenis-soal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat jenis soal');
      }

      toast.success('Jenis soal berhasil dibuat!');
      setFormData({
        namaJenis: '',
        deskripsi: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-color2">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Jenis Soal Baru</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="namaJenis" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Jenis Soal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="namaJenis"
            name="namaJenis"
            value={formData.namaJenis}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Tes Logika, Tes Verbal, dll."
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deskripsi singkat tentang jenis soal ini"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? 'Menyimpan...' : 'Simpan Jenis Soal'}
        </button>
      </form>
    </div>
  );
}