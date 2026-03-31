import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Star, HeadphonesIcon } from 'lucide-react';

const Complaints = () => {
  const [complaintMsg, setComplaintMsg] = useState('');
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [status, setStatus] = useState('');

  const submitComplaint = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/support/complaint', { message: complaintMsg });
      setStatus('Complaint submitted successfully. Our team will contact you.');
      setComplaintMsg('');
    } catch(err) {
      setStatus('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/support/feedback', feedback);
      setStatus('Feedback submitted successfully. Thank you!');
      setFeedback({ rating: 5, comment: '' });
    } catch(err) {
      setStatus('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center gap-4"><HeadphonesIcon size={40}/> Contact & Support</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">We value your experience at Aura Hotels. Please use the forms below to log an official complaint or to leave general feedback about your stay.</p>
        
        {/* Status Prompt */}
        {status && <div className="mt-8 bg-emerald-900/50 border border-emerald-500 text-emerald-300 p-4 rounded-lg font-bold">{status}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Complaints Form */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl mb-6 font-semibold flex items-center gap-2"><MessageSquare /> File a Complaint</h2>
          <form onSubmit={submitComplaint} className="space-y-4">
            <textarea 
              value={complaintMsg} onChange={e => setComplaintMsg(e.target.value)} required
              placeholder="Describe your issue in detail. Associated booking IDs are helpful..."
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white resize-none focus:border-red-500 outline-none"
            />
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4">Submit Official Complaint</button>
          </form>
        </div>

        {/* Feedback Form */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl mb-6 font-semibold flex items-center gap-2"><Star className="text-yellow-400" /> Leave Feedback</h2>
          <form onSubmit={submitFeedback} className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-2">Rating (1-5)</label>
              <input 
                type="number" min="1" max="5" required
                value={feedback.rating} onChange={e => setFeedback({...feedback, rating: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-2">Comments</label>
              <textarea 
                value={feedback.comment} onChange={e => setFeedback({...feedback, comment: e.target.value})} required
                placeholder="What did you love? What can we improve?"
                className="w-full h-20 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white resize-none focus:border-emerald-500 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg mt-4">Submit Review</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Complaints;
