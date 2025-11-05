import { useState } from 'react'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import ModalDialog from '@mui/joy/ModalDialog'
import DialogTitle from '@mui/joy/DialogTitle'
import DialogContent from '@mui/joy/DialogContent'
import Checkbox from '@mui/joy/Checkbox'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { toast } from 'react-toastify'
import { getAllJenisSoalWithSoal, addJenisSoalToLowongan } from '../../../APIS/LowonganManagement'

export default function TambahSoalModal({ lowonganId, refreshData = () => {} }) {
  const [open, setOpen] = useState(false)
  const [jenisSoalList, setJenisSoalList] = useState([])
  const [selectedSoal, setSelectedSoal] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchJenisSoal = async () => {
    try {
      const response = await getAllJenisSoalWithSoal()
      setJenisSoalList(response.data.data)
    } catch (error) {
      toast.error('Gagal memuat jenis soal')
      console.error(error)
    }
  }

  const handleOpen = async () => {
    setOpen(true)
    await fetchJenisSoal()
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedSoal([])
  }

  const handleCheckboxChange = (id) => (event) => {
    if (event.target.checked) {
      setSelectedSoal([...selectedSoal, id])
    } else {
      setSelectedSoal(selectedSoal.filter(soalId => soalId !== id))
    }
  }

  const handleSubmit = async () => {
    if (selectedSoal.length === 0) {
      toast.warning('Pilih minimal satu jenis soal')
      return
    }

    setLoading(true)
    try {
      await addJenisSoalToLowongan(lowonganId, selectedSoal)
      toast.success('Jenis soal berhasil ditambahkan')
      await refreshData() // Added await here
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan jenis soal')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
   <Tooltip title="Tambah Soal" placement="top" arrow>
  <IconButton
    variant="plain"
    color="neutral"
    size="sm"
    onClick={handleOpen}
    sx={{ ml: 1 }}
  >
    <AddCircleOutlineIcon />
  </IconButton>
</Tooltip>

      <Modal open={open} onClose={handleClose}>
        <ModalDialog size="lg">
          <ModalClose />
          <DialogTitle>Tambah Jenis Soal Psikotest</DialogTitle>
          <DialogContent>
            <p className="mb-4">Pilih jenis soal untuk lowongan ini:</p>
            
            <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {jenisSoalList.map(soal => (
                <ListItem key={soal.id}>
                  <ListItemDecorator>
                    <Checkbox
                      checked={selectedSoal.includes(soal.id)}
                      onChange={handleCheckboxChange(soal.id)}
                      variant="outlined"
                    />
                  </ListItemDecorator>
                  <div className="ml-3">
                    <div className="font-medium">{soal.namaJenis}</div>
                    <div className="text-sm text-gray-500">{soal.deskripsi}</div>
                  </div>
                </ListItem>
              ))}
            </List>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outlined"
                color="neutral"
                onClick={handleClose}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit}
                loading={loading}
              >
                Simpan
              </Button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  )
}