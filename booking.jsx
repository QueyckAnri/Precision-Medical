import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SURGEONS } from './data/surgeonsData.js';

const DOCTOR_SCHEDULES = {
  lapshov: [
    { date: 'Mon, Jul 20', slots: ['09:00', '10:30', '14:00'] },
    { date: 'Tue, Jul 21', slots: ['11:00', '15:30'] },
    { date: 'Thu, Jul 23', slots: ['09:30', '13:00', '16:00'] }
  ],
  vasilieva: [
    { date: 'Tue, Jul 21', slots: ['09:00', '10:00', '14:30'] },
    { date: 'Wed, Jul 22', slots: ['11:30', '15:00', '16:30'] },
    { date: 'Fri, Jul 24', slots: ['09:30', '13:00'] }
  ],
  petrov: [
    { date: 'Mon, Jul 20', slots: ['11:00', '13:30', '15:00'] },
    { date: 'Wed, Jul 22', slots: ['09:00', '10:30', '16:00'] },
    { date: 'Thu, Jul 23', slots: ['14:00', '15:30'] }
  ],
  sorokina: [
    { date: 'Tue, Jul 21', slots: ['10:00', '13:00', '14:30'] },
    { date: 'Thu, Jul 23', slots: ['09:00', '11:30', '15:00'] },
    { date: 'Fri, Jul 24', slots: ['10:30', '14:00', '16:00'] }
  ],
  kovalev: [
    { date: 'Mon, Jul 20', slots: ['10:00', '14:30', '16:00'] },
    { date: 'Wed, Jul 22', slots: ['09:30', '11:00', '13:30'] },
    { date: 'Fri, Jul 24', slots: ['11:30', '15:00'] }
  ]
};

