import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import TambahSoalModal from './TambahSoalModal'

const LowonganList = ({ lowonganList, onViewApplicants, refreshData = () => {} }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {lowonganList.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Tidak ada lowongan tersedia
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Jenis Soal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Tanggal Tutup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowonganList.map(lowongan => (
                <tr key={lowongan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {lowongan.judul}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lowongan.PT?.namaPT}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700 line-clamp-2">
                      {lowongan.deskripsi}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {lowongan.jenissoals?.length > 0 ? (
                        <div className="text-gray-700">
                          {lowongan.jenissoals.map((jenis, index) => (
                            <span key={jenis.id}>
                              {jenis.namaJenis}
                              {index < lowongan.jenissoals.length - 1 && ', '}
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
                      {format(new Date(lowongan.tanggalTutup), 'dd MMMM yyyy', {
                        locale: id,
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(lowongan.tanggalTutup) > new Date()
                        ? 'Masih dibuka'
                        : 'Sudah ditutup'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewApplicants(lowongan.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Lihat Pelamar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default LowonganList