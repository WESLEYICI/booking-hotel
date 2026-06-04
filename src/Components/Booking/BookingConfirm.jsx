import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheckCircle } from 'react-icons/fa';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { Spinner } from 'flowbite-react';
import api from '../../utils/api';

export default function Component({ setIsAuthenticated, isAuthenticated, setUser }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalcekdiskon, setModalcekDiskon] = useState(false);
  const [modalDiskon, setModalDiskon] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [hargaDiskon, setHargaDiskon] = useState(null);
  const [navigateData, setNavigateData] = useState(null);
  const [gatewayError, setGatewayError] = useState('');
  const [snapLoaded, setSnapLoaded] = useState(false);
  const state = location.state || {};
  const { name, harga, daysBetween, Checkin, Checkout } = state;
  const bookingReady = Boolean(name && harga && daysBetween && Checkin && Checkout);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (err) {
        console.error('Token validation failed:', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, []);

  const Toggler = () => {
    setOpenModal(!openModal);
  };

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    phone_number: '',
    payment_type: 'bank_transfer',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const goToMyBookings = () => {
    navigate('/my-bookings', { state: navigateData });
  };

  const Cekdiskon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/Discount/Cek', { harga, code });
      setMessage(`Selamat Anda Berhasil Mendapatkan Diskon sebesar %${res.data.diskon}`);
      setModalcekDiskon(true);
      setHargaDiskon(res.data);
    } catch (err) {
      setModalcekDiskon(true);
      setError(err.response?.data?.message || 'Gagal Menggunakan Diskon');
      console.log(err.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('nama', formData.nama);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('name', state.name);
    formDataToSend.append('check_in', state.Checkin);
    formDataToSend.append('check_out', state.Checkout);
    formDataToSend.append('harga', hargaDiskon ? hargaDiskon.harga_setelah_diskon : harga);
    formDataToSend.append('payment_type', formData.payment_type);

    try {
      const response = await api.post('/bookings', formDataToSend);
      const booking = response.data.booking || response.data;
      const payment = response.data.payment;

      if (payment?.snap_token && window.snap) {
        window.snap.pay(payment.snap_token, {
          onSuccess: async (result) => {
            setLoading(false);
            setSuccess(true);
            try {
              await api.patch(`/bookings/${booking.id}/status`, { status: 'confirmed' });
            } catch (updateErr) {
              console.error('Gagal auto-confirm:', updateErr);
            }
            setNavigateData({
              booking_id: booking.id,
              nama: formData.nama,
              email: formData.email,
              phone_number: formData.phone_number,
              harga: hargaDiskon ? hargaDiskon.harga_setelah_diskon : harga,
              name,
              daysBetween,
            });
          },
          onPending: (result) => {
            setLoading(false);
            setSuccess(true);
            setNavigateData({
              booking_id: booking.id,
              nama: formData.nama,
              email: formData.email,
              phone_number: formData.phone_number,
              harga: hargaDiskon ? hargaDiskon.harga_setelah_diskon : harga,
              name,
              daysBetween,
            });
          },
          onError: (result) => {
            setLoading(false);
            alert('Pembayaran gagal. Silakan coba lagi.');
            console.error('Midtrans error:', result);
          },
          onClose: () => {
            setLoading(false);
            alert('Pembayaran dibatalkan. Silakan coba lagi.');
          },
        });
      } else {
        setLoading(false);
        setSuccess(true);
      }
    } catch (err) {
      setLoading(false);
      alert('Gagal membuat booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-hotel-dark/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner color="info" size="xl" />
          <p className="text-white/60 text-sm">Processing your booking...</p>
        </div>
      </div>
    );

  if (!bookingReady)
    return (
      <div className="min-h-screen flex items-center justify-center bg-hotel-cream pt-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-hotel-accent/10 flex items-center justify-center">
            <HiOutlineExclamationCircle className="h-10 w-10 text-hotel-accent" />
          </div>
          <p className="text-lg font-semibold text-hotel-primary">Data booking tidak tersedia.</p>
          <p className="text-hotel-charcoal/50 text-sm mt-2">Silakan kembali ke halaman pemesanan.</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-hotel-cream pt-24 pb-16">
        <div className="max-w-screen-lg mx-auto px-4 md:px-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {['Room Details', 'Confirmation', 'Payment'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= 1 ? 'bg-hotel-accent text-hotel-primary' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium hidden md:block ${
                  i <= 1 ? 'text-hotel-primary' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {i < 2 && <div className={`w-12 md:w-20 h-[2px] ${i < 1 ? 'bg-hotel-accent' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <h1 className="font-playfair text-3xl md:text-4xl text-hotel-primary font-bold text-center mb-10">
            Booking Confirmation
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Booking Details & Price */}
            <div className="space-y-6">
              {/* Booking Details */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-hotel-accent/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-hotel-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-hotel-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-lg font-semibold text-hotel-primary">Booking Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-hotel-charcoal/50 text-sm">Check-in</span>
                    <span className="text-hotel-primary font-semibold text-sm">{Checkin}, from 11:00 am</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-hotel-charcoal/50 text-sm">Check-out</span>
                    <span className="text-hotel-primary font-semibold text-sm">{Checkout}, until 10:00 am</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-hotel-accent/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-hotel-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-hotel-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-lg font-semibold text-hotel-primary">Price Breakdown</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-hotel-charcoal/50 text-sm">Room</span>
                    <span className="text-hotel-primary text-sm">{name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-hotel-charcoal/50 text-sm">Duration</span>
                    <span className="text-hotel-primary text-sm">{daysBetween} Nights</span>
                  </div>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-hotel-accent/20 to-transparent my-2" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-hotel-primary font-semibold">Total</span>
                    {!hargaDiskon ? (
                      <span className="font-playfair text-xl font-bold text-hotel-primary">Rp {formatPrice(harga)}</span>
                    ) : (
                      <div className="text-right">
                        <span className="line-through text-hotel-charcoal/30 text-sm block">Rp {formatPrice(harga)}</span>
                        <span className="font-playfair text-xl font-bold text-hotel-success">Rp {formatPrice(hargaDiskon.harga_setelah_diskon)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Guest Form */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-hotel-accent/5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-hotel-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-hotel-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-playfair text-lg font-semibold text-hotel-primary">Guest Information</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-premium w-full text-sm"
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="input-premium w-full text-sm"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="input-premium w-full text-sm"
                    placeholder="081234567890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">Payment Method</label>
                  <select
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={handleChange}
                    className="input-premium w-full text-sm"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="gopay">GoPay</option>
                    <option value="shopeepay">ShopeePay</option>
                    <option value="credit_card">Credit Card</option>
                  </select>
                </div>

                {gatewayError && <p className="text-sm text-hotel-danger">{gatewayError}</p>}

                {/* Total */}
                <div className="bg-hotel-accent/5 rounded-xl p-4 border border-hotel-accent/10">
                  <div className="flex justify-between items-center">
                    <span className="text-hotel-primary font-medium text-sm">Total Payment</span>
                    {!hargaDiskon ? (
                      <span className="font-playfair text-lg font-bold text-hotel-primary">Rp {formatPrice(harga)}</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-hotel-charcoal/30 text-sm">Rp {formatPrice(harga)}</span>
                        <span className="font-playfair text-lg font-bold text-hotel-success">Rp {formatPrice(hargaDiskon.harga_setelah_diskon)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type={isAuthenticated ? 'submit' : 'button'}
                    onClick={isAuthenticated ? undefined : Toggler}
                    className="flex-1 btn-gold shimmer-btn py-3 rounded-xl text-sm font-semibold tracking-wider uppercase"
                  >
                    Book Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalDiskon(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 border-hotel-accent/30 text-hotel-primary hover:bg-hotel-accent/5 transition-all duration-300"
                  >
                    <RiDiscountPercentFill className="text-hotel-accent" />
                    Discount
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      <Modal show={modalDiskon} onClose={() => setModalDiskon(false)}>
        <ModalHeader className="bg-white rounded-t-xl">
          <span className="text-hotel-primary font-playfair font-semibold">Apply Discount Code</span>
        </ModalHeader>
        <ModalBody className="bg-white rounded-b-xl">
          <form onSubmit={Cekdiskon} className="space-y-4">
            <input
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={`input-premium w-full text-sm ${hargaDiskon ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Enter discount code"
              disabled={hargaDiskon}
              required={!hargaDiskon}
            />
            <div className="bg-hotel-accent/5 rounded-xl p-4 border border-hotel-accent/10">
              {!hargaDiskon ? (
                <p className="text-hotel-primary font-semibold">Rp {formatPrice(harga)}</p>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="line-through text-hotel-charcoal/30">Rp {formatPrice(harga)}</p>
                  <p className="text-hotel-success font-bold">Rp {formatPrice(hargaDiskon.harga_setelah_diskon)}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
                Check
              </button>
              {hargaDiskon && (
                <button
                  type="button"
                  onClick={() => setModalDiskon(false)}
                  className="bg-hotel-success text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all"
                >
                  Apply
                </button>
              )}
            </div>
          </form>
        </ModalBody>
      </Modal>

      {/* Login Required Modal */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hotel-accent/10 flex items-center justify-center">
              <HiOutlineExclamationCircle className="h-8 w-8 text-hotel-accent" />
            </div>
            <h3 className="mb-5 text-lg font-semibold text-hotel-primary">
              Untuk memesan hotel, Anda harus login terlebih dahulu
            </h3>
            <button
              onClick={() => setOpenModal(false)}
              className="w-full px-6 py-2.5 rounded-xl bg-hotel-accent text-hotel-primary text-sm font-semibold hover:bg-hotel-accent-light transition-all duration-300"
            >
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* Success Modal */}
      <Modal show={success} size="md" onClose={() => setSuccess(false)} popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
              <FaCheckCircle className="h-8 w-8 text-hotel-success" />
            </div>
            <h3 className="mb-5 text-lg font-semibold text-hotel-primary">
              Booking Berhasil! Silahkan lanjutkan pembayaran di halaman My Bookings
            </h3>
            <button
              onClick={() => {
                setSuccess(false);
                goToMyBookings();
              }}
              className="w-full px-6 py-2.5 rounded-xl bg-hotel-success text-white text-sm font-semibold hover:bg-green-600 transition-all duration-300"
            >
              Go to My Bookings
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* Discount Check Modal */}
      <Modal show={modalcekdiskon} size="md" onClose={() => setModalcekDiskon(false)} popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            {error && !message ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <HiOutlineExclamationCircle className="h-8 w-8 text-hotel-danger" />
                </div>
                <h3 className="mb-5 text-lg font-semibold text-hotel-primary">{error}</h3>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <FaCheckCircle className="h-8 w-8 text-hotel-success" />
                </div>
                <h3 className="mb-5 text-lg font-semibold text-hotel-primary">{message}</h3>
              </>
            )}
            <button
              onClick={() => setModalcekDiskon(false)}
              className="w-full px-6 py-2.5 rounded-xl bg-hotel-accent text-hotel-primary text-sm font-semibold hover:bg-hotel-accent-light transition-all duration-300"
            >
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
