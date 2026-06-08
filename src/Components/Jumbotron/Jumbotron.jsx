import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import './jumbotron.css';

const Jumbotron = ({ user, onSearch }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  // Tanggal minimum: hari ini
  const today = new Date().toISOString().split('T')[0];

  // Tanggal minimum check-out: besok atau sehari setelah check-in
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];

  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckIn(val);
    // Reset check-out jika tidak lagi valid
    if (checkOut && checkOut <= val) setCheckOut('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ checkIn, checkOut, guests });
    }
    const element = document.getElementById('rooms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <section className="relative h-screen bg-center bg-no-repeat bg-cover bg-[url('https://wallpaperaccess.com/full/2690784.jpg')] overflow-hidden">
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/80 via-hotel-primary/60 to-hotel-dark/90" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-hotel-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-hotel-accent/3 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center mt-[-4rem]">
          {/* Decorative line */}
          <div className="w-12 h-[1px] bg-hotel-accent mb-6 opacity-0 animate-fade-in" />

          <p className="text-hotel-accent font-inter text-sm md:text-base tracking-[0.35em] uppercase mb-4 opacity-0 animate-fade-in-up delay-100">
            Welcome To
          </p>

          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 opacity-0 animate-fade-in-up delay-200">
            My Hotels
          </h1>

          <p className="font-inter text-white/60 text-sm md:text-base max-w-md mb-10 opacity-0 animate-fade-in-up delay-300">
            Experience luxury beyond imagination. Your perfect stay awaits.
          </p>

          {/* Decorative line */}
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-hotel-accent to-transparent mb-10 opacity-0 animate-fade-in delay-400" />
        </div>

        {/* Search Bar Panel — hanya tampil untuk tamu/user biasa */}
        {user?.role !== 'admin' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-20">
          <div className="opacity-0 animate-fade-in-up delay-500">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
              
              <div className="flex-1 flex items-center bg-white/5 rounded-xl md:rounded-l-full md:rounded-r-none px-6 py-4 w-full border-b md:border-b-0 md:border-r border-white/10">
                <HiOutlineCalendar className="text-hotel-accent text-xl mr-3" />
                <div className="w-full text-left">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Check-in</p>
                  <input 
                    type="date" 
                    value={checkIn}
                    min={today}
                    onChange={handleCheckInChange}
                    required
                    className="w-full bg-transparent border-none text-white p-0 text-sm focus:ring-0 [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center bg-white/5 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-white/10">
                <HiOutlineCalendar className="text-hotel-accent text-xl mr-3" />
                <div className="w-full text-left">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Check-out</p>
                  <input 
                    type="date" 
                    value={checkOut}
                    min={minCheckOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full bg-transparent border-none text-white p-0 text-sm focus:ring-0 [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center bg-white/5 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-white/10">
                <HiOutlineUserGroup className="text-hotel-accent text-xl mr-3" />
                <div className="w-full text-left">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Guests</p>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent border-none text-white p-0 text-sm focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="1" className="text-black">1 Guest</option>
                    <option value="2" className="text-black">2 Guests</option>
                    <option value="3" className="text-black">3 Guests</option>
                    <option value="4" className="text-black">4+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="w-full md:w-auto p-1.5 md:p-2">
                <button
                  type="submit"
                  className="w-full btn-gold shimmer-btn px-8 py-4 rounded-xl md:rounded-full text-sm font-semibold tracking-wider uppercase whitespace-nowrap shadow-premium"
                >
                  Check Availability
                </button>
              </div>

            </form>
          </div>
          </div>
        </div>
        )}

        {/* Scroll indicator - Moved up slightly */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in delay-600 hidden md:flex">
          <div className="w-[1px] h-8 bg-gradient-to-b from-hotel-accent/60 to-transparent scroll-line" />
        </div>
      </section>
    </div>
  );
};

export default Jumbotron;
