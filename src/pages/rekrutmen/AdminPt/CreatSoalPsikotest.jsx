import CreateJenisSoal from "../../../components/rekrutmen/adminPT/CreateJenisSoal" 
import CreateSoalPsikotes from "../../../components/rekrutmen/adminPT/CreateSoalPsikotes"
const CreatSoalPsikotest = () => {
  return (
    <>
    <div>
        <h1 className="text-3xl text-color2">Soal Psikotest</h1>
        <p className="text-color2">Buat soal psikotest baru</p>
        <div className="mt-10">
            <CreateSoalPsikotes />
        </div>  
        <div className="mt-10">
            <CreateJenisSoal />
        </div>
    </div>
    </>
  )
}

export default CreatSoalPsikotest