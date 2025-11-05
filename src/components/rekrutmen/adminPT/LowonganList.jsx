import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Switch from "@mui/joy/Switch";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MoreVert from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";

import TambahSoalModal from "./TambahSoalModal";
import DetailLowonganModal from "./DetailLowonganModal";
import { getUsersByLowongan } from "../../../APIS/LowonganManagement";

const LowonganList = ({
  lowonganList,
  onViewApplicants,

  refreshData = () => {},
}) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [applicantCounts, setApplicantCounts] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lowonganToDelete, setLowonganToDelete] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentDownload, setCurrentDownload] = useState("");
  const [downloadingItems, setDownloadingItems] = useState({});
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLowonganId, setSelectedLowonganId] = useState(null);

  const fetchApplicantCounts = async () => {
    try {
      const counts = {};

      await Promise.all(
        lowonganList.map(async (lowongan) => {
          try {
            const response = await getUsersByLowongan(lowongan.id);
            // console.log("Response lengkap:", response); // Debug 1

            // Perbaikan 1: Akses data yang benar (response.data.data)
            const dataPelamar = response.data?.data || [];
            // console.log(`Data pelamar lowongan ${lowongan.id}:`, dataPelamar); // Debug 2

            // Perbaikan 2: Simpan ke objek counts
            counts[lowongan.id] = dataPelamar.length;
            // console.log(`Total pelamar lowongan ${lowongan.id}:`, counts[lowongan.id]); // Debug 3
          } catch (err) {
            console.error(`Error pada lowongan ${lowongan.id}:`, err);
            counts[lowongan.id] = 0; // Default value jika error
          }
        })
      );

      // console.log("Hasil akhir counts:", counts); // Debug 4
      setApplicantCounts(counts);
    } catch (error) {
      console.error("Error global:", error);
      toast.error("Gagal memuat jumlah pelamar");
    }
  };
  useEffect(() => {
    if (lowonganList.length > 0) {
      fetchApplicantCounts();
    }
  }, [lowonganList]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/updateStatusLowongan/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      refreshData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.message || "Gagal memperbarui status lowongan"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDetail = (id) => {
    setSelectedLowonganId(id);
    setDetailModalOpen(true);
  };

  // Fungsi untuk mengunduh laporan
  const downloadReport = async (url, fileName, format = "pdf") => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      const token = localStorage.getItem("token");
      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setDownloadProgress(percentCompleted);
        },
      });

      const formattedDate = new Date().toISOString().split("T")[0];
      const extension = format === "excel" ? "xlsx" : "pdf"; // Pastikan extension sesuai format
      const finalFileName = fileName.includes("_")
        ? `${fileName.split("_")[0]}_${formattedDate}.${extension}`
        : `${fileName}_${formattedDate}.${extension}`;

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", finalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Laporan berhasil diunduh (${format.toUpperCase()})`);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(`Gagal mengunduh ${currentDownload}`);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setCurrentDownload("");
    }
  };
  // Fungsi untuk laporan per lowongan
  const downloadLaporanLowongan = async (lowonganId, judulLowongan, format) => {
    setDownloadingItems((prev) => ({ ...prev, [lowonganId]: true }));
    setCurrentDownload(`Laporan_${judulLowongan}_${format.toUpperCase()}`);

    try {
      const endpoint =
        format === "pdf"
          ? `${
              import.meta.env.VITE_BASE_URL
            }/api/generatePelamarReport/${lowonganId}`
          : `${
              import.meta.env.VITE_BASE_URL
            }/api/downloadLaporanLowonganExcelPerLowongan/${lowonganId}`;

      await downloadReport(
        endpoint,
        `Laporan_Pelamar_${judulLowongan.replace(/[^a-z0-9]/gi, "_")}`,
        format // Pastikan format yang digunakan sesuai parameter
      );
    } catch (error) {
      toast.error(`Gagal mengunduh laporan ${format}: ${error.message}`);
    } finally {
      setDownloadingItems((prev) => ({ ...prev, [lowonganId]: false }));
      setCurrentDownload("");
    }
  };
  const downloadLaporanAllPelamar = async (format) => {
    try {
      setIsDownloading(true);
      setCurrentDownload(`Laporan_Semua_Pelamar_${format}`);
      setDownloadProgress(0);

      const endpoint =
        format === "pdf"
          ? `${import.meta.env.VITE_BASE_URL}/api/getAllPelamarReport`
          : `${import.meta.env.VITE_BASE_URL}/api/downloadlowonganLaporanExcel`;

      const response = await axios.get(endpoint, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setDownloadProgress(percentCompleted);
        },
      });

      const formattedDate = new Date().toISOString().split("T")[0];
      const extension = format === "excel" ? "xlsx" : "pdf";
      const finalFileName = `Laporan_Semua_Pelamar_${formattedDate}.${extension}`;

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", finalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Laporan berhasil diunduh (${format.toUpperCase()})`);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(`Gagal mengunduh laporan semua pelamar`);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setCurrentDownload("");
    }
  };
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/deleteLowongan/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      refreshData();
    } catch (error) {
      console.error("Error deleting lowongan:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus lowongan");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-20">
      {isDownloading && (
        <div className="fixed top-0 left-0 w-full bg-blue-50 z-50">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Mengunduh {currentDownload}... ({downloadProgress}%)
              </span>
              <button
                onClick={() => {
                  setIsDownloading(false);
                  setDownloadProgress(0);
                }}
                className="text-red-500 text-sm"
              >
                Batalkan
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <Typography
            level="h4"
            startDecorator={<WarningRoundedIcon color="danger" />}
            mb={2}
          >
            Konfirmasi Penghapusan
          </Typography>
          <Typography mb={3}>
            Apakah Anda yakin ingin menghapus lowongan ini? Aksi ini tidak dapat
            dibatalkan.
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="solid"
              color="danger"
              onClick={() => handleDelete(lowonganToDelete)}
            >
              Ya, Hapus
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Batal
            </Button>
          </div>
        </ModalDialog>
      </Modal>
      {lowonganList.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Tidak ada lowongan tersedia
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-4 gap-2">
            <Dropdown>
              <MenuButton
                slots={{ root: Button }}
                slotProps={{
                  root: {
                    variant: "solid",
                    color: "primary",
                    startDecorator: <DownloadIcon />,
                    loading:
                      isDownloading &&
                      currentDownload.startsWith("Laporan_Semua_Pelamar"),
                    disabled: isDownloading,
                  },
                }}
              >
                Unduh Semua Pelamar
              </MenuButton>
              <Menu>
                <MenuItem
                  onClick={() => {
                    setDownloadFormat("pdf");
                    downloadLaporanAllPelamar("pdf");
                  }}
                  disabled={
                    isDownloading &&
                    currentDownload === "Laporan_Semua_Pelamar_pdf"
                  }
                >
                  <div className="flex items-center gap-2">
                    {isDownloading &&
                    currentDownload === "Laporan_Semua_Pelamar_pdf" ? (
                      <>
                        <CircularProgress size="sm" />
                        <span>Mengunduh PDF...</span>
                      </>
                    ) : (
                      <>
                        <PictureAsPdfIcon fontSize="small" />
                        <span>Format PDF</span>
                      </>
                    )}
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDownloadFormat("excel");
                    downloadLaporanAllPelamar("excel");
                  }}
                  disabled={
                    isDownloading &&
                    currentDownload === "Laporan_Semua_Pelamar_excel"
                  }
                >
                  <div className="flex items-center gap-2">
                    {isDownloading &&
                    currentDownload === "Laporan_Semua_Pelamar_excel" ? (
                      <>
                        <CircularProgress size="sm" />
                        <span>Mengunduh Excel...</span>
                      </>
                    ) : (
                      <>
                        <GridOnIcon fontSize="small" />
                        <span>Format Excel</span>
                      </>
                    )}
                  </div>
                </MenuItem>
              </Menu>
            </Dropdown>

          <DetailLowonganModal 
        id={selectedLowonganId}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Jenis Soal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Tanggal Tutup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  jumlah pelamar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowonganList.map((lowongan) => (
                <tr key={lowongan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {lowongan.judul}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {lowongan.jenissoals?.length > 0 ? (
                        <div className="text-gray-700">
                          {lowongan.jenissoals.map((jenis, index) => (
                            <span key={jenis.id}>
                              {jenis.namaJenis}
                              {index < lowongan.jenissoals.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">
                          Belum ada soal psikotest
                        </span>
                      )}
                      <TambahSoalModal
                        lowonganId={lowongan.id}
                        refreshData={refreshData}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700">
                      {format(new Date(lowongan.tanggalTutup), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(lowongan.tanggalTutup) > new Date()
                        ? "Masih dibuka"
                        : "Sudah ditutup"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap ">
                    {applicantCounts[lowongan.id] !== undefined ? (
                      <div>
                        <span className="text-gray-700 font-medium">
                          <Avatar
                            sx={{
                              bgcolor: "green",
                              color: "white",
                              width: 24,
                              height: 24,
                            }}
                          >
                            {applicantCounts[lowongan.id]}
                          </Avatar>
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Memuat...</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Publish
                      </span>
                      <Switch
                        checked={lowongan.status === "active"}
                        onChange={(e) =>
                          handleStatusChange(
                            lowongan.id,
                            e.target.checked ? "active" : "unactive"
                          )
                        }
                        disabled={loadingStates[lowongan.id]}
                        color={
                          lowongan.status === "active" ? "success" : "neutral"
                        }
                        sx={{
                          "--Switch-thumbSize": "19px",
                          "--Switch-trackWidth": "38px",
                          "--Switch-trackHeight": "18px",
                          transition: "transform 0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Dropdown>
                      <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: {
                            variant: downloadingItems[lowongan.id]
                              ? "soft"
                              : "plain",
                            color: "neutral",
                            size: "sm",
                            loading: downloadingItems[lowongan.id],
                          },
                        }}
                        sx={{
                          borderRadius: "md",
                          transition: "all 0.3s ease",
                          ...(downloadingItems[lowongan.id] && {
                            bgcolor: "rgba(59, 130, 246, 0.1)",
                          }),
                        }}
                      >
                        {downloadingItems[lowongan.id] ? (
                          <CircularProgress
                            size="sm"
                            thickness={3}
                            sx={{
                              color: "neutral.500",
                              position: "absolute",
                            }}
                          />
                        ) : (
                          <MoreVert />
                        )}
                      </MenuButton>
                      <Menu placement="bottom-end">
                        <MenuItem onClick={() => onViewApplicants(lowongan.id)}>
                          Lihat Pelamar
                        </MenuItem>
                        <MenuItem onClick={() => handleDetail(lowongan.id)}>
                          Detail
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            downloadLaporanLowongan(
                              lowongan.id,
                              lowongan.judul,
                              "pdf"
                            )
                          }
                          disabled={
                            downloadingItems[lowongan.id] &&
                            downloadFormat === "pdf"
                          }
                        >
                          <div className="flex items-center gap-2 min-w-[120px]">
                            {downloadingItems[lowongan.id] &&
                            downloadFormat === "pdf" ? (
                              <>
                                <CircularProgress size="sm" />
                                <span>Mengunduh PDF...</span>
                              </>
                            ) : (
                              <>
                                <PictureAsPdfIcon fontSize="small" />
                                <span>Unduh PDF</span>
                              </>
                            )}
                          </div>
                        </MenuItem>

                        <MenuItem
                          onClick={() =>
                            downloadLaporanLowongan(
                              lowongan.id,
                              lowongan.judul,
                              "excel"
                            )
                          }
                          disabled={
                            downloadingItems[lowongan.id] &&
                            downloadFormat === "excel"
                          }
                        >
                          <div className="flex items-center gap-2 min-w-[120px]">
                            {downloadingItems[lowongan.id] &&
                            downloadFormat === "excel" ? (
                              <>
                                <CircularProgress size="sm" />
                                <span>Mengunduh Excel...</span>
                              </>
                            ) : (
                              <>
                                <GridOnIcon fontSize="small" />
                                <span>Unduh Excel</span>
                              </>
                            )}
                          </div>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setLowonganToDelete(lowongan.id);
                            setDeleteConfirmOpen(true);
                          }}
                          color="danger"
                        >
                          Hapus
                        </MenuItem>
                      </Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LowonganList;
