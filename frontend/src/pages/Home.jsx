import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text mb-6">
        Redefining Your Stay <br /> Experience
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
        Discover the perfect blend of modern luxury and digital tranquility. Secure your room with our seamless, highly resilient auth process.
      </p>
      
      <div className="flex justify-center gap-6">
        <Link to="/rooms" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg transition transform hover:-translate-y-1">
          Explore Rooms
        </Link>
        <Link to="/login" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg transition transform hover:-translate-y-1">
          Staff Portal
        </Link>
      </div>
    </div>
  );
};

export default Home;
