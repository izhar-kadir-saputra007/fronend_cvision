import axios from 'axios';

// Ganti dengan URL API backend Anda
const API_URL = 'http://localhost:3000/api/users';

// Fungsi untuk mendapatkan token dari localStorage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Token disimpan dengan key 'accessToken'
};

const axiosInstance = axios.create();

// Menambahkan interceptor untuk menambahkan header Authorization ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Mengambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Menambahkan header Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Menangani error request
  }
);

// Fungsi untuk mengambil semua pengguna
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(API_URL); // Menggunakan axiosInstance untuk request
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error); // Menangani error
    throw error; // Melemparkan error agar bisa ditangani di tempat lain
  }
};

// Fungsi untuk mengambil pengguna berdasarkan ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`); // Request berdasarkan ID
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error); // Menangani error
    throw error;
  }
};

// Fungsi untuk membuat pengguna baru
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/create`, userData); // Request POST untuk membuat pengguna
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error); // Menangani error
    throw error;
  }
};

// Fungsi untuk memperbarui data pengguna berdasarkan ID
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/update/${id}`, userData); // Request PUT untuk memperbarui data
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error); // Menangani error
    throw error;
  }
};

// Fungsi untuk menghapus pengguna berdasarkan ID
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/delete/${id}`); // Request DELETE untuk menghapus pengguna
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error); // Menangani error
    throw error;
  }
};
