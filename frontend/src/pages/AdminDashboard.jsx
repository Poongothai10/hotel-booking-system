import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, UserPlus, CheckCircle, MapPin, Package, Star } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  
  // Offline User State
  const [newUser, setNewUser] = useState({ name: '', dob: '', email: '', phone: '', password: '', role: 'delivery' });
  const [offlineMsg, setOfflineMsg] = useState('');

  useEffect(() => {
    // Attempt to pull delivery analytics. Assume admin token in localStorage.
    const fetchData = async () => {
      try {
         const token = localStorage.getItem('token') || '';
         const config = { headers: { Authorization: `Bearer ${token}` }};
         
         const [orderRes, agentRes] = await Promise.all([
             axios.get('/api/admin/orders', config).catch(() => ({data: []})),
             axios.get('/api/admin/agents', config).catch(() => ({data: []}))
         ]);
         
         setOrders(orderRes.data);
         setAgents(agentRes.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const triggerAssignment = async (orderId) => {
    try {
        const token = localStorage.getItem('token') || '';
        await axios.put(`/api/orders/${orderId}/assign`, { agentIds: [selectedAgent] }, { headers: { Authorization: `Bearer ${token}` }});
        alert('Order Assigned to Delivery Runner!');
    } catch(err) { alert('Assignment Failed - ' + err.message); }
  };

  const handleOfflineUser = async (e) => {
    e.preventDefault();
    try {
        // Unprotected route for VIVA demonstration purposes
        const { data } = await axios.post('/api/auth/register', newUser); 
        setOfflineMsg(`Success! Created agent ${data.message}`);
        setNewUser({ ...newUser, email: '', phone: '', password: '' });
    } catch (err) { setOfflineMsg('Failed: ' + err.message); }
  };

  return (
    <div className="container mx-auto p-8 relative">
      <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <h1 className="text-4xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
          <MapPin className="text-red-500 w-10 h-10" /> VIVA Delivery System Admin
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* AGENTS TRACKER UI */}
        <div className="bg-slate-800 p-8 rounded-xl border border-blue-500/30 shadow-2xl col-span-1 lg:col-span-2 overflow-auto relative">
          <h2 className="text-2xl mb-6 font-semibold text-blue-400 flex items-center gap-2">
             <UserPlus /> Live Delivery Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {agents.length === 0 ? <p className="text-slate-500">No agents online. Add via form.</p> : 
                agents.map(agent => (
                   <div key={agent._id} className="p-4 bg-slate-900 border border-slate-700/50 rounded-lg shadow grid grid-cols-2 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full flex items-center justify-center">
                          <MapPin className="text-blue-400 w-5 h-5 ml-2 mb-2" />
                       </div>
                       <div className="col-span-2 mb-2">
                           <h3 className="font-bold text-lg">{agent.name}</h3>
                           <p className="text-xs text-blue-300 font-mono tracking-wider">{agent.email}</p>
                       </div>
                       <div>
                           <p className="text-xs text-slate-400">Rating</p>
                           <p className="text-xl text-yellow-500 flex items-center font-bold">
                               {agent.average_rating || 5.0} <Star className="w-4 h-4 ml-1 fill-yellow-500" />
                           </p>
                       </div>
                       <div>
                           <p className="text-xs text-slate-400">Total Runs</p>
                           <p className="text-xl text-white font-bold">{agent.total_deliveries || 0}</p>
                       </div>
                   </div>
                ))
             }
          </div>
        </div>

        {/* Create Agent Box */}
        <div className="bg-slate-800 p-8 rounded-xl border border-emerald-500/30 shadow-2xl">
          <h2 className="text-2xl mb-6 font-semibold text-emerald-400 flex items-center gap-2"><UserPlus /> Enroll Runner</h2>
          <p className="text-slate-400 mb-6 text-sm">Deploy an offline internal delivery agent instantly.</p>
          <form onSubmit={handleOfflineUser} className="space-y-4">
            <div><label className="text-xs text-slate-400 block mb-1">Name</label><input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Email</label><input type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Password</label><input type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" /></div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg mt-6 shadow-lg shadow-emerald-600/20">Authorize Agent</button>
            {offlineMsg && <p className="mt-4 text-xs font-mono text-emerald-400">{offlineMsg}</p>}
          </form>
        </div>

      </div>

      {/* ORDERS / DISPATCH UI */}
      <div className="bg-slate-800 p-8 rounded-xl border border-red-500/30 shadow-2xl">
         <h2 className="text-2xl mb-6 font-semibold text-red-400 flex items-center gap-2"><Package /> Active Deployment Orders</h2>
         {orders.length === 0 ? <p className="text-slate-500 font-mono">No telemetry pending in database.</p> : (
            <div className="space-y-4">
               {orders.map(order => (
                  <div key={order._id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-slate-900 border border-slate-700 rounded-xl">
                      <div className="mb-4 md:mb-0">
                          <p className="text-xs text-red-400 uppercase tracking-widest">{order.status}</p>
                          <h4 className="font-bold font-mono text-lg">{order._id.substring(0, 8)}...</h4>
                          <p className="text-slate-400 mt-1">₹{order.totalPrice} • {order.paymentMethod}</p>
                      </div>
                      
                      {order.status === 'pending' && (
                         <div className="flex gap-2 w-full md:w-auto">
                            <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)} className="bg-slate-800 border border-slate-600 text-sm text-white rounded p-2 focus:outline-none">
                               <option value="">-- Select Agent --</option>
                               {agents.map(a => <option key={a._id} value={a._id}>{a.name} (⭐ {a.average_rating || 5})</option>)}
                            </select>
                            <button onClick={() => triggerAssignment(order._id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow font-semibold">Assign Order</button>
                         </div>
                      )}

                      {order.status !== 'pending' && (
                         <div className="px-6 py-2 bg-slate-800 rounded-full border border-slate-600">
                            Accepted By Agent: <span className="font-bold text-white ml-2">{order.acceptedBy?.name || 'Unknown'}</span>
                         </div>
                      )}
                  </div>
               ))}
            </div>
         )}
      </div>

    </div>
  );
};

export default AdminDashboard;
