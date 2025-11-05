import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Business,
  CalendarToday,
  Description,
  Schedule,
  Work,
  Checklist,
  Close,
} from '@mui/icons-material';
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";


const DetailLowonganModal = ({ id, open, onClose }) => {
  const [lowongan, setLowongan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (open && id) {
      const fetchLowonganDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token tidak ditemukan. Silakan login kembali.');
          }

          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getLowonganById/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (response.ok) {
            setLowongan(data.data);
          } else {
            throw new Error(data.message || 'Gagal mengambil data lowongan');
          }
        } catch (err) {
          setError(err.message);
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchLowonganDetail();
    }
  }, [id, open]);

  // Custom date formatter that doesn't rely on date-fns locale
  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === 'null') return '-';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return dateString;
      }
      
      // Manual formatting with Indonesian month names
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error('Date formatting failed:', error);
      return dateString || '-';
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: "00C3FE", color: '#070F2B' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Detail Lowongan Pekerjaan</Typography>
          <Button onClick={onClose} color="inherit">
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "#F6F6F6", py: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Memuat detail lowongan...</Typography>
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : lowongan ? (
          <>
            {/* Header Info */}
            <Box mb={4}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {lowongan.judul}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  {lowongan.PT?.namaPT || 'Nama Perusahaan'} • {lowongan.PT?.alamat || 'Alamat Perusahaan'}
                </Typography>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                <Chip
                  icon={<CalendarToday />}
                  label={`Dibuka: ${formatDate(lowongan.tanggalBuka)}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<Schedule />}
                  label={`Tutup: ${formatDate(lowongan.tanggalTutup)}`}
                  color={new Date(lowongan.tanggalTutup) > new Date() ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={lowongan.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  color={lowongan.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Deskripsi */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Description color="primary" sx={{ mr: 1 }} />
                Deskripsi Pekerjaan
              </Typography>
              <Typography variant="body1" paragraph>
                {lowongan.deskripsi || 'Tidak ada deskripsi'}
              </Typography>
            </Box>

            {/* Persyaratan */}
            {/* Persyaratan */}
<Box mb={4}>
  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
    <Checklist color="primary" sx={{ mr: 1 }} />
    Persyaratan & Kualifikasi
  </Typography>

  {/* Inline style supaya list markdown tetap rapi */}
  <style>{`
    .markdown-preview ul {
      list-style-type: disc !important;
      padding-left: 4.5rem !important;
    }
    .markdown-preview ol {
      list-style-type: decimal !important;
      padding-left: 4.5rem !important;
    }
    .markdown-preview li {
      margin-bottom: 0.25rem !important;
    }
  `}</style>

  <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
    <div className="markdown-preview ">
      <MDEditor.Markdown
        source={lowongan.persyaratan || 'Tidak ada persyaratan khusus'}
        style={{
          color: '#333',             
          backgroundColor: '#f9f9fF', 
          boxShadow: theme.shadows[1],
          padding: '1rem',
          borderRadius: '8px'
        }}
      />
    </div>
  </Paper>
</Box>


            {/* Jenis Soal */}
            {lowongan.jenissoals?.length > 0 ? (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Work color="primary" sx={{ mr: 1 }} />
                  Jenis Tes
                </Typography>
                <List dense>
                  {lowongan.jenissoals.map((jenis) => (
                    <ListItem key={jenis.id}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 24, height: 24 }}>
                          <Typography variant="caption">{jenis.id}</Typography>
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={jenis.namaJenis}
                        secondary={jenis.deskripsi || 'Tidak ada deskripsi'}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Tidak ada jenis tes yang terkait
              </Typography>
            )}
          </>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<Close />}
          sx={{ mr: 2 }}
        >
          Tutup
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={lowongan?.status !== 'active'}
        >
          Lamar Sekarang
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailLowonganModal;