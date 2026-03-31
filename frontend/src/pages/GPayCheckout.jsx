import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QrCode, ShieldCheck, Camera } from 'lucide-react';

const GPayCheckout = ({ orderId }) => {
  const [qrString, setQrString] = useState('');
  
  useEffect(() => {
    // Attempt to grab UPI URL string
    const fetchQR = async () => {
       try {
          const token = localStorage.getItem('token') || '';
          const { data } = await axios.get(`/api/orders/${orderId}/payment-qr`, { 
              headers: { Authorization: `Bearer ${token}` }
          });
          setQrString(data.upiString);
       } catch (err) { }
    };
    if (orderId) fetchQR();
  }, [orderId]);

  return (
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-md mx-auto mt-10 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <ShieldCheck className="text-emerald-400" /> Secure Payment
        </h2>
        <p className="text-slate-400 text-sm mb-8 text-center">Scan with GPay or any UPI app to confirm your order assignment immediately.</p>
        
        <div className="p-4 bg-white rounded-xl shadow-lg border-4 border-emerald-500/30 mb-8 relative group">
           {/* Placeholder for actual QR library like react-qr-code */}
           {qrString ? (
               <div className="flex flex-col items-center">
                   <QrCode className="w-48 h-48 text-black" />
                   <p className="text-xs text-black font-mono mt-2 truncate w-40 text-center">{qrString.substring(0,25)}...</p>
               </div>
           ) : (
               <div className="w-48 h-48 bg-slate-200 animate-pulse flex items-center justify-center">
                   <Camera className="w-8 h-8 text-slate-400" />
               </div>
           )}
           
           <div className="absolute inset-0 bg-black/80 hidden group-hover:flex items-center justify-center rounded-lg backdrop-blur text-white text-xs font-bold text-center p-4 transition-all">
               Scan to securely lock-in your Booking via GPay Gateway!
           </div>
        </div>

        <button className="w-full py-4 font-bold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95">
           I have scanned & paid
        </button>
    </div>
  );
};

export default GPayCheckout;
