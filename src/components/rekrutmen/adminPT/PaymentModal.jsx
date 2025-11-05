// src/components/PaymentModal.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/create-payment`,
        { amount: 50000, productName: "Langganan Premium" },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Upgrade ke Premium</h2>
        <p className="mb-6 text-gray-600">
          Untuk mengakses dashboard admin PT, Anda perlu berlangganan premium seharga Rp 50.000/bulan.
        </p>
        
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            disabled={loading}
          >
            Nanti Saja
          </button>
          <button
            onClick={handlePayment}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : 'Bayar Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;