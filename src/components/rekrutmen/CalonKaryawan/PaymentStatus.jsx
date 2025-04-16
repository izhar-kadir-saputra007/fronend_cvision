import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PaymentStatus = () => {
  const [status, setStatus] = useState("Checking payment status...");
  const location = useLocation();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderId = new URLSearchParams(location.search).get("order_id");
      if (orderId) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/checkPaymentStatus?order_id=${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setStatus(response.data.status);
        } catch (error) {
          console.error("Error checking payment status:", error);
          setStatus("Failed to check payment status");
        }
      } else {
        setStatus("No order ID found");
      }
    };

    checkPaymentStatus();
  }, [location]);

  return (
    <div className="bg-primary text-color1 p-4">
      <h1>Payment Status</h1>
      <p>{status}</p>
    </div>
  );
};

export default PaymentStatus;
