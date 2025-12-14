import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function PaymentPage() {
  const [step, setStep] = useState("FORM"); // FORM | OTP | RESULT
  const [amount, setAmount] = useState("");
  const [payeeUpiId, setPayeeUpiId] = useState("");
  const [description, setDescription] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const initiatePayment = async () => {
    try {
      const res = await api.post("/payment/initiate", {
        amount: Number(amount),
        payeeUpiId,
        description,
      });
      setTransactionId(res.data.transactionId);
      setStep("OTP");
    } catch (err) {
      setMessage(err.response?.data?.error || "Payment initiation failed");
    }
  };

  const confirmPayment = async () => {
    try {
      const res = await api.post("/payment/confirm", {
        transactionId,
        otp,
      });
      setMessage(res.data.message);
      setStep("RESULT");
    } catch (err) {
      setMessage(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#120824] to-[#1c0b3c] text-white flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-[#0f0b1f]/80 p-8 shadow-xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">NovaPay</h1>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-sm opacity-70"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>

        {step === "FORM" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Make a Payment</h2>
            <input
              className="w-full rounded-lg bg-black/40 p-3"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              className="w-full rounded-lg bg-black/40 p-3"
              placeholder="Payee UPI ID"
              value={payeeUpiId}
              onChange={(e) => setPayeeUpiId(e.target.value)}
            />
            <input
              className="w-full rounded-lg bg-black/40 p-3"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              onClick={initiatePayment}
              className="w-full rounded-xl bg-purple-600 py-3 font-semibold"
            >
              Pay Now
            </button>
          </div>
        )}

        {step === "OTP" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Verify OTP</h2>
            <input
              className="w-full rounded-lg bg-black/40 p-3 text-center tracking-widest"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={confirmPayment}
              className="w-full rounded-xl bg-purple-600 py-3 font-semibold"
            >
              Confirm Payment
            </button>
          </div>
        )}

        {step === "RESULT" && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Payment Status</h2>
            <p className="opacity-80">{message}</p>
            <button
              onClick={() => setStep("FORM")}
              className="w-full rounded-xl bg-purple-600 py-3 font-semibold"
            >
              Make Another Payment
            </button>
          </div>
        )}

        {message && step !== "RESULT" && (
          <p className="mt-4 text-red-400 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}
