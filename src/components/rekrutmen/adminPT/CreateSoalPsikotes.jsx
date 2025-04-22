import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import DialogActions from '@mui/joy/DialogActions';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function CreateSoalPsikotes() {
  const [jenisSoalId, setJenisSoalId] = useState('');
  const [jenisSoalList, setJenisSoalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJenisSoal, setLoadingJenisSoal] = useState(true);
  const [soalList, setSoalList] = useState([{ 
    question: '', 
    options: [
      { answer: '', score: 0 },
      { answer: '', score: 0 }
    ] 
  }]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSoal, setPreviewSoal] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedJenisSoal, setSelectedJenisSoal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch jenis soal dari API
  useEffect(() => {
    fetchJenisSoal();
  }, []);

  const fetchJenisSoal = async () => {
    try {
      setLoadingJenisSoal(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getAllJenisSoal`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();

      if (!response.ok || !result.data || !Array.isArray(result.data)) {
        throw new Error(result.message || 'Gagal mengambil data jenis soal');
      }

      setJenisSoalList(result.data);
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat memuat jenis soal');
    } finally {
      setLoadingJenisSoal(false);
    }
  };

  // Fungsi untuk menghapus jenis soal
  const handleDeleteJenisSoal = async () => {
    if (!selectedJenisSoal) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/deleteJenisSoal/${selectedJenisSoal.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus jenis soal');
      }

      toast.success('Jenis soal berhasil dihapus');
      fetchJenisSoal(); // Refresh list
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat menghapus jenis soal');
    } finally {
      setDeleting(false);
    }
  };

  // Fungsi untuk membuka modal delete confirmation
  const openDeleteModal = (jenisSoal) => {
    setSelectedJenisSoal(jenisSoal);
    setDeleteModalOpen(true);
  };
  // Fungsi untuk melihat preview soal
  const handlePreviewSoal = async (jenisSoalId) => {
    setLoadingPreview(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getSoalByJenisSoalAdmin/${jenisSoalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengambil data soal');
      }

      setPreviewSoal(result.data || []);
      setShowPreviewModal(true);
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat memuat preview soal');
    } finally {
      setLoadingPreview(false);
    }
  };

  // Menambah soal baru
  const handleAddSoal = () => {
    setSoalList([...soalList, { 
      question: '', 
      options: [
        { answer: '', score: 0 },
        { answer: '', score: 0 }
      ] 
    }]);
  };

  // Menghapus soal
  const handleRemoveSoal = (index) => {
    if (soalList.length > 1) {
      const newSoalList = [...soalList];
      newSoalList.splice(index, 1);
      setSoalList(newSoalList);
    } else {
      toast.warning('Minimal harus ada satu soal');
    }
  };

  // Menambah opsi jawaban
  const handleAddOption = (soalIndex) => {
    const newSoalList = [...soalList];
    newSoalList[soalIndex].options.push({ answer: '', score: 0 });
    setSoalList(newSoalList);
  };

  // Menghapus opsi jawaban
  const handleRemoveOption = (soalIndex, optionIndex) => {
    const newSoalList = [...soalList];
    if (newSoalList[soalIndex].options.length > 2) {
      newSoalList[soalIndex].options.splice(optionIndex, 1);
      setSoalList(newSoalList);
    } else {
      toast.warning('Minimal harus ada 2 opsi jawaban');
    }
  };

  // Mengubah pertanyaan
  const handleQuestionChange = (index, value) => {
    const newSoalList = [...soalList];
    newSoalList[index].question = value;
    setSoalList(newSoalList);
  };

  // Mengubah opsi jawaban
  const handleOptionChange = (soalIndex, optionIndex, field, value) => {
    const newSoalList = [...soalList];
    newSoalList[soalIndex].options[optionIndex][field] = 
      field === 'score' ? Number(value) : value;
    setSoalList(newSoalList);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!jenisSoalId) {
      toast.error('Pilih jenis soal terlebih dahulu');
      setLoading(false);
      return;
    }

    // Validasi input
    for (let i = 0; i < soalList.length; i++) {
      const soal = soalList[i];
      if (!soal.question.trim()) {
        toast.error(`Pertanyaan soal #${i + 1} tidak boleh kosong`);
        setLoading(false);
        return;
      }

      // Validasi setiap opsi harus memiliki answer dan score
      for (let j = 0; j < soal.options.length; j++) {
        if (!soal.options[j].answer?.trim()) {
          toast.error(`Jawaban opsi ${j + 1} pada soal #${i + 1} tidak boleh kosong`);
          setLoading(false);
          return;
        }
        if (isNaN(soal.options[j].score)) {
          toast.error(`Score opsi ${j + 1} pada soal #${i + 1} harus berupa angka`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/soal-psikotes/${jenisSoalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          soalList: soalList.map(soal => ({
            question: soal.question,
            options: soal.options.map(option => ({
              answer: option.answer,
              score: Number(option.score)
            }))
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat soal psikotes');
      }

      toast.success('Soal psikotes berhasil dibuat!');
      setSoalList([{ 
        question: '', 
        options: [
          { answer: '', score: 0 },
          { answer: '', score: 0 }
        ] 
      }]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-color2">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Soal Psikotes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom untuk membuat soal */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label htmlFor="jenisSoal" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Soal <span className="text-red-500">*</span>
              </label>
              <select
                id="jenisSoal"
                value={jenisSoalId}
                onChange={(e) => setJenisSoalId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loadingJenisSoal}
              >
                <option value="">Pilih Jenis Soal</option>
                {jenisSoalList.map((jenis) => (
                  <option key={jenis.id} value={jenis.id}>{jenis.namaJenis}</option>
                ))}
              </select>
              {loadingJenisSoal && <p className="mt-1 text-sm text-gray-500">Memuat jenis soal...</p>}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Daftar Soal</h2>
                <button
                  type="button"
                  onClick={handleAddSoal}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                >
                  Tambah Soal
                </button>
              </div>

              {soalList.map((soal, soalIndex) => (
                <div key={soalIndex} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveSoal(soalIndex)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Hapus soal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div className="mb-4">
                    <label htmlFor={`question-${soalIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Pertanyaan {soalIndex + 1} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`question-${soalIndex}`}
                      value={soal.question}
                      onChange={(e) => handleQuestionChange(soalIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan pertanyaan"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="block text-sm font-medium text-gray-700">Opsi Jawaban <span className="text-red-500">*</span></p>
                      <button
                        type="button"
                        onClick={() => handleAddOption(soalIndex)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs font-medium"
                      >
                        + Tambah Opsi
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {soal.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-6 text-sm text-gray-500">{optionIndex + 1}.</span>
                            <input
                              type="text"
                              value={option.answer}
                              onChange={(e) => handleOptionChange(soalIndex, optionIndex, 'answer', e.target.value)}
                              className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Teks jawaban"
                              required
                            />
                            <input
                              type="number"
                              value={option.score}
                              onChange={(e) => handleOptionChange(soalIndex, optionIndex, 'score', e.target.value)}
                              className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Score"
                              min="0"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(soalIndex, optionIndex)}
                            className="text-red-500 hover:text-red-700"
                            title="Hapus opsi"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? 'Menyimpan...' : 'Simpan Soal Psikotes'}
            </button>
          </form>
        </div>

       {/* Kolom untuk daftar jenis soal */}
       <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Daftar Jenis Soal</h2>
          
          {loadingJenisSoal ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {jenisSoalList.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Tidak ada jenis soal tersedia</p>
              ) : (
                jenisSoalList.map((jenis) => (
                  <div key={jenis.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{jenis.namaJenis}</h3>
                        <p className="text-sm text-gray-500 mt-1">{jenis.deskripsi || 'Tidak ada deskripsi'}</p>
                      </div>
                      <Button
                        onClick={() => openDeleteModal(jenis)}
                        size="sm"
                        variant="plain"
                        color="danger"
                        sx={{ minHeight: 'auto', padding: '4px' }}
                      >
                        <DeleteForever fontSize="small" />
                      </Button>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        onClick={() => handlePreviewSoal(jenis.id)}
                        loading={loadingPreview}
                        size="sm"
                        variant="outlined"
                        color="neutral"
                      >
                        Preview Soal
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
   {/* Modal Preview Soal menggunakan MUI Joy */}
   <Modal open={showPreviewModal} onClose={() => setShowPreviewModal(false)}>
        <ModalDialog size="lg" sx={{ maxWidth: 800, width: '100%', overflowY: 'auto', maxHeight: '90vh' }}>
          <ModalClose />
          <DialogTitle>Preview Soal</DialogTitle>
          <DialogContent>
            {previewSoal.length === 0 ? (
              <Typography textAlign="center" level="body-sm" sx={{ py: 4 }}>
                Tidak ada soal tersedia untuk jenis ini
              </Typography>
            ) : (
              <List>
                {previewSoal.map((soal, index) => (
                  <ListItem key={index} sx={{ pb: 3, borderBottom: '1px solid', borderColor: 'neutral.100' }}>
                    <ListItemContent>
                      <Typography level="title-sm">
                        {index + 1}. {soal.question}
                      </Typography>
                      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {soal.options.map((option, optIndex) => (
                          <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography level="body-xs" sx={{ minWidth: 20 }}>
                              {String.fromCharCode(97 + optIndex)}.
                            </Typography>
                            <Typography level="body-sm">{option.answer}</Typography>
                            <Chip size="sm" variant="outlined" color="neutral" sx={{ ml: 'auto' }}>
                              Score: {option.score}
                            </Chip>
                          </Box>
                        ))}
                      </Box>
                    </ListItemContent>
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={() => setShowPreviewModal(false)}
              variant="outlined"
              color="neutral"
            >
              Tutup
            </Button>
          </Box>
        </ModalDialog>
    </Modal>
       {/* Modal Delete Confirmation */}
       <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon color="danger" sx={{ mr: 1 }} />
            Konfirmasi Hapus
          </DialogTitle>
          <Divider />
          <DialogContent>
          Apakah Anda yakin ingin menghapus jenis soal &quot;{selectedJenisSoal?.namaJenis}&quot;?
            <Typography level="body-sm" sx={{ mt: 1 }}>
              Semua soal yang terkait dengan jenis ini juga akan dihapus.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              variant="solid" 
              color="danger" 
              onClick={handleDeleteJenisSoal}
              loading={deleting}
            >
              Hapus
            </Button>
            <Button 
              variant="plain" 
              color="neutral" 
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
}