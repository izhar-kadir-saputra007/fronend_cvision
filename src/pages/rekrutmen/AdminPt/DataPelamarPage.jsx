import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import axios from "axios";

const DataPelamarPage = () => {
  // State untuk data
  const [dataPelamar, setDataPelamar] = useState([]);
  const [dataTersaring, setDataTersaring] = useState([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pelamarTerpilih, setPelamarTerpilih] = useState(null);
  const [totalStats, setTotalStats] = useState({ totalLowongan: 0, totalPelamar: 0 });
  
  // State untuk dialog dan menu
  const [bukaDetail, setBukaDetail] = useState(false);
  const [bukaMenu, setBukaMenu] = useState(null);
  const [bukaFilter, setBukaFilter] = useState(false);
  
  // State untuk filter
  const [kataPencarian, setKataPencarian] = useState("");
  const [filterPosisi, setFilterPosisi] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPendidikan, setFilterPendidikan] = useState("");
  const [filterStatusTes, setFilterStatusTes] = useState("");
  const [filterKecocokanResume, setFilterKecocokanResume] = useState("");
  const [daftarPosisi, setDaftarPosisi] = useState([]);
  const [daftarPendidikan, setDaftarPendidikan] = useState([]);
  const [daftarStatus] = useState([
    "menunggu",
    "diterima",
    "ditolak"
  ]);

  // Ambil data pelamar dari API
  useEffect(() => {
    const ambilDataPelamar = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/getPelamarByPT`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        const { pelamar, totalLowongan, totalPelamar } = response.data.data;
        setDataPelamar(pelamar);
        setDataTersaring(pelamar);
        setTotalStats({ totalLowongan, totalPelamar });
        
        // Ambil daftar posisi unik untuk filter
        const posisi = [...new Set(pelamar.map(item => item.lowongan.judul))];
        setDaftarPosisi(posisi);
        
        // Ambil daftar pendidikan unik untuk filter
        const pendidikan = [...new Set(pelamar
          .filter(item => item.pelamar.pendidikanTerakhir)
          .map(item => item.pelamar.pendidikanTerakhir))];
        setDaftarPendidikan(pendidikan);
        
      } catch (error) {
        console.error("Gagal mengambil data pelamar:", error);
      } finally {
        setSedangMemuat(false);
      }
    };

    ambilDataPelamar();
  }, []);

  // Fungsi untuk menyaring data
  useEffect(() => {
    let hasil = dataPelamar;
    
    if (kataPencarian) {
      const term = kataPencarian.toLowerCase();
      hasil = hasil.filter(pelamar => 
        pelamar.pelamar.name.toLowerCase().includes(term) ||
        pelamar.pelamar.email.toLowerCase().includes(term) ||
        (pelamar.pelamar.alamat && pelamar.pelamar.alamat.toLowerCase().includes(term)) ||
        (pelamar.pelamar.jurusan && pelamar.pelamar.jurusan.toLowerCase().includes(term)) ||
        (pelamar.resume && pelamar.resume.prediksiKategori && pelamar.resume.prediksiKategori.toLowerCase().includes(term)) ||
        (pelamar.resume && pelamar.resume.posisiPrediksi && pelamar.resume.posisiPrediksi.toLowerCase().includes(term))
      );
    }
    
    if (filterPosisi) {
      hasil = hasil.filter(pelamar => 
        pelamar.lowongan.judul === filterPosisi
      );
    }
    
    if (filterStatus) {
      hasil = hasil.filter(pelamar => 
        pelamar.status === filterStatus
      );
    }
    
    if (filterPendidikan) {
      hasil = hasil.filter(pelamar => 
        pelamar.pelamar.pendidikanTerakhir === filterPendidikan
      );
    }
    
    if (filterStatusTes) {
      if (filterStatusTes === "selesai") {
        hasil = hasil.filter(pelamar => pelamar.isFinishTest === true);
      } else if (filterStatusTes === "belum") {
        hasil = hasil.filter(pelamar => pelamar.isFinishTest === false);
      }
    }
    
    if (filterKecocokanResume) {
      hasil = hasil.filter(pelamar => 
        pelamar.resume && pelamar.resume.statusKecocokan === filterKecocokanResume
      );
    }
    
    setDataTersaring(hasil);
  }, [kataPencarian, filterPosisi, filterStatus, filterPendidikan, filterStatusTes, filterKecocokanResume, dataPelamar]);

  // Fungsi untuk warna status
  const warnaStatus = (status) => {
    switch (status) {
      case "diterima":
        return "success";
      case "ditolak":
        return "error";
      case "menunggu":
        return "warning";
      default:
        return "info";
    }
  };

  // Fungsi untuk teks status yang lebih user-friendly
  const teksStatus = (status) => {
    switch (status) {
      case "menunggu":
        return "Menunggu Review";
      case "diterima":
        return "Diterima";
      case "ditolak":
        return "Ditolak";
      default:
        return status;
    }
  };

  // Fungsi untuk mendapatkan rata-rata skor tes
  const hitungRataSkor = (hasilTes) => {
    if (!hasilTes || hasilTes.length === 0) return null;
    const totalSkor = hasilTes.reduce((sum, tes) => sum + tes.skor, 0);
    return Math.round(totalSkor / hasilTes.length);
  };

  // Fungsi untuk warna kecocokan resume
  const warnaKecocokan = (statusKecocokan) => {
    switch (statusKecocokan) {
      case "cocok":
        return "success";
      case "tidak cocok":
        return "error";
      default:
        return "default";
    }
  };

  // Fungsi untuk reset filter
  const aturUlangFilter = () => {
    setKataPencarian("");
    setFilterPosisi("");
    setFilterStatus("");
    setFilterPendidikan("");
    setFilterStatusTes("");
    setFilterKecocokanResume("");
    setDataTersaring(dataPelamar);
  };

  // Tampilkan loading jika data sedang dimuat
  if (sedangMemuat) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header dan Statistics Cards */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: 'white' }}>
            Daftar Pelamar
          </Typography>
          
          <Box>
            <IconButton
              onClick={(e) => setBukaMenu(e.currentTarget)}
              sx={{ color: "primary.main" }}
            >
              <DownloadIcon />
            </IconButton>
            <Menu
              anchorEl={bukaMenu}
              open={Boolean(bukaMenu)}
              onClose={() => setBukaMenu(null)}
            >
              <MenuItem onClick={() => { console.log("Unduh PDF"); setBukaMenu(null); }}>
                <PdfIcon sx={{ mr: 1 }} /> Unduh PDF
              </MenuItem>
              <MenuItem onClick={() => { console.log("Unduh Excel"); setBukaMenu(null); }}>
                <ExcelIcon sx={{ mr: 1 }} /> Unduh Excel
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {totalStats.totalLowongan}
                    </Typography>
                    <Typography color="text.secondary">Total Lowongan</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {totalStats.totalPelamar}
                    </Typography>
                    <Typography color="text.secondary">Total Pelamar</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {dataPelamar.filter(p => p.isFinishTest).length}
                    </Typography>
                    <Typography color="text.secondary">Selesai Tes</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PsychologyIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {dataPelamar.filter(p => p.resume && p.resume.statusKecocokan === "cocok").length}
                    </Typography>
                    <Typography color="text.secondary">Resume Cocok</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Bagian Pencarian dan Filter */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            <input
              placeholder="Cari berdasarkan nama, email, alamat, jurusan, atau prediksi resume..."
              value={kataPencarian}
              onChange={(e) => setKataPencarian(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem',
                padding: '8px 0'
              }}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setBukaFilter(!bukaFilter)}
          >
            Filter
          </Button>
          {(kataPencarian || filterPosisi || filterStatus || filterPendidikan || filterStatusTes || filterKecocokanResume) && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={aturUlangFilter}
            >
              Reset
            </Button>
          )}
        </Box>

        {bukaFilter && (
          <Box sx={{ 
            p: 2, 
            border: '1px solid #ddd', 
            borderRadius: 1,
            display: 'grid',
            gridTemplateColumns: { lg: '1fr 1fr 1fr 1fr 1fr', md: '1fr 1fr 1fr', sm: '1fr 1fr', xs: '1fr' },
            gap: 2
          }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Posisi</Typography>
              <select
                value={filterPosisi}
                onChange={(e) => setFilterPosisi(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Semua posisi</option>
                {daftarPosisi.map((posisi) => (
                  <option key={posisi} value={posisi}>
                    {posisi}
                  </option>
                ))}
              </select>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Status Seleksi</Typography>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Semua status</option>
                {daftarStatus.map((status) => (
                  <option key={status} value={status}>
                    {teksStatus(status)}
                  </option>
                ))}
              </select>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Pendidikan</Typography>
              <select
                value={filterPendidikan}
                onChange={(e) => setFilterPendidikan(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Semua pendidikan</option>
                {daftarPendidikan.map((pendidikan) => (
                  <option key={pendidikan} value={pendidikan}>
                    {pendidikan}
                  </option>
                ))}
              </select>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Status Tes</Typography>
              <select
                value={filterStatusTes}
                onChange={(e) => setFilterStatusTes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Semua</option>
                <option value="selesai">Selesai Tes</option>
                <option value="belum">Belum Tes</option>
              </select>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Kecocokan Resume</Typography>
              <select
                value={filterKecocokanResume}
                onChange={(e) => setFilterKecocokanResume(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Semua</option>
                <option value="cocok">Cocok</option>
                <option value="tidak cocok">Tidak Cocok</option>
              </select>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Tabel Data Pelamar */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell>Pelamar</TableCell>
                <TableCell>Lowongan</TableCell>
                <TableCell>Pendidikan</TableCell>
                <TableCell>Resume Analysis</TableCell>
                <TableCell>Status Tes</TableCell>
                <TableCell>Rata-rata Skor</TableCell>
                <TableCell>Status Seleksi</TableCell>
                <TableCell>Tanggal Melamar</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTersaring.length > 0 ? (
                dataTersaring.map((pelamar) => (
                  <TableRow key={pelamar.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          src={
                            pelamar.pelamar.fotoProfil
                              ? `${import.meta.env.VITE_BASE_URL}/${pelamar.pelamar.fotoProfil.replace(/\\/g, "/")}`
                              : undefined
                          }
                          alt={pelamar.pelamar.name}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography fontWeight="medium">{pelamar.pelamar.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pelamar.pelamar.email}
                          </Typography>
                          {pelamar.pelamar.jenisKelamin && (
                            <Typography variant="caption" color="text.secondary">
                              {pelamar.pelamar.jenisKelamin}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography fontWeight="medium">{pelamar.lowongan.judul}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pelamar.lowongan.perusahaan}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pelamar.lowongan.jenisTes.map(tes => tes.nama).join(", ")}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography>
                          {pelamar.pelamar.pendidikanTerakhir || "-"}
                        </Typography>
                        {pelamar.pelamar.jurusan && (
                          <Typography variant="body2" color="text.secondary">
                            {pelamar.pelamar.jurusan}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {pelamar.resume ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {pelamar.resume.prediksiKategori}
                          </Typography>
                         
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption">
                              {pelamar.resume.probabilitasPersen}
                            </Typography>
                            <Chip
                              label={pelamar.resume.statusKecocokan}
                              color={warnaKecocokan(pelamar.resume.statusKecocokan)}
                              size="small"
                            />
                          </Box>
                          
                        </Box>
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          Belum ada resume
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pelamar.isFinishTest ? "Selesai" : "Belum"}
                        color={pelamar.isFinishTest ? "success" : "warning"}
                        size="small"
                        icon={pelamar.isFinishTest ? <CheckCircleIcon /> : <ScheduleIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      {pelamar.hasilTes && pelamar.hasilTes.length > 0 ? (
                        <Box>
                          <Typography fontWeight="medium">
                            {hitungRataSkor(pelamar.hasilTes)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            dari {pelamar.hasilTes.length} tes
                          </Typography>
                        </Box>
                      ) : (
                        <Typography color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={teksStatus(pelamar.status)}
                        color={warnaStatus(pelamar.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(pelamar.tanggalMelamar).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setPelamarTerpilih(pelamar);
                          setBukaDetail(true);
                        }}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog Detail Pelamar */}
      <Dialog
        open={bukaDetail}
        onClose={() => setBukaDetail(false)}
        maxWidth="md"
        fullWidth
      >
        {pelamarTerpilih && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">Detail Pelamar</Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {/* Profil Pelamar */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Profil Pelamar
                </Typography>
                <Box sx={{ pl: 2, display: "flex", gap: 3, alignItems: "flex-start" }}>
                  <Avatar
                    src={
                      pelamarTerpilih.pelamar.fotoProfil
                        ? `${import.meta.env.VITE_BASE_URL}/${pelamarTerpilih.pelamar.fotoProfil.replace(/\\/g, "/")}`
                        : undefined
                    }
                    alt={pelamarTerpilih.pelamar.name}
                    sx={{ width: 80, height: 80 }}
                  >
                    <PersonIcon />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography><strong>Nama:</strong> {pelamarTerpilih.pelamar.name}</Typography>
                    <Typography><strong>Email:</strong> {pelamarTerpilih.pelamar.email}</Typography>
                    <Typography><strong>Jenis Kelamin:</strong> {pelamarTerpilih.pelamar.jenisKelamin || "-"}</Typography>
                    <Typography><strong>Alamat:</strong> {pelamarTerpilih.pelamar.alamat || "-"}</Typography>
                    <Typography>
                      <strong>Tanggal Lahir:</strong>{" "}
                      {pelamarTerpilih.pelamar.tanggalLahir
                        ? new Date(pelamarTerpilih.pelamar.tanggalLahir).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </Typography>
                    <Typography><strong>Pendidikan:</strong> {pelamarTerpilih.pelamar.pendidikanTerakhir || "-"}</Typography>
                    <Typography><strong>Jurusan:</strong> {pelamarTerpilih.pelamar.jurusan || "-"}</Typography>
                    <Typography>
                      <strong>Status:</strong>
                      <Chip
                        label={teksStatus(pelamarTerpilih.status)}
                        color={warnaStatus(pelamarTerpilih.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Informasi Lowongan */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Informasi Lowongan
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography><strong>Posisi:</strong> {pelamarTerpilih.lowongan.judul}</Typography>
                  <Typography><strong>Perusahaan:</strong> {pelamarTerpilih.lowongan.perusahaan}</Typography>
                  <Typography><strong>Jenis Tes:</strong> {pelamarTerpilih.lowongan.jenisTes.map(tes => tes.nama).join(", ")}</Typography>
                  <Typography>
                    <strong>Tanggal Melamar:</strong>{" "}
                    {new Date(pelamarTerpilih.tanggalMelamar).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Resume Analysis */}
              {pelamarTerpilih.resume && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PsychologyIcon color="primary" />
                      Analisis Resume
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography><strong>Nama File:</strong> {pelamarTerpilih.resume.namaFile}</Typography>
                          <Typography><strong>Prediksi Kategori:</strong> {pelamarTerpilih.resume.prediksiKategori}</Typography>
                          <Typography><strong>Posisi Prediksi:</strong> {pelamarTerpilih.resume.posisiPrediksi}</Typography>
                          <Typography><strong>Probabilitas:</strong> {pelamarTerpilih.resume.probabilitasPersen}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography>
                            <strong>Status Kecocokan:</strong>
                            <Chip
                              label={pelamarTerpilih.resume.statusKecocokan}
                              color={warnaKecocokan(pelamarTerpilih.resume.statusKecocokan)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                          
                          {/* Progress bar untuk confidence score */}
                         
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Status Tes */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Status Tes
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography>
                    <strong>Status:</strong>
                    <Chip
                      label={pelamarTerpilih.isFinishTest ? "Selesai" : "Belum Selesai"}
                      color={pelamarTerpilih.isFinishTest ? "success" : "warning"}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Box>

              {/* Hasil Tes */}
              {pelamarTerpilih.hasilTes && pelamarTerpilih.hasilTes.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Hasil Tes
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {pelamarTerpilih.hasilTes.map((tes, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                          <Typography><strong>Jenis Tes:</strong> {tes.jenisTes}</Typography>
                          <Typography><strong>Skor:</strong> {tes.skor}</Typography>
                          <Typography>
                            <strong>Tanggal Tes:</strong>{" "}
                            {new Date(tes.tanggalTes).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </Typography>
                        </Box>
                      ))}
                      <Typography variant="body2" color="primary">
                        <strong>Rata-rata Skor: {hitungRataSkor(pelamarTerpilih.hasilTes)}</strong>
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBukaDetail(false)}>Tutup</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DataPelamarPage;