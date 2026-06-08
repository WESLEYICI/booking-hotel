import { useLocation } from 'react-router-dom';
import { FaUser, FaEye, FaStar, FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { SlSizeFullscreen } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';
import api from '../../utils/api';

export default function Component({ handlebook }) {
  const [Checkin, setCheckin] = useState('');
  const [Checkout, setCheckout] = useState('');
  const [daysBetween, setdaysBetween] = useState(null);
  const [harga, setHarga] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avg_rating: 0, total_reviews: 0 });

  const location = useLocation();
  const { room_id, name, Price, imageUrl, imageUrl2, user, facility, size, description, amenities, searchCheckIn, searchCheckOut } = location.state || {};
  
  useEffect(() => {
    if (searchCheckIn && searchCheckOut) {
      setCheckin(searchCheckIn);
      setCheckout(searchCheckOut);
      calculateDays(searchCheckIn, searchCheckOut);
    }
    
    if (room_id) {
      const fetchReviews = async () => {
        try {
          const res = await api.get(`/reviews/room/${room_id}`);
          setReviews(res.data.data || []);
          setReviewStats(res.data.stats || { avg_rating: 0, total_reviews: 0 });
        } catch (err) {
          console.error('Gagal mengambil ulasan kamar:', err);
        }
      };
      fetchReviews();
    }
  }, [searchCheckIn, searchCheckOut, room_id]);

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
        
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => Navigate(-1)} 
            className="flex items-center gap-2 text-hotel-primary font-semibold hover:text-hotel-accent transition-colors"
          >
            <FaArrowLeft /> Kembali
          </button>

          <div className="flex items-center gap-2 text-sm text-hotel-charcoal/40 hidden md:flex">
            <span className="hover:text-hotel-accent cursor-pointer transition-colors" onClick={() => Navigate('/')}>Home</span>
            <span>/</span>
            <span className="hover:text-hotel-accent cursor-pointer transition-colors" onClick={() => Navigate(-1)}>Rooms</span>
            <span>/</span>
            <span className="text-hotel-primary font-medium">{name}</span>
          </div>
        </div>

        {/* Room Title */}
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-hotel-primary font-bold mb-8">{name}</h1>

        {/* Main Image */}
        <div className="img-zoom rounded-2xl overflow-hidden shadow-premium mb-10 max-h-[500px]">
          <img className="w-full h-full object-cover" src={imageUrl} alt={name} onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=No+Image'; }} />
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
                <img src={imageUrl} alt={name} className="w-full h-48 md:h-64 object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }} />
              </div>
              <div className="img-zoom rounded-xl overflow-hidden shadow-card">
                <img src={imageUrl2} alt={name} className="w-full h-48 md:h-64 object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }} />
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

            {/* Guest Reviews Section */}
            <div className="bg-white rounded-2xl p-8 shadow-card border border-hotel-accent/5 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-hotel-primary mb-1">Ulasan Tamu</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className={star <= Math.round(reviewStats.avg_rating) ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-hotel-primary font-bold">{reviewStats.avg_rating}</span>
                    <span className="text-hotel-charcoal/40 text-sm">({reviewStats.total_reviews} Ulasan)</span>
                  </div>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-hotel-charcoal/40 text-sm">Belum ada ulasan untuk kamar ini.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-hotel-accent/10 flex items-center justify-center text-hotel-primary font-bold">
                            {rev.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-hotel-primary">{rev.user_name}</p>
                            <p className="text-[10px] text-hotel-charcoal/40">{new Date(rev.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400 text-xs">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className={star <= rev.rating ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-hotel-charcoal/70 leading-relaxed mt-3 bg-hotel-cream p-4 rounded-xl rounded-tl-none italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
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
