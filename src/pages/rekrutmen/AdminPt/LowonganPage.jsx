import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  createLowonganWithJenisSoal,
  getLowonganForAdminPT,
} from '../../../APIS/LowonganManagement'
import LowonganList from '../../../components/rekrutmen/adminPT/LowonganList'
import CreateLowonganForm from '../../../components/rekrutmen/adminPT/CreateLowonganForm'

const LowonganPage = () => {
  const [lowonganList, setLowonganList] = useState([])
  const [activeTab, setActiveTab] = useState('lowongan')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLowongan()
  }, [])

  const fetchLowongan = async () => {
    setIsLoading(true)
    try {
      const response = await getLowonganForAdminPT()
      setLowonganList(response.data.data)
      console.log('Data lowongan:', response.data.data)
    } catch (error) {
      console.error('Error fetching lowongan:', error)
      toast.error('Gagal memuat data lowongan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLowongan = async (formData) => {
    try {
      const { jenisSoalIds, ...lowonganData } = formData
      const response = await createLowonganWithJenisSoal(lowonganData, jenisSoalIds)
      
      setLowonganList([...lowonganList, response.data.data])
      toast.success('Lowongan berhasil dibuat!')
      setActiveTab('lowongan')
    } catch (error) {
      console.error('Error creating lowongan:', error)
      toast.error(error.response?.data?.message || 'Gagal membuat lowongan')
    }
  }

  const handleViewApplicants = (lowonganId) => {
    navigate(`/applicants/${lowonganId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 text-color2">
      <h1 className="text-3xl font-bold mb-8">Manajemen Lowongan</h1>

<div className='p-24'
style={{ boxShadow: "0px 0px 10px 3px rgba(0,0,0,0.9)" }}>
      <div className="flex border-b mb-6 ">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'lowongan'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('lowongan')}
        >
          Daftar Lowongan
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'buat-lowongan'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('buat-lowongan')}
        >
          Buat Lowongan Baru
        </button>
      </div>

      {activeTab === 'lowongan' && (
        <>
         
          <LowonganList
            lowonganList={lowonganList}
            onViewApplicants={handleViewApplicants}
            refreshData={fetchLowongan}  // Added refreshData prop
          />
        </>
      )}

      {activeTab === 'buat-lowongan' && (
        <CreateLowonganForm 
          onSubmit={handleCreateLowongan}
          onCancel={() => setActiveTab('lowongan')}
        />
      )}
    </div>
    </div>
  )
}

export default LowonganPage