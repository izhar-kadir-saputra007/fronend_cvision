import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileView = ({ onEditClick, profileData: initialProfileData }) => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [loading, setLoading] = useState(!initialProfileData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Jika tidak ada data awal, fetch dari API
    if (!initialProfileData) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getUserProfile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setProfileData(response.data.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Gagal memuat data profil');
          toast.error('Gagal memuat data profil');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [initialProfileData]);

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

  if (!profileData) return (
    <div className="text-center py-8 text-color3">
      Data tidak ditemukan
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-primary rounded-lg shadow-lg" style={{boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)"}}>
      {/* Header dengan Tombol Edit */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-color3">
        <h1 className="text-3xl font-bold text-secondary">Profil Pengguna</h1>
        <button 
          onClick={onEditClick}
          className="px-6 py-2 bg-secondary text-color5 rounded-lg hover:bg-opacity-90 transition transform hover:scale-105"
        >
          Edit Profil
        </button>
      </div>

      {/* Konten Profil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Informasi User */}
        <div className="bg-primary-dark p-6 rounded-lg">
          <h2 className="text-2xl font-semibold pb-3 mb-4 border-b border-color3 text-color3">
            Informasi Akun
          </h2>
          <div className="space-y-6 text-color2">
            <ProfileInfoItem 
              label="Nama Lengkap" 
              value={profileData.name} 
            />
            <ProfileInfoItem 
              label="Email" 
              value={profileData.email} 
            />
            <ProfileInfoItem 
              label="Nomor Telepon" 
              value={profileData.phoneNumber || '-'} 
            />
            <ProfileInfoItem 
              label="Status Akun" 
              value={`${profileData.isPremium ? 'Premium' : 'Reguler'} (${profileData.role})`} 
            />
          </div>
        </div>

        {/* Informasi Calon Karyawan */}
        <div className="bg-primary-dark p-6 rounded-lg">
          <h2 className="text-2xl font-semibold pb-3 mb-4 border-b border-color3 text-color3">
            Data Calon Karyawan
          </h2>
          <div className="space-y-6 text-color2">
            <ProfileInfoItem 
              label="Nama Lengkap" 
              value={profileData.calonKaryawan?.namaLengkap || '-'} 
            />
            <ProfileInfoItem 
              label="Alamat" 
              value={profileData.calonKaryawan?.alamat || '-'} 
            />
            <ProfileInfoItem 
              label="Tanggal Lahir" 
              value={
                profileData.calonKaryawan?.tanggalLahir 
                  ? new Date(profileData.calonKaryawan.tanggalLahir).toLocaleDateString('id-ID') 
                  : '-'
              } 
            />
            <ProfileInfoItem 
              label="Jenis Kelamin" 
              value={profileData.calonKaryawan?.jenisKelamin || '-'} 
            />
            <ProfileInfoItem 
              label="Pendidikan Terakhir" 
              value={profileData.calonKaryawan?.pendidikanTerakhir || '-'} 
            />
            <ProfileInfoItem 
              label="Jurusan" 
              value={profileData.calonKaryawan?.jurusan || '-'} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk menampilkan item informasi profil
const ProfileInfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-color4 mb-1">{label}</p>
    <p className="text-lg font-semibold break-words">{value}</p>
  </div>
);

export default ProfileView;