import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Stack,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Box,
  CircularProgress,
  Alert
} from "@mui/joy";

const JenisSoalSelector = ({ onStartTest, lamaranId }) => {
  const [jenisSoal, setJenisSoal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        const endpoint = lamaranId
          ? `${import.meta.env.VITE_BASE_URL}/api/getJenisSoalByLamaranId/${lamaranId}`
          : `${import.meta.env.VITE_BASE_URL}/api/getJenisSoalByUserId`;
        
        const url = `${endpoint}?t=${Date.now()}`;
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal
        });

        if (response.data?.data) {
          setJenisSoal(response.data.data);
          console.log("Data jenis soal:", response.data.data);
        } else {
          throw new Error("Data format tidak valid");
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching jenis soal:", err);
          
          // Handle 403 response (premium required)
          if (err.response?.status === 403) {
            setError("Anda memerlukan akun premium untuk mengakses tes ini");
            setShowPremiumModal(true);
          } 
          // Handle 404 response specifically
          else if (err.response?.status === 404) {
            setError(err.response.data?.message || "Tidak ada tes yang perlu dikerjakan");
            if (lamaranId) {
              localStorage.removeItem("lamaranId");
            }
          } else {
            setError(err.message || 
              (lamaranId 
                ? "Gagal memuat tes yang perlu dikerjakan" 
                : "Gagal memuat daftar tes")
            );
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [lamaranId, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleUpgradePremium = () => {
    navigate("/premium"); // Adjust this route based on your app
  };

  if (loading) {
    return (
      <Card variant="outlined" sx={{ p: 3, borderRadius: 'lg' }}>
        <Typography level="h4" mb={2}>
          {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <>
        <Card variant="outlined" sx={{ p: 3, borderRadius: 'lg' }}>
          <Typography level="h4" mb={2}>
            {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
          </Typography>
          <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
            {error}
          </Alert>
          {!error.includes("Tidak ada") && !error.includes("premium") && (
            <Button 
              onClick={handleRetry}
              variant="solid"
              color="primary"
              fullWidth
            >
              Coba Lagi
            </Button>
          )}
        </Card>

        {/* Premium Upgrade Modal */}
        <Modal open={showPremiumModal} onClose={() => setShowPremiumModal(false)}>
          <ModalDialog
            variant="outlined"
            role="alertdialog"
            aria-labelledby="premium-modal-title"
            sx={{
              maxWidth: 500,
              borderRadius: 'lg',
              boxShadow: 'lg',
              p: 4
            }}
          >
            <ModalClose />
            <Typography
              level="h4"
              id="premium-modal-title"
              component="h2"
              mb={2}
              sx={{ color: 'primary.500' }}
            >
              Akses Premium Diperlukan
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography level="body-md" mb={3}>
              Anda memerlukan akun premium untuk mengakses tes ini. Dengan akun premium, Anda akan mendapatkan:
            </Typography>
            <Stack spacing={2} mb={4}>
              <Typography startDecorator="✓" level="body-sm">
                Akses ke semua jenis tes
              </Typography>
              <Typography startDecorator="✓" level="body-sm">
                Laporan hasil tes lebih detail
              </Typography>
              <Typography startDecorator="✓" level="body-sm">
                Prioritas dukungan pelanggan
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                variant="solid"
                color="primary"
                onClick={handleUpgradePremium}
                fullWidth
              >
                Upgrade Sekarang
              </Button>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setShowPremiumModal(false)}
                fullWidth
              >
                Nanti Saja
              </Button>
            </Stack>
          </ModalDialog>
        </Modal>
      </>
    );
  }

  if (jenisSoal.length === 0) {
    return (
      <Card variant="outlined" sx={{ p: 3, borderRadius: 'lg' }}>
        <Typography level="h4" mb={2}>
          {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
        </Typography>
        <Alert color="neutral" variant="soft">
          {lamaranId 
            ? "Tidak ada tes yang perlu dikerjakan untuk lamaran ini"
            : "Tidak ada tes yang tersedia saat ini"}
        </Alert>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ p: 3, borderRadius: 'lg' }}>
      <Typography level="h4" mb={2}>
        {lamaranId ? "Tes yang Perlu Dikerjakan" : "Pilih Jenis Soal"}
      </Typography>
      <Stack spacing={2}>
        {jenisSoal.map((jenis) => (
          <Button
            key={jenis.id}
            onClick={() => onStartTest(jenis.id)}
            variant="outlined"
            color="neutral"
            sx={{
              p: 2,
              justifyContent: 'flex-start',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: 'primary.softBg',
                color: 'primary.softColor'
              }
            }}
          >
            <Stack>
              <Typography level="title-md">{jenis.namaJenis}</Typography>
              <Typography level="body-sm" textColor="text.tertiary">
                {jenis.deskripsi || "Klik untuk memulai tes"}
              </Typography>
              {jenis.durasi && (
                <Typography level="body-xs" mt={0.5}>
                  Durasi: {jenis.durasi} menit
                </Typography>
              )}
            </Stack>
          </Button>
        ))}
      </Stack>
    </Card>
  );
};

export default JenisSoalSelector;