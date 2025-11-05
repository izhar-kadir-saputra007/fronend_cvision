import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemDecorator,
  Chip,
  Grid,
  Alert,
  Input,
  FormControl,
  FormLabel,
  FormHelperText
} from '@mui/joy';
import { CheckCircleRounded, StarsRounded, LockRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Load Midtrans script
const loadMidtransScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    script.onload = () => {
      resolve();
    };
    document.body.appendChild(script);
  });
};

const PremiumUpgradePage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      
      // Load Midtrans script if not already loaded
      if (!window.snap) {
        await loadMidtransScript();
      }

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/create-payment`,
        { 
          amount: amount,
          productName: "Premium Membership" 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      const { token: snapToken, order_id } = response.data.data;
      
      if (!snapToken) {
        throw new Error('Token pembayaran tidak ditemukan');
      }

      // Simpan data transaksi sementara
      localStorage.setItem('pending_payment', JSON.stringify({
        order_id,
        amount,
        timestamp: new Date().toISOString()
      }));

      // Trigger Snap popup
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          localStorage.setItem(`tx_${order_id}`, JSON.stringify(result));
          navigate(`/payment-callback/success?order_id=${order_id}`);
        },
        onPending: (result) => {
          navigate(`/payment-callback/pending?order_id=${order_id}`);
        },
        onError: (error) => {
          navigate(`/payment-callback/failure?order_id=${order_id}`);
        },
        onClose: () => {
          toast.info('Anda menutup popup pembayaran sebelum menyelesaikannya');
        }
      });

    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memulai pembayaran');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Analisis CV dengan Machine Learning canggih',
    'Test psikotes lengkap dengan hasil detail',
    'Prioritas akses fitur baru',
    'Laporan kecocokan pekerjaan lebih mendalam',
    'Akses seumur hidup tanpa biaya berulang',
    'Dukungan pelanggan prioritas'
  ];

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1200, mx: 'auto', color: 'white' }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Chip
          variant="soft"
          color="primary"
          size="lg"
          startDecorator={<StarsRounded />}
          sx={{ mb: 2 }}
        >
          Premium Membership
        </Chip>
        <Typography level="h2" component="h1" sx={{ mb: 2, color: 'primary.500' }}>
          Tingkatkan Potensi Karir Anda
        </Typography>
        <Typography level="body-lg" textColor="text.secondary" maxWidth="md" mx="auto" sx={{ mb: 2, color: 'white' }}>
          Akses penuh semua fitur profesional untuk membantu Anda mendapatkan pekerjaan yang tepat
        </Typography>
      </Box>

      {/* Pricing Card */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        <Grid xs={12} md={8} lg={6}>
          <Card
            variant="outlined"
            sx={{
              borderWidth: 2,
              borderColor: 'primary.500',
              boxShadow: 'md',
              '&:hover': {
                boxShadow: 'lg',
                borderColor: 'primary.700'
              }
            }}
          >
            <CardContent>
              <Typography level="h4" component="h2" sx={{ mb: 1 }}>
                Paket Seumur Hidup
              </Typography>
              <Typography level="body-sm" textColor="text.tertiary" sx={{ mb: 2 }}>
                Satu kali pembayaran, akses selamanya
              </Typography>

              {/* Input Amount */}
             

              <Button
                fullWidth
                size="lg"
                onClick={handleUpgrade}
                startDecorator={<LockRounded />}
                sx={{ mb: 3 }}
                loading={loading}
                disabled={amount < 100 || loading}
                id="pay-button" // ID untuk Midtrans (jika diperlukan)
              >
                {loading ? 'Memproses...' : 'Upgrade Sekarang'}
              </Button>

              <Divider sx={{ my: 2 }} />

              <List size="sm" sx={{ '--ListItemDecorator-size': '32px' }}>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemDecorator>
                      <CheckCircleRounded color="primary" />
                    </ListItemDecorator>
                    {feature}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Value Proposition */}
      <Box sx={{ mb: 6 }}>
        <Typography level="h3" component="h2" textAlign="center" sx={{ mb: 4, color: 'primary.500' }}>
          Mengapa Upgrade ke Premium?
        </Typography>
        
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Card variant="soft" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="title-lg" sx={{ mb: 1 }}>
                  Analisis CV Cerdas
                </Typography>
                <Typography level="body-sm">
                  Sistem kami menggunakan machine learning untuk menganalisis kecocokan CV Anda dengan lowongan pekerjaan secara akurat.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={12} md={4}>
            <Card variant="soft" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="title-lg" sx={{ mb: 1 }}>
                  Tes Psikotes Lengkap
                </Typography>
                <Typography level="body-sm">
                  Akses berbagai tes psikotes profesional untuk mengukur potensi dan kepribadian Anda.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={12} md={4}>
            <Card variant="soft" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="title-lg" sx={{ mb: 1 }}>
                  Hemat Biaya
                </Typography>
                <Typography level="body-sm">
                  Hanya Rp5.000 untuk akses seumur hidup - investasi kecil untuk karir yang lebih baik.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center' }}>
     
        
        <Button
          size="lg"
          onClick={handleUpgrade}
          endDecorator={<StarsRounded />}
          sx={{ px: 6 }}
          loading={loading}
          disabled={amount < 1000 || loading}
        >
          {loading ? 'Memproses...' : 'Mulai Sekarang'}
        </Button>
        
        <Typography level="body-sm" mt={2} textColor="text.tertiary" sx={{ maxWidth: 600, mx: 'auto', color: 'white' }}>
          Pembayaran aman melalui berbagai metode pembayaran
        </Typography>
      </Box>
    </Box>
  );
};

export default PremiumUpgradePage;