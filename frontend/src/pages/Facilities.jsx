import React from 'react';
import { Wifi, Monitor, Coffee, Dumbbell, Car, Shield } from 'lucide-react';

const Facilities = () => {
  const facilityCards = [
    { title: "Ultra-Fast Wi-Fi", desc: "Gigabit fiber connections wired directly to personal access points in every room.", icon: <Wifi size={40} className="text-emerald-400 mb-4" /> },
    { title: "Executive Workspace", desc: "Ergonomic furniture and 4K displays available upon request for digital nomads.", icon: <Monitor size={40} className="text-blue-400 mb-4" /> },
    { title: "Premium Dining", desc: "24/7 room service featuring Michelin-star rated local and international cuisines.", icon: <Coffee size={40} className="text-amber-400 mb-4" /> },
    { title: "Aura Spa & Gym", desc: "State-of-the-art fitness center and recovery spa access included with all Suites.", icon: <Dumbbell size={40} className="text-red-400 mb-4" /> },
    { title: "Valet Parking", desc: "Secure, climate-controlled subterranean parking with EV charging stations.", icon: <Car size={40} className="text-slate-400 mb-4" /> },
    { title: "Maximum Security", desc: "Biometric access gates, 24/7 active security patrols, and rigorous ID verification.", icon: <Shield size={40} className="text-emerald-400 mb-4" /> }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">World-Class Facilities</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">Experience the intersection of digital luxury and absolute privacy. Our facilities are designed exclusively for those who demand the best.</p>
      </div>

      {/* Featured Image Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="rounded-2xl overflow-hidden h-96 shadow-2xl border-4 border-slate-800">
          <img src="/premium_room.png" alt="Premium Room" className="w-full h-full object-cover transition transform hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center px-8">
            <h2 className="text-4xl font-bold mb-4 text-emerald-400">The Ocean View Suite</h2>
            <p className="text-lg text-slate-300 mb-6">Unrivaled vistas through massive blast-proof architectural glass. Soundproofed walls and absolute biometric isolation ensure an incredibly tranquil stay.</p>
            <ul className="list-disc pl-6 text-slate-400 space-y-2">
                <li>Automated blackout curtains</li>
                <li>Digital temperature management</li>
                <li>In-room smart filtration array</li>
            </ul>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilityCards.map((fac, i) => (
          <div key={i} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:bg-slate-700 transition cursor-pointer group">
            {fac.icon}
            <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition">{fac.title}</h3>
            <p className="text-slate-400 leading-relaxed">{fac.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facilities;
