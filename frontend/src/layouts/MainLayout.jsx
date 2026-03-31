import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <nav className="bg-slate-800 p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
            Aura Hotels
          </Link>
          <div className="space-x-6">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <Link to="/rooms" className="hover:text-emerald-400 transition-colors">Rooms</Link>
            <Link to="/facilities" className="hover:text-emerald-400 transition-colors">Facilities</Link>
            <Link to="/support" className="hover:text-emerald-400 transition-colors">Support & Contact</Link>
            <Link to="/login" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-white font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Aura Hotel Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
