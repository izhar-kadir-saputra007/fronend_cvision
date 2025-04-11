import { useRouteError } from "react-router-dom"
const ErrorPage = () => {
    const error = useRouteError();  

  return (
    <>
    <div className="flex justify-center min-h-screen items-center text-color1 font-bold text-3xl flex-col gap-4">
        <h1>Oops!</h1>
        <p className="text-secondary">Maaf, Halaman yang Anda cari tidak ditemukan.</p>
        <p className="text-[#ff0000]">
            <i>{error.statusText || error.message}</i>
        </p>
    </div>
    </>
  )
}

export default ErrorPage