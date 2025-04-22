// src/components/rekrutmen/adminPT/PelamarList.jsx
const PelamarList = ({ pelamarList }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden text-color2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lowongan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pelamarList.map((pelamar) => (
            <tr key={`${pelamar.user.id}-${pelamar.lowongan.judul}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">
                  {pelamar.user?.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-700">{pelamar.user?.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-700">
                  {pelamar.lowongan?.judul} - {pelamar.lowongan?.PT?.namaPT}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pelamar.status === 'diterima'
                      ? 'bg-green-100 text-green-800'
                      : pelamar.status === 'ditolak'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {pelamar.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PelamarList