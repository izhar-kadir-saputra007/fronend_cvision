import Navbar from "../../../components/Navbar";
import LowonganList from "../../../components/rekrutmen/CalonKaryawan/LowonganList";
const KarirPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-5 pt-40">
       <LowonganList />
      </div>
    </>
  )
}

export default KarirPage