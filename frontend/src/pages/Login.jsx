import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // API interception setup in AuthContext logic
      const userData = await login(email, password);
      
      // Intelligent Routing based on assigned Application Role!
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'security') navigate('/security');
      else navigate('/rooms');
    } catch (err) {
      alert("Invalid credentials, or Backend not running. Ensure MongoDB is connected and `npm run dev` in backend is active.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Gateway Login</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Email / Admin ID</label>
          <input 
            type="email" 
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
          <input 
            type="password" 
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:-translate-y-1">
          Access Authority
        </button>
      </form>
    </div>
  );
};

export default Login;
