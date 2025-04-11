import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PremiumPayment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/createPremiumUser', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Asumsikan token disimpan di localStorage
        },
      });

      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url; // Redirect ke halaman pembayaran Midtrans
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center text-color1'>
      <h1>Upgrade to Premium</h1>
      <p>Get access to exclusive features by upgrading to our premium package for only Rp 50,000.</p>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Upgrade Now'}
      </button>
    </div>
  );
};

export default PremiumPayment;