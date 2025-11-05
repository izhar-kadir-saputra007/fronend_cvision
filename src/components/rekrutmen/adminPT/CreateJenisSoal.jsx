import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress
} from '@mui/material';

export default function CreateJenisSoal() {
  const [formData, setFormData] = useState({
    namaJenis: '',
    deskripsi: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.namaJenis) {
      toast.error('Nama jenis soal harus diisi');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/jenis-soal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat jenis soal');
      }

      toast.success('Jenis soal berhasil dibuat!');
      setFormData({
        namaJenis: '',
        deskripsi: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 800, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Buat Jenis Soal Baru
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nama Jenis Soal"
            name="namaJenis"
            value={formData.namaJenis}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="Contoh: Tes Logika, Tes Verbal, dll."
          />
          
          <TextField
            fullWidth
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            placeholder="Deskripsi singkat tentang jenis soal ini"
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Menyimpan...' : 'Simpan Jenis Soal'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}