import {
  Typography,
  Box,
  Grid,
  Stack,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assessment as ReportIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

import PremiumCheck from "../../../components/rekrutmen/adminPT/PremiumCheck";


const Dashboard = () => {
  // Data statistik contoh
  const stats = [
    {
      title: "Total Pelamar",
      value: "124",
      icon: <PeopleIcon fontSize="large" />,
    },
    {
      title: "Lowongan Aktif",
      value: "8",
      icon: <WorkIcon fontSize="large" />,
    },
    {
      title: "Perlu Ditinjau",
      value: "23",
      icon: <ScheduleIcon fontSize="large" />,
    },
    {
      title: "Diterima Bulan Ini",
      value: "42",
      icon: <ReportIcon fontSize="large" />,
    },
  ];






  return (
    <PremiumCheck>
    <Box
      sx={{
        width: "90%",
        maxWidth: "90%", // Pastikan tidak melebihi lebar parent
        overflowX: "hidden", // Hindari horizontal scroll
      }}
    >
      {/* Header */}
      <Typography className="header text-secondary" variant="h4" gutterBottom>
        Dashboard Admin PT
      </Typography>

      <Typography className="text-secondary" variant="subtitle1" sx={{ mb: 4 }}>
        Selamat datang kembali! Berikut ringkasan aktivitas rekrutmen terbaru.
      </Typography>

      {/* Statistik Cepat */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                bgcolor: "#535C91",
                color: "white",
                borderRadius: "8px",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "primary.light",
                      borderRadius: "50%",
                      color: "primary.contrastText",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="div">
                      {item.value}
                    </Typography>
                    <Typography variant="body2">{item.title}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Ringkasan Sistem */}
      <Card
        sx={{
          bgcolor: "#070F2B",
          borderRadius: "8px",
          p: 4,
          boxShadow: "0 0 20px rgba(0,0,0,0.9)",
          borderLeft: "1px solid rgba(255,255,255,0.0)",
          borderRight: "1px solid rgba(255,255,255,0.0)",
          position: "relative",
          overflow: "visible",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "10%",
            left: "-10px",
            width: "10px",
            height: "80%",
            background: "rgba(0,0,0,0.6)",
            filter: "blur(5px)",
            borderRadius: "8px 0 0 8px",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "10%",
            right: "-10px",
            width: "10px",
            height: "80%",
            background: "rgba(0,0,0,0.6)",
            filter: "blur(5px)",
            borderRadius: "0 8px 8px 0",
          },
        }}
      >
        <Typography
          className="text-secondary"
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          Ringkasan Sistem
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                bgcolor: "#535C91",
                borderRadius: 2,
                color: "white",
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Lowongan Terbaru
              </Typography>
              <Typography variant="body2">
                Daftar lowongan yang baru saja diposting akan muncul di sini.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                bgcolor: "#535C91",
                color: "white",
                borderRadius: 2,
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Aktivitas Terkini
              </Typography>
              <Typography variant="body2" color="">
                Riwayat aktivitas sistem akan ditampilkan di bagian ini.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* tampilkan jenis soal dari api */}
            {/* tampilkan jenis soal dari api */}
     
      

     
    </Box>
    </PremiumCheck>
  );
};

export default Dashboard;
