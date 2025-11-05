import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  Container,

  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,

  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  AccountCircle, 
  Phone, 
  CalendarMonth, 
  Wc, 
  LocationOn, 
  School, 
  Save, 
  Cancel,
  ArrowBack,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';

const EditProfile = ({ onCancel, onSaveSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    alamat: '',
    tanggalLahir: '',
    jenisKelamin: '',
    pendidikanTerakhir: '',
    jurusan: ''
  });

  const [selectedAlamat, setSelectedAlamat] = useState({
    provinsi: { id: '', name: '' },
    kabupaten: { id: '', name: '' },
    kecamatan: { id: '', name: '' },
    desa: { id: '', name: '' }
  });

  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk step/langkah
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Informasi Pribadi', 'Alamat', 'Pendidikan'];

  // Fetch data wilayah
  const fetchProvinces = async () => {
    try {
      const res = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
      setProvinsiList(res.data);
    } catch (err) {
      toast.error('Gagal memuat data provinsi', err);
    }
  };

  const fetchKabupaten = async (provinsiId) => {
    try {
      if (!provinsiId) return;
      const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsiId}.json`);
      setKabupatenList(res.data);
    } catch (err) {
      toast.error('Gagal memuat data kabupaten', err);
    }
  };

  const fetchKecamatan = async (kabupatenId) => {
    try {
      if (!kabupatenId) return;
      const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabupatenId}.json`);
      setKecamatanList(res.data);
    } catch (err) {
      toast.error('Gagal memuat data kecamatan', err);
    }
  };

  const fetchDesa = async (kecamatanId) => {
    try {
      if (!kecamatanId) return;
      const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecamatanId}.json`);
      setDesaList(res.data);
    } catch (err) {
      toast.error('Gagal memuat data desa', err);
    }
  };

  // Load data profil
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }
      
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getUserProfile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { name, phoneNumber, calonkaryawan } = response.data.data;
      
      setFormData({
        name: name || '',
        phoneNumber: phoneNumber || '',
        alamat: calonkaryawan?.alamat || '',
        tanggalLahir: calonkaryawan?.tanggalLahir
          ? new Date(calonkaryawan.tanggalLahir).toISOString().split('T')[0]
          : '',
        jenisKelamin: calonkaryawan?.jenisKelamin || '',
        pendidikanTerakhir: calonkaryawan?.pendidikanTerakhir || '',
        jurusan: calonkaryawan?.jurusan || ''
      });

      // Parse alamat jika ada (format: Provinsi, Kabupaten, Kecamatan, Desa)
      if (calonkaryawan?.alamat) {
        const alamatParts = calonkaryawan.alamat.split(', ');
        if (alamatParts.length === 4) {
          setSelectedAlamat({
            provinsi: { id: '', name: alamatParts[0].trim() },
            kabupaten: { id: '', name: alamatParts[1].trim() },
            kecamatan: { id: '', name: alamatParts[2].trim() },
            desa: { id: '', name: alamatParts[3].trim() }
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat data profil');
      toast.error(err.response?.data?.message || err.message || 'Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phoneNumber: initialData.phoneNumber || '',
        alamat: initialData.calonkaryawan?.alamat || '',
        tanggalLahir: initialData.calonkaryawan?.tanggalLahir
          ? new Date(initialData.calonkaryawan.tanggalLahir).toISOString().split('T')[0]
          : '',
        jenisKelamin: initialData.calonkaryawan?.jenisKelamin || '',
        pendidikanTerakhir: initialData.calonkaryawan?.pendidikanTerakhir || '',
        jurusan: initialData.calonkaryawan?.jurusan || ''
      });

      if (initialData.calonkaryawan?.alamat) {
        const alamatParts = initialData.calonkaryawan.alamat.split(', ');
        if (alamatParts.length === 4) {
          setSelectedAlamat({
            provinsi: { id: '', name: alamatParts[0].trim() },
            kabupaten: { id: '', name: alamatParts[1].trim() },
            kecamatan: { id: '', name: alamatParts[2].trim() },
            desa: { id: '', name: alamatParts[3].trim() }
          });
        }
      }
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [initialData]);

  // Handle perubahan form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle perubahan alamat
  const handleAlamatChange = async (e) => {
    const { name, value } = e.target;
    let selectedName = '';
    
    // Mendapatkan nama terpilih
    if (name === 'provinsi') {
      const provinsi = provinsiList.find(p => p.id === value);
      selectedName = provinsi ? provinsi.name : '';
    } else if (name === 'kabupaten') {
      const kabupaten = kabupatenList.find(k => k.id === value);
      selectedName = kabupaten ? kabupaten.name : '';
    } else if (name === 'kecamatan') {
      const kecamatan = kecamatanList.find(k => k.id === value);
      selectedName = kecamatan ? kecamatan.name : '';
    } else if (name === 'desa') {
      const desa = desaList.find(d => d.id === value);
      selectedName = desa ? desa.name : '';
    }

    const newSelectedAlamat = {
      ...selectedAlamat,
      [name]: { id: value, name: selectedName }
    };

    // Reset data turunan ketika data induk berubah
    if (name === 'provinsi') {
      newSelectedAlamat.kabupaten = { id: '', name: '' };
      newSelectedAlamat.kecamatan = { id: '', name: '' };
      newSelectedAlamat.desa = { id: '', name: '' };
      setKabupatenList([]);
      setKecamatanList([]);
      setDesaList([]);
      await fetchKabupaten(value);
    } else if (name === 'kabupaten') {
      newSelectedAlamat.kecamatan = { id: '', name: '' };
      newSelectedAlamat.desa = { id: '', name: '' };
      setKecamatanList([]);
      setDesaList([]);
      await fetchKecamatan(value);
    } else if (name === 'kecamatan') {
      newSelectedAlamat.desa = { id: '', name: '' };
      setDesaList([]);
      await fetchDesa(value);
    }

    setSelectedAlamat(newSelectedAlamat);

    // Update alamat string dengan urutan: Provinsi, Kabupaten, Kecamatan, Desa
    const alamatParts = [
      newSelectedAlamat.provinsi.name,
      newSelectedAlamat.kabupaten.name,
      newSelectedAlamat.kecamatan.name,
      newSelectedAlamat.desa.name
    ].filter(Boolean); // Hanya ambil yang tidak kosong

    setFormData(prev => ({
      ...prev,
      alamat: alamatParts.join(', ')
    }));
  };

  // State untuk dialog konfirmasi
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Handle submit form
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Buka dialog konfirmasi jika dipanggil dari form
    if (!openConfirmDialog) {
      setOpenConfirmDialog(true);
      return;
    }
    
    // Tutup dialog dan lanjutkan submit
    setOpenConfirmDialog(false);
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }
  
      // Data yang akan dikirim (termasuk alamat sebagai string gabungan)
      const dataToSubmit = {
        ...formData
      };
      console.log('Data yang akan dikirim:', dataToSubmit);
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/editProfile`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      toast.success('Profil berhasil diperbarui');
      onSaveSuccess && onSaveSuccess(response.data.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Gagal memperbarui profil';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk navigasi stepper
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Tampilkan loading spinner
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress size={60} thickness={4} color="primary" />
      </Box>
    );
  }

  // Tampilkan error
  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
          startIcon={<CheckCircle />}
        >
          Coba Lagi
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold" align="center">
          Edit Profil
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Informasi Pribadi */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                <AccountCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informasi Pribadi
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    name="name"
                    label="Nama Lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Masukkan nama lengkap sesuai dengan identitas"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    label="Nomor Telepon"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Format: 08xxxxxxxxxx (10-13 digit)"
                    inputProps={{
                      pattern: "[0-9]{10,13}",
                      title: "Nomor telepon harus 10-13 digit angka"
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="tanggalLahir"
                    label="Tanggal Lahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    helperText="Format: YYYY-MM-DD"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="jenis-kelamin-label">Jenis Kelamin</InputLabel>
                    <Select
                      labelId="jenis-kelamin-label"
                      name="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={handleChange}
                      label="Jenis Kelamin"
                      startAdornment={
                        <InputAdornment position="start">
                          <Wc color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Pilih Jenis Kelamin</em>
                      </MenuItem>
                      <MenuItem value="Laki-laki">Laki-laki</MenuItem>
                      <MenuItem value="Perempuan">Perempuan</MenuItem>
                    </Select>
                    <FormHelperText>Pilih jenis kelamin anda</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 2: Alamat */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Alamat
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Harap pilih secara berurutan mulai dari Provinsi hingga Desa/Kelurahan
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="provinsi-label">Provinsi</InputLabel>
                    <Select
                      labelId="provinsi-label"
                      name="provinsi"
                      value={selectedAlamat.provinsi.id}
                      onChange={handleAlamatChange}
                      label="Provinsi"
                    >
                      <MenuItem value="">
                        <em>Pilih Provinsi</em>
                      </MenuItem>
                      {provinsiList.map(provinsi => (
                        <MenuItem key={provinsi.id} value={provinsi.id}>{provinsi.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Pilih provinsi tempat anda tinggal</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" disabled={!selectedAlamat.provinsi.id}>
                    <InputLabel id="kabupaten-label">Kabupaten/Kota</InputLabel>
                    <Select
                      labelId="kabupaten-label"
                      name="kabupaten"
                      value={selectedAlamat.kabupaten.id}
                      onChange={handleAlamatChange}
                      label="Kabupaten/Kota"
                    >
                      <MenuItem value="">
                        <em>Pilih Kabupaten/Kota</em>
                      </MenuItem>
                      {kabupatenList.map(kab => (
                        <MenuItem key={kab.id} value={kab.id}>{kab.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {!selectedAlamat.provinsi.id 
                        ? "Pilih provinsi terlebih dahulu" 
                        : "Pilih kabupaten/kota tempat anda tinggal"}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" disabled={!selectedAlamat.kabupaten.id}>
                    <InputLabel id="kecamatan-label">Kecamatan</InputLabel>
                    <Select
                      labelId="kecamatan-label"
                      name="kecamatan"
                      value={selectedAlamat.kecamatan.id}
                      onChange={handleAlamatChange}
                      label="Kecamatan"
                    >
                      <MenuItem value="">
                        <em>Pilih Kecamatan</em>
                      </MenuItem>
                      {kecamatanList.map(kec => (
                        <MenuItem key={kec.id} value={kec.id}>{kec.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {!selectedAlamat.kabupaten.id 
                        ? "Pilih kabupaten/kota terlebih dahulu" 
                        : "Pilih kecamatan tempat anda tinggal"}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" disabled={!selectedAlamat.kecamatan.id}>
                    <InputLabel id="desa-label">Desa/Kelurahan</InputLabel>
                    <Select
                      labelId="desa-label"
                      name="desa"
                      value={selectedAlamat.desa.id}
                      onChange={handleAlamatChange}
                      label="Desa/Kelurahan"
                    >
                      <MenuItem value="">
                        <em>Pilih Desa/Kelurahan</em>
                      </MenuItem>
                      {desaList.map(des => (
                        <MenuItem key={des.id} value={des.id}>{des.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {!selectedAlamat.kecamatan.id 
                        ? "Pilih kecamatan terlebih dahulu" 
                        : "Pilih desa/kelurahan tempat anda tinggal"}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="alamat"
                    label="Alamat Lengkap"
                    value={formData.alamat}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    helperText="Alamat lengkap akan terisi otomatis"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 3: Pendidikan */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pendidikan
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="pendidikan-label">Pendidikan Terakhir</InputLabel>
                    <Select
                      labelId="pendidikan-label"
                      name="pendidikanTerakhir"
                      value={formData.pendidikanTerakhir}
                      onChange={handleChange}
                      label="Pendidikan Terakhir"
                      startAdornment={
                        <InputAdornment position="start">
                          <School color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Pilih Pendidikan</em>
                      </MenuItem>
                      <MenuItem value="SD">SD</MenuItem>
                      <MenuItem value="SMP">SMP</MenuItem>
                      <MenuItem value="SMA/SMK">SMA/SMK</MenuItem>
                      <MenuItem value="D3">D3</MenuItem>
                      <MenuItem value="S1">S1</MenuItem>
                      <MenuItem value="S2">S2</MenuItem>
                      <MenuItem value="S3">S3</MenuItem>
                    </Select>
                    <FormHelperText>Pilih jenjang pendidikan terakhir anda</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="jurusan"
                    label="Jurusan/Program Studi"
                    value={formData.jurusan}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Masukkan jurusan atau program studi anda"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Ringkasan Data */}
              <Card sx={{ mt: 4, mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Ringkasan Data
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Nama Lengkap</Typography>
                      <Typography variant="body1">{formData.name || '-'}</Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Nomor Telepon</Typography>
                      <Typography variant="body1">{formData.phoneNumber || '-'}</Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Tanggal Lahir</Typography>
                      <Typography variant="body1">
                        {formData.tanggalLahir ? new Date(formData.tanggalLahir).toLocaleDateString('id-ID') : '-'}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Jenis Kelamin</Typography>
                      <Typography variant="body1">{formData.jenisKelamin || '-'}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Alamat Lengkap</Typography>
                      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{formData.alamat || '-'}</Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Pendidikan Terakhir</Typography>
                      <Typography variant="body1">{formData.pendidikanTerakhir || '-'}</Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Jurusan</Typography>
                      <Typography variant="body1">{formData.jurusan || '-'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Navigation & Submit Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={activeStep === 0 ? onCancel : handleBack}
              startIcon={activeStep === 0 ? <Cancel /> : <ArrowBack />}
              disabled={isSubmitting}
            >
              {activeStep === 0 ? 'Batal' : 'Sebelumnya'}
            </Button>
            
            <Button
              variant={activeStep === steps.length - 1 ? "contained" : "contained"}
              color={activeStep === steps.length - 1 ? "success" : "primary"}
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              endIcon={activeStep === steps.length - 1 ? <Save /> : <ArrowForward />}
              disabled={isSubmitting}
              type="button" // Ubah menjadi button saja, bukan submit
            >
              {isSubmitting && activeStep === steps.length - 1 ? (
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              ) : null}
              {activeStep === steps.length - 1
                ? (isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan')
                : 'Selanjutnya'}
            </Button>
          </Box>
        </form>

        {/* Dialog Konfirmasi Submit */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Konfirmasi Perubahan Data"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Apakah data yang Anda masukkan sudah benar semua? 
              Data yang tersimpan akan digunakan untuk keperluan perusahaan.
            </DialogContentText>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>Informasi Pribadi:</Typography>
              <Typography variant="body2">Nama: {formData.name}</Typography>
              <Typography variant="body2">No. Telepon: {formData.phoneNumber || '-'}</Typography>
              <Typography variant="body2">Tanggal Lahir: {formData.tanggalLahir || '-'}</Typography>
              <Typography variant="body2">Jenis Kelamin: {formData.jenisKelamin || '-'}</Typography>
              
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>Alamat:</Typography>
              <Typography variant="body2">{formData.alamat || '-'}</Typography>
              
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>Pendidikan:</Typography>
              <Typography variant="body2">Pendidikan Terakhir: {formData.pendidikanTerakhir || '-'}</Typography>
              <Typography variant="body2">Jurusan: {formData.jurusan || '-'}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenConfirmDialog(false)} 
              color="inherit"
              variant="outlined"
              startIcon={<Cancel />}
            >
              Kembali Edit
            </Button>
            <Button 
              onClick={() => handleSubmit()} 
              color="success" 
              variant="contained"
              autoFocus
              startIcon={<Save />}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Menyimpan...
                </>
              ) : (
                "Ya, Simpan Data"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default EditProfile;