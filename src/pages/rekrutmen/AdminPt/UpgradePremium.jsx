import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Avatar,
  Chip,
  Stack
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  WorkspacePremium as PremiumIcon,
  CreditCard as CreditCardIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const benefits = [
  { 
    text: "Akses penuh ke dashboard premium", 
    icon: <PremiumIcon color="primary" /> 
  },
  { 
    text: "Posting lowongan tanpa batas", 
    icon: <CheckCircleIcon color="primary" /> 
  },
  { 
    text: "Manajemen soal psikotes lengkap", 
    icon: <CheckCircleIcon color="primary" /> 
  },
  { 
    text: "Sistem pelacakan pelamar canggih", 
    icon: <CheckCircleIcon color="primary" /> 
  },
  { 
    text: "Support prioritas 24/7", 
    icon: <CheckCircleIcon color="primary" /> 
  }
];

const UpgradePremium = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/create-payment`,
        { amount: 50000, productName: "Premium Membership" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { token: snapToken, order_id } = response.data.data;
      if (!snapToken) {
        throw new Error('Token pembayaran tidak ditemukan');
      }

      localStorage.setItem('pending_payment', JSON.stringify({
        order_id,
        timestamp: new Date().toISOString()
      }));

      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          localStorage.setItem(`tx_${result.order_id}`, JSON.stringify(result));
          localStorage.removeItem('pending_payment');
          navigate(`/payment-callback/success?order_id=${result.order_id}`);
        },
        onPending: (result) => {
          navigate(`/payment-callback/pending?order_id=${order_id}`);
        },
        onError: (error) => {
          navigate(`/payment-callback/failure?order_id=${order_id}`);
        },
        onClose: () => {
          toast.info('Popup pembayaran ditutup');
        }
      });

    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memulai pembayaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #070F2B 0%, #172048 100%)'
    }}>
      <Card sx={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        p: { xs: 2, md: 4 },
        borderRadius: 10,
        boxShadow: 17,
        overflow: 'hidden',
        color : '#172048',
        background: 'linear-gradient(135deg, #070F2B 0%, #070F2B 100%)',
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip 
            label="PREMIUM" 
            color="primary" 
            sx={{ 
              mb: 2,
              px: 2,
              py: 1,
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}
          />
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'primary.main'
          }}>
            Upgrade Keanggotaan
          </Typography>
          <Typography variant="body1" color="white" sx={{ mb: 2 }}>
            Dapatkan akses penuh ke semua fitur premium kami
          </Typography>
        </Box>

        <Box sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #2196f3)',
          color: 'white',
          p: 3,
          borderRadius: 2,
          mb: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Rp50.000
          </Typography>
          <Typography variant="body2">
            
          </Typography>
        </Box>

        <List sx={{ mb: 4, color: 'white', borderRadius: 2, p: 2 }}>
          {benefits.map((benefit, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {benefit.icon}
              </ListItemIcon>
              <ListItemText 
                primary={benefit.text} 
                primaryTypographyProps={{ variant: 'body1' }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleUpgrade}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={24} /> : <ArrowForwardIcon />}
          sx={{ 
            mt: 3,
            py: 2,
            borderRadius: 2,
            fontSize: '1.1rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Memproses...' : 'Mulai Berlangganan'}
        </Button>

        <Box sx={{ 
          mt: 3, 
          textAlign: 'center',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LockIcon fontSize="small" sx={{ mr: 1, color: '#9290C3' }} />
          <Typography variant="body2" color="#9290C3">
            Pembayaran aman melalui Midtrans
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default UpgradePremium;