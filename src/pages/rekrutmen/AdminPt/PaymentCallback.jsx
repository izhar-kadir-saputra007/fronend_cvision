import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  ConfirmationNumber as OrderIcon,
  AttachMoney as AmountIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

const PaymentCallback = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const orderId = new URLSearchParams(location.search).get('order_id');
        console.log('Mengambil data langsung dari API untuk order:', orderId);

        if (!orderId) {
          throw new Error('Order ID tidak ditemukan');
        }

        // Langsung panggil API tanpa cek localStorage
        const apiResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/transactions/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Cache-Control': 'no-cache' // Pastikan tidak ada cache
            },
            timeout: 10000
          }
        );

        console.log('Response API:', apiResponse.data);

        if (!apiResponse.data?.success) {
          throw new Error(apiResponse.data?.message || 'Response tidak valid dari server');
        }

        // Simpan data response ke state
        setPaymentData(apiResponse.data.data);

        if (status === 'success' && apiResponse.data.data.transaction_status === 'settlement') {
          toast.success('Pembayaran berhasil diproses!');
        }

      } catch (error) {
        console.error('Error mengambil data:', {
          message: error.message,
          response: error.response?.data
        });
        setError(error.message || 'Gagal memuat detail transaksi');
        toast.error(error.message || 'Gagal memuat detail transaksi');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [status, location.search, navigate]);

  const getStatusDetails = () => {
    if (!paymentData) return { icon: null, title: '', message: '', color: 'primary' };

    const statusMap = {
      settlement: {
        icon: <SuccessIcon sx={{ color: 'success.main', fontSize: 60 }} />,
        title: 'Pembayaran Berhasil',
        message: 'Pembayaran Anda telah dikonfirmasi',
        color: 'success'
      },
      pending: {
        icon: <PendingIcon sx={{ color: 'warning.main', fontSize: 60 }} />,
        title: 'Pembayaran Tertunda',
        message: 'Menunggu konfirmasi pembayaran',
        color: 'warning'
      },
      failure: {
        icon: <ErrorIcon sx={{ color: 'error.main', fontSize: 60 }} />,
        title: 'Pembayaran Gagal',
        message: 'Silakan coba lagi atau hubungi tim support',
        color: 'error'
      },
      default: {
        icon: null,
        title: `Status Pembayaran: ${paymentData.transaction_status}`,
        message: '',
        color: 'info'
      }
    };

    return statusMap[paymentData.transaction_status] || statusMap.default;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2, alignSelf: 'center' }}>
          Memverifikasi status pembayaran...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Terjadi Kesalahan
          </Typography>
          <Typography sx={{ mb: 3 }}>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
          >
            Kembali ke Dashboard
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 500 }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          {getStatusDetails().icon}
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            {getStatusDetails().title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {getStatusDetails().message}
          </Typography>
  
          {paymentData && (
            <>
              <List sx={{ 
                p: 0, 
                mb: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                border: '1px solid rgba(0, 0, 0, 0.12)'
              }}>
                {/* Informasi User */}
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" /> {/* Tambahkan import PersonIcon dari @mui/icons-material */}
                  </ListItemIcon>
                  <Typography>
                    <strong>Nama:</strong> {paymentData.user_details?.name || 'Tidak tersedia'}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" /> {/* Tambahkan import EmailIcon */}
                  </ListItemIcon>
                  <Typography>
                    <strong>Email:</strong> {paymentData.user_details?.email || 'Tidak tersedia'}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" /> {/* Tambahkan import PhoneIcon */}
                  </ListItemIcon>
                  <Typography>
                    <strong>Telepon:</strong> {paymentData.user_details?.phone_number || 'Tidak tersedia'}
                  </Typography>
                </ListItem>
                <Divider component="li" />
  
                {/* Informasi Transaksi */}
                <ListItem>
                  <ListItemIcon>
                    <OrderIcon color="primary" />
                  </ListItemIcon>
                  <Typography>
                    <strong>ID Pesanan:</strong> {paymentData.order_id}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                
                <ListItem>
  <ListItemIcon>
    <ReceiptIcon color="primary" />
  </ListItemIcon>
  <Typography>
    <strong>Status:</strong> 
    {paymentData.transaction_status === 'settlement' ? (
      <Box component="span" sx={{ 
        color: 'success.main', 
        display: 'inline-flex', 
        alignItems: 'center', 
        ml: 1,
        fontWeight: 'bold'
      }}>
        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
        Sukses
      </Box>
    ) : paymentData.transaction_status === 'pending' ? (
      <Box component="span" sx={{ 
        color: 'warning.main', 
        display: 'inline-flex', 
        alignItems: 'center', 
        ml: 1,
        fontWeight: 'medium'
      }}>
        <PendingIcon fontSize="small" sx={{ mr: 0.5 }} />
        Menunggu Pembayaran
      </Box>
    ) : paymentData.transaction_status === 'capture' ? (
      <Box component="span" sx={{ 
        color: 'info.main', 
        display: 'inline-flex', 
        alignItems: 'center', 
        ml: 1
      }}>
        <VerifiedIcon fontSize="small" sx={{ mr: 0.5 }} />
        Terverifikasi
      </Box>
    ) : (
      <Box component="span" sx={{ 
        color: 'error.main', 
        display: 'inline-flex', 
        alignItems: 'center', 
        ml: 1
      }}>
        <ErrorIcon fontSize="small" sx={{ mr: 0.5 }} />
        {paymentData.transaction_status === 'deny' ? 'Ditolak' : 
         paymentData.transaction_status === 'expire' ? 'Kadaluarsa' : 
         paymentData.transaction_status === 'cancel' ? 'Dibatalkan' : 'Gagal'}
      </Box>
    )}
  </Typography>
</ListItem>
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <AmountIcon color="primary" />
                  </ListItemIcon>
                  <Typography>
                    <strong>Jumlah:</strong> Rp{Number(paymentData.gross_amount).toLocaleString('id-ID')}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <CreditCardIcon color="primary" />
                  </ListItemIcon>
                  <Typography>
                    <strong>Metode:</strong> {paymentData.payment_type.replace(/_/g, ' ')}
                  </Typography>
                </ListItem>
                
                {paymentData.va_numbers?.[0] && (
                  <>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <BankIcon color="primary" />
                      </ListItemIcon>
                      <Typography>
                        <strong>Nomor VA:</strong> {paymentData.va_numbers[0].bank.toUpperCase()} - {paymentData.va_numbers[0].va_number}
                      </Typography>
                    </ListItem>
                  </>
                )}
                
                {paymentData.settlement_time && (
                  <>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <CalendarIcon color="primary" />
                      </ListItemIcon>
                      <Typography>
                        <strong>Waktu Penyelesaian:</strong> {new Date(paymentData.settlement_time).toLocaleString('id-ID')}
                      </Typography>
                    </ListItem>
                  </>
                )}
              </List>
  
              <Button
                variant="outlined"
                onClick={() => navigate('/adminpt/dashboard')}
                sx={{ width: '100%' }}
                startIcon={<HomeIcon />}
              >
                Kembali ke Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentCallback;