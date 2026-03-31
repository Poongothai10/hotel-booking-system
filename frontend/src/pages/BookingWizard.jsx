import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, UploadCloud, CreditCard, Hotel, Music, Flame, Wifi, Tv, Utensils, CalendarClock, Briefcase, HeartPulse, Sparkles, Droplets, Coffee, Activity, ArrowRight, ShieldPlus } from 'lucide-react';

const BookingWizard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Chronological tracking
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [totalHours, setTotalHours] = useState(0);

  // Demographics
  const [guestDetails, setGuestDetails] = useState({ name: user?.name || '', dob: user?.dob || '' });
  const [idFile, setIdFile] = useState(null);
  const [eventDetails, setEventDetails] = useState({ guests: '', type: 'Party', sitting_arrangement: '', food_catering_tier: 'None' });
  
  // Room Customizations (New Demographics)
  const [roomConfig, setRoomConfig] = useState({ bed_type: 'Single', air_conditioning: false, smart_ac_automation: false, heater: false, automatic_adjustable_ac: false, voice_control: false, elevator_access: false });
  const [familyAddons, setFamilyAddons] = useState({ extra_bed_children: false, extra_bed_elders: false, baby_sitting: false, indoor_games: false, outdoor_games: false });
  const [elderAddons, setElderAddons] = useState({ wheelchair: false });
  const [tentAddons, setTentAddons] = useState({ stargazing: false });
  const [coupleAddons, setCoupleAddons] = useState({ decoration: false, candle_light_dinner: false, music_system: false, proposal_setup: false, midnight_surprise: false, indoor_dining: false, spa_access: false, couple_games: false });
  const [tourAddons, setTourAddons] = useState({ guide: false, guide_days: 1, park_facilities: false });
  
  // IoT Hardware
  const [parkingDetails, setParkingDetails] = useState({ required: false, available_slots: null });
  const [finalReceipt, setFinalReceipt] = useState(null);

  // Custom Addons
  const [addons, setAddons] = useState({ tv: false, wifi: false, dj_party: false, firecamp: false, food: false, laundry: false, luggage_assistant: false, swimming_pool: false, medical_support: false, parlor: false, saloon: false, food_court: false, tourist_guides: false, meditation_session: false });
  const [paymentMethod, setPaymentMethod] = useState('Offline');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('/api/rooms');
        setRooms(data);
      } catch (err) {
        console.error("Failed to fetch categorized rooms", err);
      }
    };
    const fetchParkingRadar = async () => {
      try {
        const { data } = await axios.get('/api/bookings/parking/slots');
        setParkingDetails(prev => ({...prev, available_slots: data.available_slots}));
      } catch (err) {
        console.log("No parking hardware radar active");
      }
    };
    fetchRooms();
    fetchParkingRadar();
  }, []);

  // Update real-time Invoice math based on explicitly selected dates
  useEffect(() => {
    if (checkInTime && checkOutTime) {
      const ms = new Date(checkOutTime) - new Date(checkInTime);
      if (ms > 0) {
        setTotalHours(Math.ceil(ms / (1000 * 60 * 60)));
      } else {
        setTotalHours(0);
      }
    }
  }, [checkInTime, checkOutTime]);

  const calculateTotalObligation = () => {
      let total = (selectedRoom?.price_per_hour || 0) * totalHours;
      if (addons.tv) total += 800;
      if (addons.wifi) total += 400;
      if (addons.dj_party) total += 16000;
      if (addons.firecamp) total += 4000;
      if (addons.food) total += 7200;
      if (addons.laundry) total += 300;
      if (addons.luggage_assistant) total += 150;
      if (addons.swimming_pool) total += 800;
      if (addons.parlor) total += 1000;
      if (addons.saloon) total += 1000;
      if (addons.food_court) total += 500;
      if (addons.tourist_guides) total += 1500;
      if (addons.meditation_session) total += 500;
      
      if (roomConfig.air_conditioning) total += (50 * totalHours);
      if (roomConfig.smart_ac_automation) total += (100 * totalHours);
      if (roomConfig.heater) total += (80 * totalHours);
      if (roomConfig.automatic_adjustable_ac) total += (150 * totalHours);
      if (roomConfig.voice_control) total += 500;
      if (roomConfig.elevator_access) total += 300;
      if (roomConfig.bed_type === 'Double') total += 200;

      if (selectedRoom?.category === 'Family') {
          if (familyAddons.extra_bed_children) total += 300;
          if (familyAddons.extra_bed_elders) total += 300;
          if (familyAddons.baby_sitting) total += 800;
          if (familyAddons.indoor_games) total += 300;
          if (familyAddons.outdoor_games) total += 500;
      }
      
      if (selectedRoom?.category === 'Couple') {
          if (coupleAddons.candle_light_dinner) total += 2000;
          if (coupleAddons.proposal_setup) total += 5000;
          if (coupleAddons.midnight_surprise) total += 1500;
          if (coupleAddons.spa_access) total += 4000;
          if (coupleAddons.decoration) total += 1000;
          if (coupleAddons.music_system) total += 500;
          if (coupleAddons.indoor_dining) total += 1200;
          if (coupleAddons.couple_games) total += 800;
      }

      if (selectedRoom?.category === 'EventHall') {
          let sitting = Number(eventDetails.sitting_arrangement) || 0;
          if (eventDetails.food_catering_tier === 'Basic Menu') total += (sitting * 200);
          if (eventDetails.food_catering_tier === 'Gold Menu') total += (sitting * 500);
          if (eventDetails.food_catering_tier === 'Diamond Buffet') total += (sitting * 1200);
      }

      // Universal Tourism Addons
      if (tourAddons.park_facilities) total += 500;
      if (tourAddons.guide) total += (1500 * tourAddons.guide_days);

      if (selectedRoom?.category === 'Tent' && tentAddons.stargazing) {
          total += 1200;
      }

      if (parkingDetails.required) total += 200;

      return total;
  };

  const handleFileUpload = async () => {
    if (!idFile) return true;
    const formData = new FormData();
    formData.append('id_proof', idFile);
    try {
      await axios.post('/api/users/upload-id', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return true;
    } catch (err) {
      alert('File upload failed: ' + (err.response?.data?.message || err.message));
      return false;
    }
  };

  const handleFinalizeBooking = async () => {
    if (totalHours <= 0) return alert('Invalid booking chronology. Check-out must exceed Check-in time!');
    setLoading(true);
    
    const uploadSuccess = await handleFileUpload();
    if (!uploadSuccess) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        room_id: selectedRoom._id,
        check_in: checkInTime,
        check_out: checkOutTime,
        event_details: selectedRoom?.category === 'EventHall' ? eventDetails : undefined,
        room_config: roomConfig,
        family_addons: selectedRoom?.category === 'Family' ? familyAddons : undefined,
        couple_addons: selectedRoom?.category === 'Couple' ? coupleAddons : undefined,
        tour_addons: tourAddons,
        elder_addons: elderAddons,
        tent_addons: selectedRoom?.category === 'Tent' ? tentAddons : undefined,
        parking_details: parkingDetails,
        addons
      };

      const response = await axios.post('/api/bookings', payload);
      setFinalReceipt(response.data);
      setStep(6);
    } catch (err) {
      alert("Booking Gateway Rejected: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Exclusive Booking Portal</h1>
        <p className="text-slate-400 mb-8 flex gap-4">Reserve specialized Demographic Themes and Event Halls with strict automated Hourly Billing paradigms.</p>
        
        {/* Progress Tracker Tracker */}
        <div className="flex justify-between mb-8 border-b border-slate-700 pb-4 overflow-x-auto gap-4">
          {['Room Map', 'Chronology', 'Security Check', 'Event / Addons', 'Invoice Checkout'].map((label, idx) => (
            <div key={idx} className={`text-sm whitespace-nowrap font-semibold flex items-center gap-2 ${step > idx ? 'text-emerald-400' : 'text-slate-500'}`}>
              <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${step > idx ? 'border-emerald-400 bg-emerald-900/50' : 'border-slate-600'}`}>
                {step > idx + 1 ? <CheckCircle size={16} /> : idx + 1}
              </div>
              <span className="hidden md:block">{label}</span>
            </div>
          ))}
        </div>

        {/* 1. Categorized Room Display */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} onClick={() => room.is_available && setSelectedRoom(room)}
                className={`flex flex-col rounded-2xl border-4 overflow-hidden transition-all cursor-pointer ${selectedRoom?._id === room._id ? 'border-emerald-500 bg-slate-800 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-slate-800 bg-slate-900 hover:border-slate-600'} ${!room.is_available ? 'opacity-30 grayscale' : ''}`}>
                <div className="h-48 bg-slate-950 relative">
                    <img src={room.image} alt={room.theme} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/premium_room.png'; }} />
                    <div className="absolute top-0 right-0 bg-black/70 px-4 py-1 rounded-bl-xl text-emerald-400 font-bold border-l border-b border-emerald-900 shadow-xl">
                      ₹{room.price_per_hour}/hr
                    </div>
                    {room.category === 'EventHall' && <div className="absolute top-2 left-2 px-3 py-1 bg-purple-600 font-bold text-xs uppercase rounded">Marriage/Events</div>}
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Hotel size={18}/> {room.type}</h3>
                    <p className="text-slate-400 text-sm">{room.theme}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-full mt-6 flex justify-end">
              <button disabled={!selectedRoom} onClick={() => setStep(2)} className="bg-emerald-600 shadow-emerald-900 hover:bg-emerald-700 disabled:opacity-50 px-8 py-3 rounded-lg font-bold">Initiate Booking Flow</button>
            </div>
          </div>
        )}

        {/* 2. Strict Chronology & Timestamps */}
        {step === 2 && (
           <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CalendarClock /> Set Hourly Duration & Details</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-700">
              <div>
                <label className="block text-slate-400 mb-2">Exact Check-In Time</label>
                <input type="datetime-local" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-slate-400 mb-2">Exact Check-Out Time</label>
                <input type="datetime-local" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div><label className="block text-slate-400 mb-2">Primary Guest Name</label><input type="text" value={guestDetails.name} onChange={e => setGuestDetails({...guestDetails, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3" /></div>
              <div><label className="block text-slate-400 mb-2">Date of Birth</label><input type="date" value={guestDetails.dob} onChange={e => setGuestDetails({...guestDetails, dob: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3" /></div>
            </div>

            {selectedRoom?.category === 'EventHall' && (
              <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-700 bg-purple-900/10 p-6 rounded-xl border border-purple-500/30">
                <div>
                  <label className="block text-purple-300 font-bold mb-2">Number of Total Guests</label>
                  <input type="number" min="1" placeholder="e.g. 150" value={eventDetails.guests} onChange={e => setEventDetails({...eventDetails, guests: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-2">Event Style</label>
                  <select value={eventDetails.type} onChange={e => setEventDetails({...eventDetails, type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500">
                    <option value="Party">Party / Celebration</option>
                    <option value="Marriage">Marriage / Wedding</option>
                    <option value="Birthday">Birthday Event</option>
                    <option value="Corporate">Corporate Gathering</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Decoration">Decoration Purposes</option>
                    <option value="Other">Other Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-2">Sitting Arrangement (Headcount)</label>
                  <input type="number" min="0" placeholder="e.g. 50" value={eventDetails.sitting_arrangement} onChange={e => setEventDetails({...eventDetails, sitting_arrangement: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-2">Food Catering Tier</label>
                  <select value={eventDetails.food_catering_tier} onChange={e => setEventDetails({...eventDetails, food_catering_tier: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500">
                    <option value="None">No Food Catering</option>
                    <option value="Basic Menu">Basic Menu</option>
                    <option value="Gold Menu">Gold Menu</option>
                    <option value="Diamond Buffet">Diamond Buffet</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button onClick={() => setStep(1)} className="px-6 py-2 text-slate-400 hover:text-white">Return to Catalog</button>
              <div className="flex items-center gap-6">
                <span className="text-slate-400">Total Validated Duration: <strong className="text-white text-xl">{totalHours} Hours</strong></span>
                <button onClick={() => setStep(3)} disabled={totalHours <= 0 || !guestDetails.name} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-8 py-3 rounded-lg font-bold">Confirm Timeline</button>
              </div>
            </div>
           </div>
        )}

        {/* 3. Security Check */}
        {step === 3 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-slate-300"><UploadCloud /> ID Proof Processing Node</h2>
            <p className="text-slate-400 mb-8">To check into Aura structures, our Security teams dictate mandatory Aadhar or ID file validation.</p>
            <div className="border-4 border-dashed border-slate-600 hover:border-emerald-500 transition rounded-xl p-16 bg-slate-900/50 flex flex-col items-center">
              <UploadCloud size={64} className="text-emerald-500 mb-6" />
              <input type="file" onChange={(e) => setIdFile(e.target.files[0])} accept=".pdf,.jpg,.png" className="block text-slate-400 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-900 file:text-emerald-300 hover:file:bg-emerald-800 cursor-pointer" />
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white">Rewind Stage</button>
              <button onClick={() => setStep(4)} disabled={!idFile} className="bg-emerald-600 px-8 py-3 rounded-lg font-bold disabled:opacity-50">Advance Flow</button>
            </div>
          </div>
        )}

        {/* 4. Specialized Event Addons */}
        {step === 4 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">Environment & Demographic Configuration</h2>

            {/* General Room Config */}
            <div className="mb-8 border border-white/10 rounded-xl p-6 bg-slate-900/40">
                <h3 className="text-lg font-bold text-teal-300 mb-4 border-b border-white/5 pb-2">General Room Structure & Environment</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-400 mb-2 font-semibold">Bed Layout Setup</label>
                        <select value={roomConfig.bed_type} onChange={e => setRoomConfig({...roomConfig, bed_type: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-teal-500">
                            <option value="Single">Single Bed Foundation</option>
                            <option value="Double">Double Bed Upgrade (+₹200 flat)</option>
                        </select>
                        
                        <div className="mt-6 flex flex-col gap-3">
                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-teal-500 transition-colors bg-slate-900">
                                <input type="checkbox" checked={roomConfig.voice_control} onChange={e => setRoomConfig({...roomConfig, voice_control: e.target.checked})} className="w-5 h-5 rounded-md bg-slate-800 checked:bg-teal-500 focus:ring-0" />
                                <span className="text-slate-200 font-semibold text-sm">Voice Control Room & Elevator (+₹500)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-teal-500 transition-colors bg-slate-900">
                                <input type="checkbox" checked={roomConfig.elevator_access} onChange={e => setRoomConfig({...roomConfig, elevator_access: e.target.checked})} className="w-5 h-5 rounded-md bg-slate-800 checked:bg-teal-500 focus:ring-0" />
                                <span className="text-slate-200 font-semibold text-sm">Dedicated Elevator Access (+₹300)</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-teal-500 transition-colors bg-slate-900">
                            <input type="checkbox" checked={roomConfig.air_conditioning} onChange={e => setRoomConfig({...roomConfig, air_conditioning: e.target.checked})} className="w-5 h-5 border-2 border-slate-600 rounded-md bg-slate-800 checked:bg-teal-500 focus:ring-0" />
                            <span className="text-slate-200 font-semibold text-sm">Enable Standard AC (+₹50/hour)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-teal-500 transition-colors bg-slate-900">
                            <input type="checkbox" checked={roomConfig.heater} onChange={e => setRoomConfig({...roomConfig, heater: e.target.checked})} className="w-5 h-5 border-2 border-slate-600 rounded-md bg-slate-800 checked:bg-red-500 focus:ring-0" />
                            <span className="text-slate-200 font-semibold text-sm">Enable Room Heater (+₹80/hour)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-teal-500/50 hover:border-teal-400 transition-colors bg-emerald-900/20">
                            <input type="checkbox" checked={roomConfig.smart_ac_automation} onChange={e => setRoomConfig({...roomConfig, smart_ac_automation: e.target.checked})} className="w-5 h-5 border-2 border-teal-500 rounded-md bg-slate-800 checked:bg-teal-400 focus:ring-0" />
                            <span className="text-teal-200 font-bold text-sm">Smart IoT Automation AC (+₹100/hour)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-teal-500/50 hover:border-teal-400 transition-colors bg-emerald-900/20">
                            <input type="checkbox" checked={roomConfig.automatic_adjustable_ac} onChange={e => setRoomConfig({...roomConfig, automatic_adjustable_ac: e.target.checked})} className="w-5 h-5 border-2 border-teal-500 rounded-md bg-slate-800 checked:bg-teal-400 focus:ring-0" />
                            <span className="text-teal-200 font-bold text-sm">Auto-Adjustable Temp AC (+₹150/hour)</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Family Specifics */}
            {selectedRoom?.category === 'Family' && (
                <div className="mb-8 border border-rose-500/30 rounded-xl p-6 bg-rose-900/10">
                    <h3 className="text-lg font-bold text-rose-300 mb-4 border-b border-rose-500/20 pb-2">Family Accommodations</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-rose-800/50 hover:border-rose-500 transition-colors bg-slate-900 shadow-inner">
                            <input type="checkbox" checked={familyAddons.extra_bed_children} onChange={e => setFamilyAddons({...familyAddons, extra_bed_children: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-rose-500" />
                            <span className="text-rose-100 font-semibold">Extra Bed for Child (+₹300)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-rose-800/50 hover:border-rose-500 transition-colors bg-slate-900 shadow-inner">
                            <input type="checkbox" checked={familyAddons.extra_bed_elders} onChange={e => setFamilyAddons({...familyAddons, extra_bed_elders: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-rose-500" />
                            <span className="text-rose-100 font-semibold">Extra Bed for Elder Parent (+₹300)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-rose-800/50 hover:border-rose-500 transition-colors bg-slate-900 shadow-inner">
                            <input type="checkbox" checked={familyAddons.baby_sitting} onChange={e => setFamilyAddons({...familyAddons, baby_sitting: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-rose-500" />
                            <span className="text-rose-100 font-semibold">Baby Sitting Services (+₹800)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-rose-800/50 hover:border-rose-500 transition-colors bg-slate-900 shadow-inner">
                            <input type="checkbox" checked={familyAddons.indoor_games} onChange={e => setFamilyAddons({...familyAddons, indoor_games: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-rose-500" />
                            <span className="text-rose-100 font-semibold">Indoor Children Games (+₹300)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-rose-800/50 hover:border-rose-500 transition-colors bg-slate-900 shadow-inner">
                            <input type="checkbox" checked={familyAddons.outdoor_games} onChange={e => setFamilyAddons({...familyAddons, outdoor_games: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-rose-500" />
                            <span className="text-rose-100 font-semibold">Outdoor Children Games (+₹500)</span>
                        </label>
                    </div>
                </div>
            )}
            
            {/* Elder & Accessibility */}
            <div className="mb-8 border border-orange-500/30 rounded-xl p-6 bg-orange-900/10">
                <h3 className="text-lg font-bold text-orange-300 mb-4 border-b border-orange-500/20 pb-2">Elder Care & Accessibility</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-orange-800/50 hover:border-orange-500 transition-colors bg-slate-900 shadow-inner">
                        <input type="checkbox" checked={elderAddons.wheelchair} onChange={e => setElderAddons({...elderAddons, wheelchair: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-orange-500" />
                        <span className="text-orange-100 font-semibold">Provide Elder Wheelchair (Complimentary)</span>
                    </label>
                </div>
            </div>

            {/* Tent Specifics */}
            {selectedRoom?.category === 'Tent' && (
                <div className="mb-8 border border-indigo-500/30 rounded-xl p-6 bg-indigo-900/10">
                    <h3 className="text-lg font-bold text-indigo-300 mb-4 border-b border-indigo-500/20 pb-2">Tent Exclusives</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-indigo-800/50 hover:border-indigo-500 transition-colors bg-slate-900 shadow-inner">
                            <input type="checkbox" checked={tentAddons.stargazing} onChange={e => setTentAddons({...tentAddons, stargazing: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-indigo-500" />
                            <span className="text-indigo-100 font-semibold">Stargazing Setup & Telescope (+₹1200)</span>
                        </label>
                    </div>
                </div>
            )}

            {/* Romantic Escapades */}
            {selectedRoom?.category === 'Couple' && (
                <div className="mb-8 border border-pink-500/30 rounded-xl p-6 bg-pink-900/10">
                    <h3 className="text-lg font-bold text-pink-300 mb-4 border-b border-pink-500/20 pb-2">Romantic Escapade Customizations</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { id: 'candle_light_dinner', label: 'Candle Light Dinner (+₹2000)' },
                          { id: 'proposal_setup', label: 'Proposal Setup (+₹5000)' },
                          { id: 'midnight_surprise', label: 'Midnight Surprise Delivery (+₹1500)' },
                          { id: 'spa_access', label: 'Couples Spa Access (+₹4000)' },
                          { id: 'decoration', label: 'Room Decoration (+₹1000)' },
                          { id: 'music_system', label: 'Music System Rental (+₹500)' },
                          { id: 'indoor_dining', label: 'Romantic Indoor Dining (+₹1200)' },
                          { id: 'couple_games', label: 'Couple Activities/Movie Night (+₹800)' },
                        ].map(addon => (
                            <label key={addon.id} className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-pink-800/50 hover:border-pink-500 transition-colors bg-slate-900 shadow-inner">
                                <input type="checkbox" checked={coupleAddons[addon.id]} onChange={e => setCoupleAddons({...coupleAddons, [addon.id]: e.target.checked})} className="w-5 h-5 rounded-md bg-slate-800 checked:bg-pink-500" />
                                <span className="text-pink-100 font-semibold text-sm">{addon.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Universal Tourism Specifics */}
            <div className="mb-8 border border-cyan-500/30 rounded-xl p-6 bg-cyan-900/10">
                <h3 className="text-lg font-bold text-cyan-300 mb-4 border-b border-cyan-500/20 pb-2">Travel & Tour Logistics (Available Globally)</h3>
                <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-cyan-800/50 hover:border-cyan-500 transition-colors bg-slate-900 shadow-inner">
                        <input type="checkbox" checked={tourAddons.park_facilities} onChange={e => setTourAddons({...tourAddons, park_facilities: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-cyan-500" />
                        <span className="text-cyan-100 font-semibold">Enable Park Facilities Pass (+₹500 flat)</span>
                    </label>
                    <div className="p-4 rounded-lg border border-cyan-800/50 bg-slate-900 shadow-inner">
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                            <input type="checkbox" checked={tourAddons.guide} onChange={e => setTourAddons({...tourAddons, guide: e.target.checked})} className="w-6 h-6 rounded-md bg-slate-800 checked:bg-cyan-500" />
                            <span className="text-cyan-100 font-bold">Assign Local Travel Guide (+₹1500/day)</span>
                        </label>
                        {tourAddons.guide && (
                            <div className="ml-10 bg-slate-800/50 p-4 border-l-4 border-cyan-500 rounded-r-lg">
                                <label className="block text-cyan-300 mb-2 font-semibold">How many days will you need the guide?</label>
                                <input type="number" min="1" value={tourAddons.guide_days} onChange={e => setTourAddons({...tourAddons, guide_days: Math.max(1, parseInt(e.target.value)||1)})} className="w-full sm:w-1/2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-cyan-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-emerald-400 mb-4 border-b border-white/5 pb-2">Entertainment, Retail & General Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "High-Speed Encrypted WiFi", id: "wifi", cost: 400, icon: <Wifi size={24}/> },
                { label: "Premium Cinematic TV Service", id: "tv", cost: 800, icon: <Tv size={24}/> },
                { label: "Dedicated Event DJ setup", id: "dj_party", cost: 16000, icon: <Music size={24}/> },
                { label: "Organized Night Firecamp", id: "firecamp", cost: 4000, icon: <Flame size={24}/> },
                { label: "All-Inclusive Full Board Dining", id: "food", cost: 7200, icon: <Utensils size={24}/> },
                { label: "Express Laundry & Dry Cleaning", id: "laundry", cost: 300, icon: <Sparkles size={24}/> },
                { label: "Luggage & Porter Assistant", id: "luggage_assistant", cost: 150, icon: <Briefcase size={24}/> },
                { label: "Exclusive Swimming Pool Access", id: "swimming_pool", cost: 800, icon: <Droplets size={24}/> },
                { label: "24x7 Ready Medical Support", id: "medical_support", cost: 0, icon: <HeartPulse size={24}/> },
                { label: "Premium Beauty Parlor", id: "parlor", cost: 1000, icon: <CheckCircle size={24}/> },
                { label: "Luxury Barber & Saloon", id: "saloon", cost: 1000, icon: <Activity size={24}/> },
                { label: "Food Court Infinite Access", id: "food_court", cost: 500, icon: <Coffee size={24}/> },
                { label: "Local Tourism Guide", id: "tourist_guides", cost: 1500, icon: <ArrowRight size={24}/> },
                { label: "Zen Meditation Sessions", id: "meditation_session", cost: 500, icon: <ShieldPlus size={24}/> }
              ].map(item => (
                <div key={item.id} onClick={() => setAddons({...addons, [item.id]: !addons[item.id]})} className={`p-6 border-2 rounded-xl flex items-center justify-between cursor-pointer transition ${addons[item.id] ? 'border-emerald-500 bg-emerald-900/10' : 'border-slate-700 bg-slate-900 hover:border-slate-600'}`}>
                    <div className="flex items-center gap-4 text-slate-300">{React.cloneElement(item.icon, { className: addons[item.id] ? 'text-emerald-400' : 'text-slate-500'})} <span className="font-semibold text-lg">{item.label}</span></div>
                    <span className="font-bold text-emerald-400 text-xl">{item.cost === 0 ? 'Free' : `+₹${item.cost}`}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(3)} className="px-6 py-2 text-slate-400 hover:text-white">Modify ID</button>
              <button onClick={() => setStep(5)} className="bg-emerald-600 px-8 py-3 rounded-lg font-bold">Lock Services</button>
            </div>
          </div>
        )}

        {/* 5. Complete Final Invoice */}
        {step === 5 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CreditCard /> Locked Automated Invoice</h2>
            
            <div className="bg-slate-900 rounded-xl p-8 mb-8 border border-slate-700 shadow-inner">
              <div className="border-b border-slate-700 pb-4 mb-4 grid grid-cols-2 gap-4">
                <span className="text-slate-400">Target Category</span> <span className="text-right font-semibold">{selectedRoom?.category} ({selectedRoom?.theme})</span>
                <span className="text-slate-400">Hourly Rate Strategy</span> <span className="text-right font-semibold text-emerald-400">₹{selectedRoom?.price_per_hour}/hr</span>
                <span className="text-slate-400">Total Booked Time</span> <span className="text-right font-semibold">{totalHours} Hours Evaluated</span>
              </div>
              
              <div className="space-y-4 mb-4">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400">Base Room Trajectory Cost</span> <span>₹{(selectedRoom?.price_per_hour || 0) * totalHours}</span></div>
                  
                  {/* Customizations */}
                  {roomConfig.air_conditioning && <div className="flex justify-between text-sm"><span className="text-teal-400 pl-4">+ Dedicated AC System (₹50/hr)</span> <span>₹{50 * totalHours}</span></div>}
                  {roomConfig.smart_ac_automation && <div className="flex justify-between text-sm"><span className="text-teal-400 pl-4">+ Smart AC Auto (₹100/hr)</span> <span>₹{100 * totalHours}</span></div>}
                  {roomConfig.heater && <div className="flex justify-between text-sm"><span className="text-red-400 pl-4">+ Room Heater (₹80/hr)</span> <span>₹{80 * totalHours}</span></div>}
                  {roomConfig.automatic_adjustable_ac && <div className="flex justify-between text-sm"><span className="text-teal-400 pl-4">+ Auto Adjustable Temp AC (₹150/hr)</span> <span>₹{150 * totalHours}</span></div>}
                  {roomConfig.voice_control && <div className="flex justify-between text-sm"><span className="text-teal-400 pl-4">+ Voice Control & Elevators</span> <span>₹500</span></div>}
                  {roomConfig.elevator_access && <div className="flex justify-between text-sm"><span className="text-teal-400 pl-4">+ Dedicated Elevator</span> <span>₹300</span></div>}
                  {roomConfig.bed_type === 'Double' && <div className="flex justify-between text-sm"><span className="text-teal-400 pl-4">+ Double Bed Config Upgrade</span> <span>₹200</span></div>}

                  {selectedRoom?.category === 'Family' && familyAddons.extra_bed_children && <div className="flex justify-between text-sm"><span className="text-rose-400 pl-4">+ Child Extra Bed Config</span> <span>₹300</span></div>}
                  {selectedRoom?.category === 'Family' && familyAddons.extra_bed_elders && <div className="flex justify-between text-sm"><span className="text-rose-400 pl-4">+ Elder Extra Bed Config</span> <span>₹300</span></div>}
                  {selectedRoom?.category === 'Family' && familyAddons.baby_sitting && <div className="flex justify-between text-sm"><span className="text-rose-400 pl-4">+ Baby Sitting Serv.</span> <span>₹800</span></div>}
                  {selectedRoom?.category === 'Family' && familyAddons.indoor_games && <div className="flex justify-between text-sm"><span className="text-rose-400 pl-4">+ Indoor Games</span> <span>₹300</span></div>}
                  {selectedRoom?.category === 'Family' && familyAddons.outdoor_games && <div className="flex justify-between text-sm"><span className="text-rose-400 pl-4">+ Outdoor Games</span> <span>₹500</span></div>}

                  {selectedRoom?.category === 'Tent' && tentAddons.stargazing && <div className="flex justify-between text-sm"><span className="text-indigo-400 pl-4">+ Stargazing Telescope</span> <span>₹1200</span></div>}
                  {elderAddons.wheelchair && <div className="flex justify-between text-sm"><span className="text-orange-400 pl-4">+ Elder Wheelchair Access</span> <span>₹0</span></div>}

                  {(selectedRoom?.category === 'Couple' || selectedRoom?.category === 'Traveller') && tourAddons.park_facilities && <div className="flex justify-between text-sm"><span className="text-cyan-400 pl-4">+ Nature Park Pass</span> <span>₹500</span></div>}
                  {(selectedRoom?.category === 'Couple' || selectedRoom?.category === 'Traveller') && tourAddons.guide && <div className="flex justify-between text-sm"><span className="text-cyan-400 pl-4">+ Pro Guide ({tourAddons.guide_days} Days)</span> <span>₹{1500 * tourAddons.guide_days}</span></div>}

                  {addons.dj_party && <div className="flex justify-between text-sm mt-4"><span className="text-purple-400 pl-4">+ Event DJ Contract</span> <span>₹16000</span></div>}
                  {addons.firecamp && <div className="flex justify-between text-sm"><span className="text-orange-400 pl-4">+ Firecamp Access</span> <span>₹4000</span></div>}
                  {addons.food && <div className="flex justify-between text-sm"><span className="text-amber-400 pl-4">+ Menu Subsidy</span> <span>₹7200</span></div>}
                  {addons.tv && <div className="flex justify-between text-sm"><span className="text-blue-400 pl-4">+ Cinematic Screens</span> <span>₹800</span></div>}
                  {addons.wifi && <div className="flex justify-between text-sm"><span className="text-slate-500 pl-4">+ Cyber Access</span> <span>₹400</span></div>}

                  {addons.laundry && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Express Laundry</span> <span>₹300</span></div>}
                  {addons.luggage_assistant && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Luggage Assistant</span> <span>₹150</span></div>}
                  {addons.swimming_pool && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Swim Pool Access</span> <span>₹800</span></div>}
                  {addons.medical_support && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ 24x7 Medical Support</span> <span>₹0</span></div>}
                  {addons.parlor && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Beauty Parlor</span> <span>₹1000</span></div>}
                  {addons.saloon && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Saloon Serv.</span> <span>₹1000</span></div>}
                  {addons.food_court && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Food Court Infinity Pass</span> <span>₹500</span></div>}
                  {addons.tourist_guides && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Tourism Guide</span> <span>₹1500</span></div>}
                  {addons.meditation_session && <div className="flex justify-between text-sm"><span className="text-emerald-400 pl-4">+ Zen Meditation Session</span> <span>₹500</span></div>}
              </div>

              <div className="flex justify-between mt-6 pt-6 border-t-2 border-slate-600 text-2xl font-black tracking-widest">
                <span>FINAL OBLIGATION</span>
                <span className="text-emerald-400">₹{calculateTotalObligation()}</span>
              </div>
            </div>

            <div className="mb-8 border border-slate-600 rounded-xl p-6 bg-slate-900 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
               <h3 className="text-lg font-bold text-white mb-2 ml-4">IoT Parking Subsystem Radar</h3>
               {parkingDetails.available_slots === null ? (
                   <div className="ml-4 text-slate-400">Scanning physical slots...</div>
               ) : parkingDetails.available_slots > 0 ? (
                   <div className="ml-4 flex flex-col gap-4">
                       <span className="text-blue-400 font-bold">{parkingDetails.available_slots} / 50 Standard Slots Available</span>
                       <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-blue-500/30 hover:border-blue-500 transition-colors bg-blue-900/20 w-max">
                           <input type="checkbox" checked={parkingDetails.required} onChange={e => setParkingDetails({...parkingDetails, required: e.target.checked})} className="w-5 h-5 rounded-md bg-slate-800 checked:bg-blue-500" />
                           <span className="text-blue-100 font-semibold">Reserve Private Slot (+₹200 flat IoT Access Fee)</span>
                       </label>
                   </div>
               ) : (
                   <div className="ml-4 text-red-500 font-bold border border-red-500/30 bg-red-900/10 p-4 rounded-xl">
                       🚨 ALERT: Parking is currently at maximum capacity. No internal slots can be assigned. Please utilize external municipal slots near the facility.
                   </div>
               )}
            </div>

            <div className="flex gap-4 mb-8">
               <button onClick={() => setPaymentMethod('Offline')} className={`w-1/2 p-6 border-2 rounded-xl text-lg font-bold transition ${paymentMethod === 'Offline' ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400' : 'border-slate-700 hover:bg-slate-700'}`}>Settle Tab At Hotel Frontdesk</button>
               <button onClick={() => setPaymentMethod('Online')} className={`w-1/2 p-6 border-2 rounded-xl text-lg font-bold transition ${paymentMethod === 'Online' ? 'border-blue-500 bg-blue-900/30 text-blue-400' : 'border-slate-700 hover:bg-slate-700'}`}>Instant Secure Online Transfer</button>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(4)} className="text-slate-400 hover:text-white">Modify Extra Services</button>
              <button onClick={handleFinalizeBooking} disabled={loading} className="bg-gradient-to-tr from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white shadow-xl shadow-blue-900/40 px-12 py-4 rounded-xl font-bold flex items-center gap-2 uppercase tracking-wide">
                {loading ? 'Transmitting Data...' : 'Confirm Total Booking Contract'}
              </button>
            </div>
          </div>
        )}

        {/* 6. Success Output with QR Intercept */}
        {step === 6 && (
          <div className="bg-slate-800 border-2 border-emerald-500 rounded-xl p-16 text-center shadow-2xl">
            <CheckCircle size={80} className="text-emerald-400 mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl font-black mb-4 tracking-tight">Contract Secured Successfully!</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Your {totalHours}-hour reservation for the {selectedRoom?.type} has been established in our primary databases.
            </p>
            
            {finalReceipt?.parking_details?.assigned_slot && (
               <div className="max-w-md mx-auto mb-10 bg-black/40 border border-blue-500/40 p-8 rounded-2xl flex flex-col items-center shadow-lg shadow-blue-900/20">
                   <h3 className="text-xl font-bold text-blue-400 mb-2">Automated Parking Clearance</h3>
                   <span className="text-slate-400 mb-6">Slot Assignment: <strong className="text-white text-2xl">#{finalReceipt.parking_details.assigned_slot}</strong></span>
                   <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-blue-500">
                       <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AURA_BOOKING_${finalReceipt._id}_SLOT_${finalReceipt.parking_details.assigned_slot}`} alt="QR Code Boundary Pass" className="w-full" />
                   </div>
                   <p className="text-sm text-blue-300 mt-6 mt-4">Present this secured QR signature to the Boom-barrier scanners for autonomous access.</p>
               </div>
            )}

            <button onClick={() => navigate('/')} className="px-10 py-4 bg-slate-900 hover:bg-black rounded-lg font-bold border border-slate-700 transition text-emerald-500 hover:text-white">Return to External Hub</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingWizard;
