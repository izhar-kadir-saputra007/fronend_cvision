import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Box,
  Button,
  Typography,
  Card,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  ListItemButton,
  Chip,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  DialogActions,
  Sheet,
  Textarea
} from '@mui/joy';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  WarningRounded as WarningIcon
} from '@mui/icons-material';

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

  const openDeleteModal = (jenisSoal) => {
    setSelectedJenisSoal(jenisSoal);
    setDeleteModalOpen(true);
  };

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

  const handleAddSoal = () => {
    setSoalList([...soalList, { 
      question: '', 
      options: [
        { answer: '', score: 0 },
        { answer: '', score: 0 }
      ] 
    }]);
  };

  const handleRemoveSoal = (index) => {
    if (soalList.length > 1) {
      const newSoalList = [...soalList];
      newSoalList.splice(index, 1);
      setSoalList(newSoalList);
    } else {
      toast.warning('Minimal harus ada satu soal');
    }
  };

  const handleAddOption = (soalIndex) => {
    const newSoalList = [...soalList];
    newSoalList[soalIndex].options.push({ answer: '', score: 0 });
    setSoalList(newSoalList);
  };

  const handleRemoveOption = (soalIndex, optionIndex) => {
    const newSoalList = [...soalList];
    if (newSoalList[soalIndex].options.length > 2) {
      newSoalList[soalIndex].options.splice(optionIndex, 1);
      setSoalList(newSoalList);
    } else {
      toast.warning('Minimal harus ada 2 opsi jawaban');
    }
  };

  const handleQuestionChange = (index, value) => {
    const newSoalList = [...soalList];
    newSoalList[index].question = value;
    setSoalList(newSoalList);
  };

  const handleOptionChange = (soalIndex, optionIndex, field, value) => {
    const newSoalList = [...soalList];
    newSoalList[soalIndex].options[optionIndex][field] = 
      field === 'score' ? Number(value) : value;
    setSoalList(newSoalList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!jenisSoalId) {
      toast.error('Pilih jenis soal terlebih dahulu');
      setLoading(false);
      return;
    }

    for (let i = 0; i < soalList.length; i++) {
      const soal = soalList[i];
      if (!soal.question.trim()) {
        toast.error(`Pertanyaan soal #${i + 1} tidak boleh kosong`);
        setLoading(false);
        return;
      }

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
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 2, bgcolor: '#070F2B' }}>
      <Typography level="h2" component="h1" sx={{ mb: 2, color:'#00C3FE'  }}>
        Buat Soal Psikotes
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, bgcolor: '#070F2B' }}>
        {/* Kolom utama untuk membuat soal */}
        <Card sx={{ flex: 2 }}>
          <Card>
            <Box sx={{ p: 2 }}>
              <FormControl sx={{ mb: 3 }}>
                <FormLabel>Jenis Soal *</FormLabel>
                <Select
                  value={jenisSoalId}
                  onChange={(e, newValue) => setJenisSoalId(newValue)}
                  disabled={loadingJenisSoal}
                >
                  <Option value="">Pilih Jenis Soal</Option>
                  {jenisSoalList.map((jenis) => (
                    <Option key={jenis.id} value={jenis.id}>
                      {jenis.namaJenis}
                    </Option>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography level="h4">Daftar Soal</Typography>
                <Button
                  startDecorator={<AddIcon />}
                  onClick={handleAddSoal}
                  variant="outlined"
                >
                  Tambah Soal
                </Button>
              </Box>

              {soalList.map((soal, soalIndex) => (
                <Sheet key={soalIndex} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 'sm', position: 'relative' }}>
                  <IconButton
                    onClick={() => handleRemoveSoal(soalIndex)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    color="danger"
                    variant="soft"
                    size="sm"
                  >
                    <DeleteIcon />
                  </IconButton>

                  <FormControl sx={{ mb: 2 }}>
                    <FormLabel>Pertanyaan {soalIndex + 1} *</FormLabel>
                    <Textarea
                      value={soal.question}
                      onChange={(e) => handleQuestionChange(soalIndex, e.target.value)}
                      minRows={2}
                      placeholder="Masukkan pertanyaan"
                      required
                    />
                  </FormControl>

                  <Typography level="body-sm" sx={{ mb: 1 }}>
                    Opsi Jawaban *
                  </Typography>
                  
                  {soal.options.map((option, optionIndex) => (
                    <Box key={optionIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <Typography level="body-sm" sx={{ width: '24px', textAlign: 'center' }}>
                        {optionIndex + 1}.
                      </Typography>
                      <Input
                        value={option.answer}
                        onChange={(e) => handleOptionChange(soalIndex, optionIndex, 'answer', e.target.value)}
                        placeholder="Teks jawaban"
                        required
                        sx={{ flex: 1 }}
                      />
                      <Input
                        type="number"
                        value={option.score}
                        onChange={(e) => handleOptionChange(soalIndex, optionIndex, 'score', e.target.value)}
                        placeholder="Score"
                        required
                        sx={{ width: '100px' }}
                      />
                      <IconButton
                        onClick={() => handleRemoveOption(soalIndex, optionIndex)}
                        disabled={soal.options.length <= 2}
                        color="danger"
                        variant="plain"
                        size="sm"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}

                  <Button
                    startDecorator={<AddIcon />}
                    onClick={() => handleAddOption(soalIndex)}
                    size="sm"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Tambah Opsi
                  </Button>
                </Sheet>
              ))}

              <Button
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                loading={loading}
                loadingPosition="start"
                sx={{ mt: 2 }}
              >
                Simpan Soal Psikotes
              </Button>
            </Box>
          </Card>
        </Card>

        {/* Kolom daftar jenis soal */}
        <Card sx={{ flex: 1 }}>
          <Box sx={{ p: 2 }}>
            <Typography level="h4" sx={{ mb: 2 }}>
              Daftar Jenis Soal
            </Typography>
            
            {loadingJenisSoal ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Memuat...</Typography>
              </Box>
            ) : (
              <List>
                {jenisSoalList.length === 0 ? (
                  <Typography level="body-sm" sx={{ py: 2, textAlign: 'center' }}>
                    Tidak ada jenis soal tersedia
                  </Typography>
                ) : (
                  jenisSoalList.map((jenis) => (
                    <ListItem 
                      key={jenis.id} 
                      sx={{ 
                        '--ListItem-radius': '8px',
                        mb: 1,
                        '&:hover': { bgcolor: 'background.level1' }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          borderRadius: 'sm',
                          border: '1px solid',
                          borderColor: 'neutral.outlinedBorder'
                        }}
                      >
                        <ListItemContent>
                          <Typography level="title-sm">{jenis.namaJenis}</Typography>
                          <Typography level="body-sm">
                            {jenis.deskripsi || 'Tidak ada deskripsi'}
                          </Typography>
                        </ListItemContent>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(jenis);
                            }}
                            color="danger"
                            size="sm"
                            variant="plain"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewSoal(jenis.id);
                            }}
                            size="sm"
                            variant="plain"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  ))
                )}
              </List>
            )}
          </Box>
        </Card>
      </Box>

      {/* Modal Preview Soal */}
      <Modal open={showPreviewModal} onClose={() => setShowPreviewModal(false)}>
        <ModalDialog size="lg" sx={{ maxWidth: 800, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
          <ModalClose />
          <DialogTitle>Preview Soal</DialogTitle>
          <DialogContent>
            {previewSoal.length === 0 ? (
              <Typography level="body-sm" sx={{ py: 4, textAlign: 'center' }}>
                Tidak ada soal tersedia untuk jenis ini
              </Typography>
            ) : (
              <List>
                {previewSoal.map((soal, index) => (
                  <ListItem key={index} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
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
                            <Chip size="sm" variant="outlined" sx={{ ml: 'auto' }}>
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
          <DialogActions>
            <Button
              onClick={() => setShowPreviewModal(false)}
              variant="outlined"
            >
              Tutup
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon color="danger" sx={{ mr: 1 }} />
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </Box>
          <Divider />
          <DialogContent>
            <Typography level="body-md">
              Apakah Anda yakin ingin menghapus jenis soal "{selectedJenisSoal?.namaJenis}"?
            </Typography>
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
              variant="outlined" 
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </Box>
  );
}