import React from 'react';

const SecurityDashboard = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Security Clearance</h1>
      <p className="text-slate-400 mb-8">Verify incoming user IDs before allowing check-in execution. This correlates to the strict lifecycle rule.</p>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-xl mb-4 font-medium">Pending Verifications</h2>
        
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded border-l-4 border-yellow-500 mb-4">
          <div>
            <p className="font-bold text-lg">John Doe</p>
            <p className="text-sm text-slate-400">Booking: #BKG-10294</p>
          </div>
          <div className="flex gap-4">
            <button className="text-sm underline text-blue-400 hover:text-blue-300">View Aadhar / ID File</button>
            <button className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded font-bold">Approve Identity</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecurityDashboard;
