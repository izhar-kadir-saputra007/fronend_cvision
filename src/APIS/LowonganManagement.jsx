
import axios from 'axios'
import { toast } from 'react-toastify'

const getToken = () => {
  return localStorage.getItem('token')
}

// Perbaikan: Gunakan template literal atau concatenation yang benar
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`, // Perhatikan tanda backtick dan slash
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  },
})

// Interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data.message || 'An error occurred'
      toast.error(message)
    } else {
      toast.error('Network error. Please try again.')
    }
    return Promise.reject(error)
  }
)

// Fungsi-fungsi API tetap sama
/**
 * Membuat lowongan baru beserta jenis soal terkait
 * @param {object} lowonganData - Data lowongan { judul, deskripsi, tanggalTutup }
 * @param {array} jenisSoalIds - Array ID jenis soal yang dipilih
 * @returns Promise
 */
export const createLowonganWithJenisSoal = async (lowonganData, jenisSoalIds) => {
  try {
    // Step 1: Buat lowongan
    const lowonganResponse = await api.post('/createLowongan', {
      ...lowonganData,
      jenisSoalIds // Kirim sekaligus ke backend
    });
    
    // Step 2: Jika backend tidak handle relasi, gunakan endpoint terpisah
    // const lowonganId = lowonganResponse.data.data.id;
    // if (jenisSoalIds?.length > 0) {
    //   await api.post(`/lowongan/${lowonganId}/jenis-soal`, { jenisSoalIds });
    // }
    
    return lowonganResponse;
  } catch (error) {
    console.error('Error in createLowonganWithJenisSoal:', error);
    throw error;
  }
};

/**
 * Mendapatkan semua jenis soal yang tersedia
 * @returns Promise
 */
export const getAllJenisSoal = async () => {
  try {
    const response = await api.get('/getAllJenisSoal');
    return response;
  } catch (error) {
    console.error('Error getting jenis soal:', error);
    throw error;
  }
};
export const getAllJenisSoalWithSoal = async () => {
  try {
    const response = await api.get('/getAllJenisSoalWithSoal');
    return response;
  } catch (error) {
    console.error('Error getting jenis soal:', error);
    throw error;
  }
};

export const addJenisSoalToLowongan = async (lowonganId, jenisSoalIds) => {
  return api.post(`/addJenisSoalToLowongan/${lowonganId}/jenis-soal`, { jenisSoalIds })
}

export const getLowonganForAdminPT = async () => {
  return api.get('/getLowonganForAdminPT')
}

export const getPelamarByPT = async () => {
  return api.get('/getPelamarByPT')
}

export const getUsersByLowongan = async (lowonganId) => {
  return api.get(`/getUsersByLowongan/${lowonganId}`)
}

export default api