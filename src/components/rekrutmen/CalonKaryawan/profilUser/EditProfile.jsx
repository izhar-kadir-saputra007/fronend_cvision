import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProfile = ({ onCancel, onSaveSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    alamat: '',
    tanggalLahir: '',
    jenisKelamin: '',
    pendidikanTerakhir: '',
    jurusan: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi form dengan data awal
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phoneNumber: initialData.phoneNumber || '',
        alamat: initialData.calonKaryawan?.alamat || '',
        tanggalLahir: initialData.calonKaryawan?.tanggalLahir 
          ? new Date(initialData.calonKaryawan.tanggalLahir).toISOString().split('T')[0]
          : '',
        jenisKelamin: initialData.calonKaryawan?.jenisKelamin || '',
        pendidikanTerakhir: initialData.calonKaryawan?.pendidikanTerakhir || '',
        jurusan: initialData.calonKaryawan?.jurusan || ''
      });
      setLoading(false);
    } else {
      // Jika tidak ada initialData, fetch dari API
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:3000/api/getUserProfile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const { name, phoneNumber, calonKaryawan } = response.data.data;
          setFormData({
            name,
            phoneNumber: phoneNumber || '',
            alamat: calonKaryawan?.alamat || '',
            tanggalLahir: calonKaryawan?.tanggalLahir 
              ? new Date(calonKaryawan.tanggalLahir).toISOString().split('T')[0]
              : '',
            jenisKelamin: calonKaryawan?.jenisKelamin || '',
            pendidikanTerakhir: calonKaryawan?.pendidikanTerakhir || '',
            jurusan: calonKaryawan?.jurusan || ''
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Gagal memuat data profil');
          toast.error('Gagal memuat data profil');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3000/api/editProfile', 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Profil berhasil diperbarui');
      onSaveSuccess(response.data.data); // Kirim data terbaru ke parent component
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memperbarui profil';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-4">{error}</div>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-secondary text-color5 rounded hover:bg-opacity-90 transition"
      >
        Coba Lagi
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-primary rounded-lg" style={{boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)"}}>
      <h1 className="text-2xl font-bold text-secondary mb-6">Edit Profil</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informasi User */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-color3">Informasi Akun</h2>
            
            <div>
              <label className="block text-color4 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-color4 mb-1">Nomor Telepon</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                pattern="[0-9]{10,13}"
                title="Nomor telepon harus 10-13 digit angka"
              />
            </div>
          </div>

          {/* Informasi Calon Karyawan */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-color3">Data Calon Karyawan</h2>
            
            <div>
              <label className="block text-color4 mb-1">Alamat</label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-color4 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-color4 mb-1">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-color4 mb-1">Pendidikan Terakhir</label>
              <select
                name="pendidikanTerakhir"
                value={formData.pendidikanTerakhir}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="">Pilih Pendidikan</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-color4 mb-1">Jurusan</label>
              <input
                type="text"
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-secondary text-color5 rounded hover:bg-opacity-90 transition disabled:bg-opacity-50 flex items-center justify-center"
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;