import { useLocation } from 'react-router-dom';
import { FaUser, FaEye, FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { SlSizeFullscreen } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';

export default function Component({ handlebook }) {
  const [Checkin, setCheckin] = useState('');
  const [Checkout, setCheckout] = useState('');
  const [daysBetween, setdaysBetween] = useState(null);
  const [harga, setHarga] = useState(null);

  const location = useLocation();
  const { room_id, name, Price, imageUrl, imageUrl2, user, facility, size, description, amenities, searchCheckIn, searchCheckOut } = location.state || {};
  
  useEffect(() => {
    if (searchCheckIn && searchCheckOut) {
      setCheckin(searchCheckIn);
      setCheckout(searchCheckOut);
      calculateDays(searchCheckIn, searchCheckOut);
    }
  }, [searchCheckIn, searchCheckOut]);

  const handleDateCheckin = (e) => {
    const selectedDate = e.target.value;
    setCheckin(selectedDate);
    calculateDays(selectedDate, Checkout);
  };

  const handleDateCheckout = (e) => {
    const selectedDate = e.target.value;
    setCheckout(selectedDate);
    calculateDays(Checkin, selectedDate);
  };

  const calculateDays = (checkinDate, checkoutDate) => {
    if (checkinDate && checkoutDate) {
      const checkin = new Date(checkinDate);
      const checkout = new Date(checkoutDate);
      const SelisihWaktu = checkout - checkin;
      const SelisihHari = Math.ceil(SelisihWaktu / (1000 * 60 * 60 * 24));
      const harga = SelisihHari * Price;
      setdaysBetween(SelisihHari);
      setHarga(harga);
    } else {
      setdaysBetween(null);
    }
  };

  const Navigate = useNavigate();

  const handelBooking = () => {
    if (Checkin && Checkout) {
      Navigate('/BookingConfirm', {
        state: {
          room_id,
          name,
          harga,
          daysBetween,
          Checkin,
          Checkout,
        },
      });
      handlebook();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Please select checkin and checkout date');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <div className="min-h-screen bg-hotel-cream pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-hotel-charcoal/40 mb-8">
          <span className="hover:text-hotel-accent cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-hotel-accent cursor-pointer transition-colors">Rooms</span>
          <span>/</span>
          <span className="text-hotel-primary font-medium">{name}</span>
        </div>

        {/* Room Title */}
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-hotel-primary font-bold mb-8">{name}</h1>

        {/* Main Image */}
        <div className="img-zoom rounded-2xl overflow-hidden shadow-premium mb-10 max-h-[500px]">
          <img className="w-full h-full object-cover" src={imageUrl} alt={name} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-card border border-hotel-accent/5 mb-8">
              <h3 className="font-playfair text-xl font-semibold text-hotel-primary mb-4">About This Room</h3>
              <div className="section-divider !ml-0 !w-12 mb-6" />
              <p className="text-hotel-charcoal/60 text-base leading-relaxed">{description}</p>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="img-zoom rounded-xl overflow-hidden shadow-card">
                <img src={imageUrl} alt={name} className="w-full h-48 md:h-64 object-cover" />
              </div>
              <div className="img-zoom rounded-xl overflow-hidden shadow-card">
                <img src={imageUrl2} alt={name} className="w-full h-48 md:h-64 object-cover" />
              </div>
            </div>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-hotel-accent/5">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-playfair text-2xl font-bold text-hotel-primary">
                  Rp {formatPrice(Price)}
                </span>
                <span className="text-hotel-charcoal/40 text-sm">/ night</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-hotel-accent/10 flex items-center justify-center">
                    <FaUser className="text-xs text-hotel-accent" />
                  </div>
                  <div>
                    <p className="text-hotel-charcoal/40 text-xs">Guests</p>
                    <p className="text-hotel-primary font-medium">{user} Adults</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-hotel-accent/10 flex items-center justify-center">
                    <FaEye className="text-xs text-hotel-accent" />
                  </div>
                  <div>
                    <p className="text-hotel-charcoal/40 text-xs">View</p>
                    <p className="text-hotel-primary font-medium capitalize">{facility}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-hotel-accent/10 flex items-center justify-center">
                    <SlSizeFullscreen className="text-xs text-hotel-accent" />
                  </div>
                  <div>
                    <p className="text-hotel-charcoal/40 text-xs">Size</p>
                    <p className="text-hotel-primary font-medium">{size}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-hotel-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaStar className="text-xs text-hotel-accent" />
                  </div>
                  <div>
                    <p className="text-hotel-charcoal/40 text-xs">Amenities</p>
                    <p className="text-hotel-primary font-medium text-xs leading-relaxed">{amenities}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-hotel-accent/5">
              <h4 className="font-playfair text-lg font-semibold text-hotel-primary mb-5">Reserve Your Stay</h4>
              <div className="section-divider !ml-0 !w-10 mb-6" />

              <div className="space-y-4">
                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                    <HiOutlineCalendar className="inline mr-1" /> Check-in Date
                  </label>
                  <input
                    type="date"
                    value={Checkin}
                    onChange={handleDateCheckin}
                    className="input-premium w-full text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                    <HiOutlineCalendar className="inline mr-1" /> Check-out Date
                  </label>
                  <input
                    type="date"
                    value={Checkout}
                    onChange={handleDateCheckout}
                    className="input-premium w-full text-sm"
                    required
                  />
                </div>

                {daysBetween && harga !== null && (
                  <div className="bg-hotel-accent/5 rounded-xl p-4 border border-hotel-accent/10">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-hotel-charcoal/60">{daysBetween} Nights</span>
                      <span className="text-hotel-primary font-semibold">Rp {formatPrice(harga)}</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handelBooking}
                  className="w-full btn-gold shimmer-btn py-3 rounded-xl text-sm font-semibold tracking-wider uppercase"
                >
                  {daysBetween && harga !== null ? 'Confirm Reservation' : 'Check Availability'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