function BookingForm() {
  const params = new URLSearchParams(window.location.search);
  const preselectedId = params.get('surgeon');
  const preselected = preselectedId ? SURGEONS.find(s => s.id === preselectedId) : null;

  const [selectedSurgeon, setSelectedSurgeon] = useState(preselected || null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null); // { date: string, time: string }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSelectSurgeon = (s) => {
    setSelectedSurgeon(s);
    setSelectedSlot(null);
    setSelectedDayIndex(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-[#F9F9F9] min-h-[85vh] px-margin-mobile md:px-margin-desktop py-xl pb-32 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Heading Section */}
        <div className="border-b border-black/5 pb-8 mb-12">
          <div className="text-[10px] tracking-[0.15em] font-mono text-[#F55F24] mb-2.5 uppercase font-bold">
            Precision Medical / Consultation Request
          </div>
          <h1 className="text-[40px] md:text-[68px] font-bold uppercase tracking-tight leading-[0.9] text-[#262323] font-serif">
            Consult a<br />Neurosurgeon
          </h1>
        </div>

        {/* Two-Column Booking Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* ── Left: Specialist Selector ─────────────────── */}
          <div className="flex flex-col gap-6">
            <div className="text-[10px] tracking-wider font-mono text-black/40 uppercase font-bold">
              Select Your Specialist
            </div>

            {/* Selected Specialist Highlight Card */}
            {selectedSurgeon && (
              <div className="border border-[#F55F24]/30 p-6 bg-[#F55F24]/5 rounded-2xl shadow-[0_0_12px_rgba(245,95,36,0.02)] transition-all duration-300">
                <div className="text-[9px] tracking-wider font-mono text-[#F55F24] uppercase mb-1.5 font-bold">
                  Selected Specialist
                </div>
                <div className="text-[20px] font-bold uppercase text-[#262323] leading-tight" style={{ fontFamily: 'Tiposka, sans-serif' }}>
                  {selectedSurgeon.name}
                </div>
                <div className="text-[11px] tracking-wide text-black/60 uppercase font-mono mt-1">
                  {selectedSurgeon.specialty} · {selectedSurgeon.experience} YRS · RATING {selectedSurgeon.rating}
                </div>
              </div>
            )}

            {/* Surgeon List Stack */}
            <div className="border border-black/5 bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm">
              {SURGEONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSurgeon(s)}
                  className={`w-full text-left p-4 border-b border-black/5 transition-all duration-300 flex flex-col gap-1 last:border-b-0 ${
                    selectedSurgeon?.id === s.id
                      ? 'border-l-4 border-l-[#F55F24] bg-[#F55F24]/5 pl-3'
                      : 'hover:bg-black/[0.01]'
                  }`}
                >
                  <div className="text-[15px] font-bold text-[#262323] font-sans">
                    {s.name}
                  </div>
                  <div className="text-[10px] tracking-wider font-mono text-black/40 uppercase">
                    {s.specialty}
                  </div>
                </button>
              ))}
            </div>

            {/* Interactive Schedule Calendar Block */}
            <div className="border border-black/5 bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4 mt-2">
              <div className="text-[10px] tracking-wider font-mono text-black/40 uppercase font-bold">
                Available Appointment Hours
              </div>

              {!selectedSurgeon ? (
                <div className="text-[13px] text-black/40 py-6 text-center italic">
                  Select a specialist above to check availability.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Days Selector */}
                  <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
                    {(DOCTOR_SCHEDULES[selectedSurgeon.id] || []).map((day, idx) => (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`px-4 py-2 text-[12px] font-mono font-bold rounded-lg border transition-all duration-200 whitespace-nowrap ${
                          selectedDayIndex === idx
                            ? 'bg-[#F55F24]/5 border-[#F55F24] text-[#F55F24]'
                            : 'bg-white border-black/5 text-[#262323]/60 hover:text-[#262323] hover:border-black/20'
                        }`}
                      >
                        {day.date}
                      </button>
                    ))}
                  </div>

                  {/* Hours Grid */}
                  <div>
                    {(!DOCTOR_SCHEDULES[selectedSurgeon.id] || DOCTOR_SCHEDULES[selectedSurgeon.id].length === 0) ? (
                      <div className="text-xs text-black/40 italic py-2">No slots available.</div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {DOCTOR_SCHEDULES[selectedSurgeon.id][selectedDayIndex]?.slots.map((time) => {
                          const isSelected = selectedSlot?.date === DOCTOR_SCHEDULES[selectedSurgeon.id][selectedDayIndex].date && selectedSlot?.time === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setSelectedSlot({
                                  date: DOCTOR_SCHEDULES[selectedSurgeon.id][selectedDayIndex].date,
                                  time: time
                                });
                              }}
                              className={`py-2 px-3 text-[13px] font-mono font-bold border rounded-xl text-center transition-all duration-200 ${
                                isSelected
                                  ? 'bg-[#F55F24] border-[#F55F24] text-white shadow-md shadow-[#F55F24]/10'
                                  : 'bg-white border-black/5 text-[#262323] hover:border-[#F55F24]/50 hover:bg-[#F55F24]/5'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Slot selection confirmation alert */}
                  {selectedSlot && (
                    <div className="mt-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-1.5 font-sans font-medium">
                      <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                      <span>Selected slot: {selectedSlot.date} @ {selectedSlot.time}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Consultation Contact Form ─────────── */}
          <div>
            {submitted ? (
              <div className="border border-[#F55F24]/20 p-8 bg-[#F55F24]/5 rounded-3xl shadow-sm flex flex-col gap-6">
                <div>
                  <div className="text-[24px] font-bold uppercase tracking-tight text-[#262323] mb-2" style={{ fontFamily: 'Tiposka, sans-serif' }}>
                    Consultation Requested
                  </div>
                  <p className="text-[15px] leading-relaxed text-black/75 font-sans">
                    Your reservation request has been registered in the system. A coordinator will contact you to confirm the appointment.
                  </p>
                </div>

                {/* Ticket Details Summary */}
                <div className="bg-white border border-black/5 p-6 rounded-2xl flex flex-col gap-4 font-sans shadow-sm relative overflow-hidden">
                  <div className="text-[10px] tracking-wider font-mono text-[#F55F24] uppercase font-bold border-b border-black/5 pb-2">
                    Appointment Ticket Summary
                  </div>
                  
                  <div className="flex flex-col gap-2.5 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-black/40">Patient:</span>
                      <span className="font-bold text-[#262323]">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40">Email:</span>
                      <span className="text-[#262323]">{formData.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex justify-between">
                        <span className="text-black/40">Phone:</span>
                        <span className="text-[#262323]">{formData.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-dashed border-black/10 pt-2.5 mt-1">
                      <span className="text-black/40 font-semibold">Surgeon:</span>
                      <span className="font-bold text-[#262323]">{selectedSurgeon?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 font-semibold">Date &amp; Time:</span>
                      <span className="font-bold text-[#F55F24] font-mono">{selectedSlot?.date} @ {selectedSlot?.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
                    setSelectedSlot(null);
                    setSelectedDayIndex(0);
                  }}
                  className="py-3 px-6 bg-[#262323] hover:bg-[#3d3838] text-white rounded-full text-center font-mono font-bold tracking-wider text-[11px] uppercase transition-all duration-300 self-start"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="text-[10px] tracking-wider font-mono text-black/40 uppercase font-bold">
                  Your Contact Details
                </div>

                {/* First Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-wider font-mono text-black/50 uppercase font-bold" htmlFor="firstName">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(d => ({ ...d, firstName: e.target.value }))}
                    className="w-full bg-white border border-black/10 focus:border-[#F55F24] focus:ring-1 focus:ring-[#F55F24] rounded-xl px-4 py-3 text-[15px] text-[#262323] outline-none transition-all font-sans"
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-wider font-mono text-black/50 uppercase font-bold" htmlFor="lastName">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(d => ({ ...d, lastName: e.target.value }))}
                    className="w-full bg-white border border-black/10 focus:border-[#F55F24] focus:ring-1 focus:ring-[#F55F24] rounded-xl px-4 py-3 text-[15px] text-[#262323] outline-none transition-all font-sans"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-wider font-mono text-black/50 uppercase font-bold" htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
                    className="w-full bg-white border border-black/10 focus:border-[#F55F24] focus:ring-1 focus:ring-[#F55F24] rounded-xl px-4 py-3 text-[15px] text-[#262323] outline-none transition-all font-sans"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-wider font-mono text-black/50 uppercase font-bold" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(d => ({ ...d, phone: e.target.value }))}
                    className="w-full bg-white border border-black/10 focus:border-[#F55F24] focus:ring-1 focus:ring-[#F55F24] rounded-xl px-4 py-3 text-[15px] text-[#262323] outline-none transition-all font-sans"
                  />
                </div>

                {/* Message / Case Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-wider font-mono text-black/50 uppercase font-bold" htmlFor="message">
                    Describe Your Case
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(d => ({ ...d, message: e.target.value }))}
                    placeholder="Briefly describe your diagnosis, symptoms, or question..."
                    className="w-full bg-white border border-black/10 focus:border-[#F55F24] focus:ring-1 focus:ring-[#F55F24] rounded-xl px-4 py-3 text-[15px] text-[#262323] outline-none transition-all resize-none font-sans"
                  />
                </div>

                {/* Booking Action CTA */}
                <button
                  type="submit"
                  disabled={!selectedSlot}
                  className="w-full py-4 bg-[#F55F24] hover:bg-[#e04e14] text-white rounded-full font-mono font-bold tracking-widest text-[11px] uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(245,95,36,0.15)] hover:shadow-[0_4px_20px_rgba(245,95,36,0.3)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed mt-4"
                >
                  {selectedSurgeon && selectedSlot 
                    ? `Request for ${selectedSlot.date} @ ${selectedSlot.time}` 
                    : 'Select a time slot above'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const el = document.getElementById('booking-root');
if (el) {
  createRoot(el).render(
    <React.StrictMode>
      <BookingForm />
    </React.StrictMode>
  );
}
