// src/components/PremiumCheck.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentModal from './PaymentModal';
import { toast } from 'react-toastify';

const PremiumCheck = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/check-premium`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setIsPremium(response.data.isPremium);
        if (!response.data.isPremium) {
          setShowPaymentModal(true);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal memeriksa status premium');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {isPremium ? children : null}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => {
          setShowPaymentModal(false);
          navigate('/');
        }} 
      />
    </>
  );
};

export default PremiumCheck;