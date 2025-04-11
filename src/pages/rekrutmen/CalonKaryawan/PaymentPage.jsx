import Navbar from "../../../components/Navbar"
import PremiumPayment from "../../../components/rekrutmen/CalonKaryawan/PremiumPayment"
import PaymentStatus from "../../../components/rekrutmen/CalonKaryawan/PaymentStatus"

const PaymentPage = () => {
  return (
    <>
        <div>
            <Navbar />
            <div className="pt-20 flex flex-col items-center text-color1">
                <h1>Upgrade to Premium</h1>
                <p>Get access to exclusive features by upgrading to our premium package for only Rp 50,000.</p>
                <PremiumPayment />
                <div className="mt-8"> 
                <PaymentStatus />
                </div>
            </div>
        </div>
    </>
  )
}

export default PaymentPage
