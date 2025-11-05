import  { useState } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  HowToReg as HowToRegIcon,
  Login as LoginIcon,
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  Psychology as PsychologyIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Grading as GradingIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import register from '../../assets/images/artikel2.png';
const PanduanPengguna = () => {
  const [activeMenu, setActiveMenu] = useState('registrasi-akun');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setMobileOpen(false);
  };

  const menuItems = [
    {
      category: 'Calon Karyawan',
      items: [
        { id: 'registrasi-akun', label: 'Registrasi Akun', icon: <HowToRegIcon /> },
        { id: 'login-sistem', label: 'Login ke Sistem', icon: <LoginIcon /> },
        { id: 'unggah-cv', label: 'Unggah CV PDF', icon: <CloudUploadIcon /> },
        { id: 'hasil-evaluasi', label: 'Melihat Hasil Evaluasi CV', icon: <VisibilityIcon /> },
        { id: 'psikotes', label: 'Mengikuti Psikotes', icon: <PsychologyIcon /> }
      ]
    },
    {
      category: 'Admin PT',
      items: [
        { id: 'login-admin', label: 'Login sebagai Admin', icon: <AdminPanelSettingsIcon /> },
        { id: 'tambah-lowongan', label: 'Menambahkan Lowongan Kerja', icon: <WorkIcon /> },
        { id: 'daftar-pelamar', label: 'Melihat Daftar Pelamar', icon: <PeopleIcon /> },
        { id: 'cek-evaluasi', label: 'Mengecek Hasil Evaluasi CV', icon: <AssignmentIcon /> },
        { id: 'kelola-psikotes', label: 'Mengelola Psikotes', icon: <GradingIcon /> }
      ]
    }
  ];

  const panduanContent = {
    'registrasi-akun': {
      title: 'Panduan Registrasi Akun',
      image: register,
      steps: [
        { 
          title: 'Buka Halaman Registrasi', 
          content: 'Buka halaman pendaftaran dan klik tombol "Daftar Sekarang".',
          image: register
        },
        { 
          title: 'Isi Formulir', 
          content: 'Isi semua field yang diperlukan seperti nama, email, dan password.',
          image: 'https://placehold.co/400x250/3B82F6/FFFFFF?text=Formulir+Registrasi' 
        },
        { 
          title: 'Verifikasi Email', 
          content: 'Periksa email Anda untuk tautan verifikasi dan klik untuk mengaktifkan akun.',
          image: 'https://placehold.co/400x250/3B82F6/FFFFFF?text=Verifikasi+Email' 
        },
        { 
          title: 'Lengkapi Profil', 
          content: 'Setelah login, lengkapi informasi profil Anda di dashboard.',
          image: 'https://placehold.co/400x250/3B82F6/FFFFFF?text=Lengkapi+Profil' 
        }
      ]
    },
    'login-sistem': {
      title: 'Panduan Login ke Sistem',
      image: 'https://placehold.co/600x400/10B981/FFFFFF?text=Login+Sistem',
      steps: [
        { 
          title: 'Buka Halaman Login', 
          content: 'Kunjungi halaman login dan masukkan kredensial Anda.',
          image: 'https://placehold.co/400x250/10B981/FFFFFF?text=Halaman+Login' 
        },
        { 
          title: 'Masukkan Email dan Password', 
          content: 'Masukkan alamat email dan password yang Anda daftarkan.',
          image: 'https://placehold.co/400x250/10B981/FFFFFF?text=Email+Password' 
        },
        { 
          title: 'Klik Tombol Login', 
          content: 'Setelah memasukkan kredensial, klik tombol "Masuk" untuk mengakses sistem.',
          image: 'https://placehold.co/400x250/10B981/FFFFFF?text=Tombol+Login' 
        },
        { 
          title: 'Lupa Password', 
          content: 'Jika lupa password, gunakan fitur "Lupa Password" untuk meresetnya.',
          image: 'https://placehold.co/400x250/10B981/FFFFFF?text=Lupa+Password' 
        }
      ]
    },
    'unggah-cv': {
      title: 'Panduan Unggah CV PDF',
      image: 'https://placehold.co/600x400/F59E0B/FFFFFF?text=Unggah+CV',
      steps: [
        { 
          title: 'Akses Menu CV', 
          content: 'Setelah login, navigasi ke bagian "Kelola CV" di dashboard Anda.',
          image: 'https://placehold.co/400x250/F59E0B/FFFFFF?text=Menu+CV' 
        },
        { 
          title: 'Pilih File PDF', 
          content: 'Klik tombol "Unggah CV" dan pilih file PDF dari perangkat Anda.',
          image: 'https://placehold.co/400x250/F59E0B/FFFFFF?text=Pilih+PDF' 
        },
        { 
          title: 'Upload dan Konfirmasi', 
          content: 'Tunggu hingga proses upload selesai dan konfirmasi keberhasilannya.',
          image: 'https://placehold.co/400x250/F59E0B/FFFFFF?text=Konfirmasi+Upload' 
        },
        { 
          title: 'Periksa Kembali', 
          content: 'Pastikan CV yang diunggah sudah benar dan terbaca dengan baik.',
          image: 'https://placehold.co/400x250/F59E0B/FFFFFF?text=Periksa+CV' 
        }
      ]
    },
    'hasil-evaluasi': {
      title: 'Panduan Melihat Hasil Evaluasi CV',
      image: 'https://placehold.co/600x400/EF4444/FFFFFF?text=Hasil+Evaluasi',
      steps: [
        { 
          title: 'Masuk ke Dashboard', 
          content: 'Login ke akun Anda dan acess dashboard pribadi.',
          image: 'https://placehold.co/400x250/EF4444/FFFFFF?text=Dashboard' 
        },
        { 
          title: 'Cari Bagian Hasil', 
          content: 'Cari bagian "Status Lamaran" atau "Hasil Evaluasi".',
          image: 'https://placehold.co/400x250/EF4444/FFFFFF?text=Hasil+Evaluasi' 
        },
        { 
          title: 'Lihat Status', 
          content: 'Klik untuk melihat detail hasil evaluasi CV Anda.',
          image: 'https://placehold.co/400x250/EF4444/FFFFFF?text=Status+Lamaran' 
        },
        { 
          title: 'Unduh Feedback', 
          content: 'Jika tersedia, unduh feedback dari tim rekrutmen.',
          image: 'https://placehold.co/400x250/EF4444/FFFFFF?text=Feedback' 
        }
      ]
    },
    'psikotes': {
      title: 'Panduan Mengikuti Psikotes',
      image: 'https://placehold.co/600x400/8B5CF6/FFFFFF?text=Psikotes',
      steps: [
        { 
          title: 'Terima Undangan', 
          content: 'Periksa email untuk undangan psikotes beserta jadwalnya.',
          image: 'https://placehold.co/400x250/8B5CF6/FFFFFF?text=Undangan+Psikotes' 
        },
        { 
          title: 'Siapkan Perangkat', 
          content: 'Pastikan Anda memiliki koneksi internet stabil dan perangkat yang sesuai.',
          image: 'https://placehold.co/400x250/8B5CF6/FFFFFF?text=Siapkan+Perangkat' 
        },
        { 
          title: 'Ikuti Instruksi', 
          content: 'Ikuti semua instruksi yang diberikan selama tes berlangsung.',
          image: 'https://placehold.co/400x250/8B5CF6/FFFFFF?text=Instruksi+Psikotes' 
        },
        { 
          title: 'Selesaikan Semua Bagian', 
          content: 'Pastikan Anda menyelesaikan semua bagian tes sebelum waktu habis.',
          image: 'https://placehold.co/400x250/8B5CF6/FFFFFF?text=Selesaikan+Tes' 
        }
      ]
    },
    'login-admin': {
      title: 'Panduan Login sebagai Admin',
      image: 'https://placehold.co/600x400/06B6D4/FFFFFF?text=Login+Admin',
      steps: [
        { 
          title: 'Akses Halaman Admin', 
          content: 'Buka halaman login admin dengan URL yang telah disediakan.',
          image: 'https://placehold.co/400x250/06B6D4/FFFFFF?text=Halaman+Admin' 
        },
        { 
          title: 'Masukkan Kredensial', 
          content: 'Gunakan username dan password admin yang telah diberikan.',
          image: 'https://placehold.co/400x250/06B6D4/FFFFFF?text=Kredensial+Admin' 
        },
        { 
          title: 'Two-Factor Authentication', 
          content: 'Jika ada, lengkapi proses two-factor authentication.',
          image: 'https://placehold.co/400x250/06B6D4/FFFFFF?text=2FA' 
        },
        { 
          title: 'Akses Dashboard Admin', 
          content: 'Setelah berhasil, Anda akan diarahkan ke dashboard admin.',
          image: 'https://placehold.co/400x250/06B6D4/FFFFFF?text=Dashboard+Admin' 
        }
      ]
    },
    'tambah-lowongan': {
      title: 'Panduan Menambahkan Lowongan Kerja',
      image: 'https://placehold.co/600x400/84CC16/FFFFFF?text=Lowongan+Kerja',
      steps: [
        { 
          title: 'Buka Menu Lowongan', 
          content: 'Dari dashboard admin, navigasi ke menu "Kelola Lowongan".',
          image: 'https://placehold.co/400x250/84CC16/FFFFFF?text=Menu+Lowongan' 
        },
        { 
          title: 'Klik Tambah Lowongan', 
          content: 'Klik tombol "Tambah Lowongan Baru" untuk memulai.',
          image: 'https://placehold.co/400x250/84CC16/FFFFFF?text=Tambah+Lowongan' 
        },
        { 
          title: 'Isi Detail Lowongan', 
          content: 'Isi semua informasi lowongan seperti judul, deskripsi, dan persyaratan.',
          image: 'https://placehold.co/400x250/84CC16/FFFFFF?text=Detail+Lowongan' 
        },
        { 
          title: 'Publikasikan', 
          content: 'Setelah selesai, publikasikan lowongan agar visible bagi pelamar.',
          image: 'https://placehold.co/400x250/84CC16/FFFFFF?text=Publikasikan' 
        }
      ]
    },
    'daftar-pelamar': {
      title: 'Panduan Melihat Daftar Pelamar',
      image: 'https://placehold.co/600x400/F97316/FFFFFF?text=Daftar+Pelamar',
      steps: [
        { 
          title: 'Akses Menu Pelamar', 
          content: 'Dari dashboard, pilih menu "Daftar Pelamar" atau "Manajemen Kandidat".',
          image: 'https://placehold.co/400x250/F97316/FFFFFF?text=Menu+Pelamar' 
        },
        { 
          title: 'Pilih Lowongan', 
          content: 'Pilih lowongan kerja tertentu untuk melihat daftar pelamarnya.',
          image: 'https://placehold.co/400x250/F97316/FFFFFF?text=Pilih+Lowongan' 
        },
        { 
          title: 'Filter dan Sortir', 
          content: 'Gunakan filter dan sortir untuk menemukan kandidat tertentu.',
          image: 'https://placehold.co/400x250/F97316/FFFFFF?text=Filter+Pelamar' 
        },
        { 
          title: 'Ekspor Data', 
          content: 'Jika diperlukan, ekspor data pelamar ke format Excel atau CSV.',
          image: 'https://placehold.co/400x250/F97316/FFFFFF?text=Ekspor+Data' 
        }
      ]
    },
    'cek-evaluasi': {
      title: 'Panduan Mengecek Hasil Evaluasi CV',
      image: 'https://placehold.co/600x400/EC4899/FFFFFF?text=Evaluasi+CV',
      steps: [
        { 
          title: 'Buka Menu Evaluasi', 
          content: 'Akses menu "Evaluasi CV" atau "Penilaian Kandidat".',
          image: 'https://placehold.co/400x250/EC4899/FFFFFF?text=Menu+Evaluasi' 
        },
        { 
          title: 'Pilih Kandidat', 
          content: 'Pilih kandidat tertentu untuk melihat CV dan detail profilnya.',
          image: 'https://placehold.co/400x250/EC4899/FFFFFF?text=Pilih+Kandidat' 
        },
        { 
          title: 'Beri Penilaian', 
          content: 'Beri penilaian pada setiap aspek yang dievaluasi.',
          image: 'https://placehold.co/400x250/EC4899/FFFFFF?text=Penilaian+CV' 
        },
        { 
          title: 'Simpan dan Update Status', 
          content: 'Simpan penilaian dan update status kandidat sesuai hasil evaluasi.',
          image: 'https://placehold.co/400x250/EC4899/FFFFFF?text=Update+Status' 
        }
      ]
    },
    'kelola-psikotes': {
      title: 'Panduan Mengelola Psikotes',
      image: 'https://placehold.co/600x400/78716C/FFFFFF?text=Kelola+Psikotes',
      steps: [
        { 
          title: 'Akses Modul Psikotes', 
          content: 'Buka menu "Pengelolaan Psikotes" dari dashboard admin.',
          image: 'https://placehold.co/400x250/78716C/FFFFFF?text=Modul+Psikotes' 
        },
        { 
          title: 'Jadwalkan Tes', 
          content: 'Atur jadwal tes untuk kandidat yang lolos tahap evaluasi CV.',
          image: 'https://placehold.co/400x250/78716C/FFFFFF?text=Jadwal+Tes' 
        },
        { 
          title: 'Kirim Undangan', 
          content: 'Kirim undangan beserta instruksi melalui email ke kandidat.',
          image: 'https://placehold.co/400x250/78716C/FFFFFF?text=Kirim+Undangan' 
        },
        { 
          title: 'Pantau Hasil', 
          content: 'Pantau hasil psikotes dan update status kandidat accordingly.',
          image: 'https://placehold.co/400x250/78716C/FFFFFF?text=Pantau+Hasil' 
        }
      ]
    }
  };

  const drawer = (
    <div className="h-full bg-white flex flex-col">
      <div className="p-4 pt-12 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-secondary">Menu Panduan</h2>
        <IconButton onClick={handleDrawerToggle} className="md:hidden sx=" sx={{ color: '#00C3FE' }}>
          <CloseIcon />
        </IconButton>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((category, index) => (
          <div key={index} className="mb-2">
            <div className="px-4 py-2 font-medium text-primary font-lobster text-xl text-center">
              {category.category}
            </div>
         <List sx={{ py: 0 }}>
  {category.items.map((item) => (
    <ListItem 
      key={item.id} 
      disablePadding 
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <ListItemButton
        selected={activeMenu === item.id}
        onClick={() => handleMenuClick(item.id)}
        sx={{
          py: 1.5,
          "&.Mui-selected": {
            bgcolor: "#9290C3",   // biru aktif
            color: "#E9EDFF",     // teks kuning
            "& .MuiListItemIcon-root": {
              color: "#E9EDFF",   // ikon juga kuning
            },
          },
          "&:hover": {
            bgcolor: "#e6f9ff",   // biru muda hover
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: activeMenu === item.id ? "#9290C3" : "#070F2B",
            minWidth: 32,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: activeMenu === item.id ? "600" : "400",
          }}
        />
      </ListItemButton>
    </ListItem>
  ))}
</List>

            {index < menuItems.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );

  const activeContent = panduanContent[activeMenu];

  return (
    <div className="min-h-screen bg-color2 font-roboto flex flex-col">
      {/* Header - Fixed dengan z-index tinggi */}
      <header className="bg-color2 shadow-sm p-4 py-8 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <IconButton
            className="md:hidden mr-2"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <h1 className="text-2xl font-bold text-primary text-center">📖 Panduan Pengguna</h1>
        </div>
      </header>

      {/* Container utama dengan padding atas untuk header fixed */}
      <div className="flex flex-1 pt-24">
        {/* Sidebar for desktop - Fixed dan tidak ikut scroll */}
        <div className="w-64 pl- bg-color2 shadow-md hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {drawer}
        </div>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
          className="md:hidden"
        >
          {drawer}
        </Drawer>

        {/* Main Content - Dengan margin untuk sidebar desktop */}
        <div className="flex-1 p-4 md:ml-64 md:mt-0 mt-4">
          <div className="p-4 md:p-6 rounded-lg shadow">
            <div className="flex flex-col md:flex-row items-start mb-6">
              <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
                <img 
                  src={activeContent.image} 
                  alt={activeContent.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-2/3">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-secondary bg-opacity-10 text-secondary mr-3">
                    {menuItems
                      .flatMap(category => category.items)
                      .find(item => item.id === activeMenu)?.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {activeContent.title}
                  </h2>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Berikut adalah panduan lengkap untuk menggunakan fitur {activeContent.title.toLowerCase()}. Ikuti langkah-langkah di bawah ini dengan seksama.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Langkah-langkah:</h3>
              
              <div className="space-y-8">
  {activeContent.steps.map((step, index) => (
    <div key={index} className="flex flex-col">
      {/* Bagian gambar di atas */}
      <div className="mb-4">
        <img 
          src={step.image} 
          alt={step.title}
           style={{ width: '1000px' }}
          className="w-full h-auto mx-auto rounded-lg shadow-md"
        />
      </div>
      
      {/* Konten di bawah gambar */}
      <div className="flex">
        <div className="flex-shrink-0 mr-4">
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
            {index + 1}
          </div>
        </div>
        <div className="flex-1 mb-12 border-b pb-4">
          <h4 className="font-medium text-gray-800 text-lg">{step.title}</h4>
          <p className="text-gray-600 mt-2">{step.content}</p>
        </div>
      </div>
    </div>
  ))}
</div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">💡 Tips:</h4>
              <p className="text-blue-700">
                Pastikan Anda telah menyiapkan semua dokumen yang diperlukan sebelum memulai proses. 
                Jika mengalami kendala, hubungi tim support kami melalui email support@recruitment.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanduanPengguna;